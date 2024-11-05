import Header from "@/app/_components/header";
import ProductItem from "@/app/_components/product-item";
import { db } from "@/app/_lib/prisma";
import { notFound } from "next/navigation";

interface CategoriesPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Resolve a categoria pela rota e lista seus produtos disponiveis.
const CategoriesPage = async ({ params }: CategoriesPageProps) => {
  const { id } = await params;
  const category = await db.category.findUnique({
    where: {
      id,
    },
    include: {
      products: {
        include: {
          restaurant: {
            select: {
              name: true,
            },
          },
        },
      },
    },
  });

  if (!category) {
    return notFound();
  }

  return (
    <>
      <Header />
      <div className="px-5 py-6">
        <h2 className="mb-6 text-lg font-semibold">{category.name}</h2>
        <div className="grid grid-cols-2 gap-6 lg:grid-cols-3">
          {category.products.map((product) => (
            <ProductItem
              key={product.id}
              product={{ ...product, price: Number(product.price) }}
              className="min-w-full max-w-none"
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default CategoriesPage;
