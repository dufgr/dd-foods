import { db } from "../_lib/prisma";
import CategoryItem from "./category-item";

// Consulta e exibe as categorias cadastradas no catalogo.
const CategoryList = async () => {
  const categories = await db.category.findMany({});

  return (
    <div className="grid grid-cols-2 gap-3">
      {categories.map((category) => (
        <CategoryItem key={category.id} category={category} />
      ))}
    </div>
  );
};

export default CategoryList;
