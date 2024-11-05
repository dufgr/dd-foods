import { getServerSession } from "next-auth";
import { db } from "../_lib/prisma";
import { authOptions } from "../_lib/auth";
import { redirect } from "next/navigation";
import Header from "../_components/header";
import OrderItem from "./_components/order-item";

// Restringe a consulta de pedidos ao usuario da sessao atual.
const MyOrdersPage = async () => {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return redirect("/");
  }

  const orders = await db.order.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      restaurant: true,
      products: {
        include: {
          product: true,
        },
      },
    },
  });
  const serializedOrders = orders.map((order) => ({
    ...order,
    totalPrice: Number(order.totalPrice),
    restaurant: {
      ...order.restaurant,
      deliveryFee: Number(order.restaurant.deliveryFee),
    },
    products: order.products.map((orderProduct) => ({
      ...orderProduct,
      product: {
        ...orderProduct.product,
        price: Number(orderProduct.product.price),
      },
    })),
  }));

  return (
    <>
      <Header />

      <div className="px-5 py-6">
        <h2 className="pb-6 text-lg font-semibold">Meus Pedidos</h2>

        <div className="space-y-4">
          {serializedOrders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      </div>
    </>
  );
};

export default MyOrdersPage;
