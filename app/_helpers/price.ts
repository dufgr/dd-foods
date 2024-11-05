import type { Product } from "@prisma/client";

export const calculateProductTotalPrice = (
  product: Pick<Product, "discountPercentage"> & {
    price: Product["price"] | number;
  },
): number => {
  // Mantem calculos em centavos alinhados entre a sacola e o pedido persistido.
  return (
    Math.round(
      Number(product.price) * (1 - product.discountPercentage / 100) * 100,
    ) / 100
  );
};

export const formatCurrency = (value: number): string => {
  return `R$${Intl.NumberFormat("pt-BR", {
    currency: "BRL",
    minimumFractionDigits: 2,
  }).format(value)}`;
};
