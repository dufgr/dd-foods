import Header from "@/app/_components/header";
import ProductList from "@/app/_components/product-list";
import { db } from "@/app/_lib/prisma";

// Busca produtos com desconto para a vitrine de recomendacoes.
const RecommendedProductsPage = async () => {
  const products = await db.product.findMany({
    where: {
      discountPercentage: {
        gt: 0,
      },
    },
    take: 20,
    include: {
      restaurant: {
        select: {
          name: true,
        },
      },
    },
  });

  // TODO: pegar produtos com mais pedidos
  return (
    <>
      <Header />
      <div className="space-y-4 py-6">
        <h2 className="px-5 text-lg font-semibold">Pedidos Recomendados</h2>
        <ProductList
          products={products.map((product) => ({
            ...product,
            price: Number(product.price),
          }))}
        />
      </div>
    </>
  );
};

export default RecommendedProductsPage;
