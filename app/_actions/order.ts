"use server";

import { db } from "../_lib/prisma";
import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import { calculateProductTotalPrice } from "../_helpers/price";

interface OrderItemInput {
  productId: string;
  quantity: number;
}

export const createOrder = async ({ items }: { items: OrderItemInput[] }) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) throw new Error("É necessário entrar para finalizar o pedido.");
  // Rejeita quantidades invalidas, itens duplicados e payloads excessivos.
  if (
    !Array.isArray(items) ||
    items.length === 0 ||
    items.length > 50 ||
    items.some(
      ({ productId, quantity }) =>
        typeof productId !== "string" ||
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 50,
    ) ||
    new Set(items.map(({ productId }) => productId)).size !== items.length
  ) {
    throw new Error("Os itens do pedido são inválidos.");
  }

  const products = await db.product.findMany({
    where: { id: { in: items.map(({ productId }) => productId) } },
    include: { restaurant: true },
  });

  if (products.length !== items.length) {
    throw new Error("Um ou mais produtos não estão disponíveis.");
  }

  const restaurant = products[0].restaurant;
  if (products.some((product) => product.restaurantId !== restaurant.id)) {
    throw new Error("Um pedido só pode conter produtos de um restaurante.");
  }

  // Recalcula precos e entrega com os registros atuais do banco.
  const quantities = new Map(
    items.map(({ productId, quantity }) => [productId, quantity]),
  );
  const subtotalPrice = products.reduce(
    (total, product) =>
      total +
      Math.round(Number(product.price) * 100) * quantities.get(product.id)!,
    0,
  );
  const discountedPrice = products.reduce(
    (total, product) =>
      total +
      Math.round(calculateProductTotalPrice(product) * 100) *
        quantities.get(product.id)!,
    0,
  );
  const deliveryFee = Math.round(Number(restaurant.deliveryFee) * 100);

  // Persiste valores calculados no servidor, sem confiar nos totais do navegador.
  await db.order.create({
    data: {
      userId,
      restaurantId: restaurant.id,
      subtotalPrice: subtotalPrice / 100,
      totalDiscounts: (subtotalPrice - discountedPrice) / 100,
      totalPrice: (discountedPrice + deliveryFee) / 100,
      deliveryFee: deliveryFee / 100,
      deliveryTimeMinutes: restaurant.deliveryTimeMinutes,
      status: "CONFIRMED",
      products: {
        createMany: {
          data: products.map((product) => ({
            productId: product.id,
            quantity: quantities.get(product.id)!,
          })),
        },
      },
    },
  });

  revalidatePath("/my-orders");
};
