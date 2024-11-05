import { db } from "@/app/_lib/prisma";
import { notFound } from "next/navigation";
import ProductImage from "./_components/product-image";
import ProductDetails from "./_components/product-details";

interface ProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

// Busca o produto e complementos do mesmo restaurante antes de renderizar.
const ProductPage = async ({ params }: ProductPageProps) => {
  const { id } = await params;
  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      restaurant: true,
    },
  });

  if (!product) {
    return notFound();
  }

  const juices = await db.product.findMany({
    where: {
      category: {
        name: "Sucos",
      },
      restaurant: {
        id: product?.restaurant.id,
      },
    },
    include: { restaurant: { select: { name: true } } },
  });
  const serializedProduct = {
    ...product,
    price: Number(product.price),
    restaurant: {
      ...product.restaurant,
      deliveryFee: Number(product.restaurant.deliveryFee),
    },
  };
  const serializedJuices = juices.map((juice) => ({
    ...juice,
    price: Number(juice.price),
  }));

  return (
    <div>
      {/* IMAGEM */}
      <ProductImage
        product={{
          name: serializedProduct.name,
          imageUrl: serializedProduct.imageUrl,
        }}
      />

      {/* TITULO E PREÇO */}
      <ProductDetails
        product={serializedProduct}
        complementaryProducts={serializedJuices}
      />
    </div>
  );
};

export default ProductPage;
