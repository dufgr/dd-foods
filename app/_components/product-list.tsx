import ProductItem from "./product-item";
import type { ProductCardData } from "../_lib/client-data";
import Carousel from "./carousel";

interface ProductListProps {
  products: ProductCardData[];
}

// Mantem os produtos em uma faixa rolavel adequada a telas estreitas.
const ProductList = ({ products }: ProductListProps) => {
  return (
    <Carousel ariaLabel="Carrossel de produtos">
      {products.map((product) => (
        <ProductItem key={product.id} product={product} />
      ))}
    </Carousel>
  );
};

export default ProductList;
