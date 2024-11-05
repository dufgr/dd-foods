import Header from "@/app/_components/header";
import RestaurantList from "@/app/_components/restaurant-list";

// Prepara restaurantes e favoritos para a lista de recomendacoes.
const RecommendedRestaurants = async () => {
  return (
    <>
      <Header />
      <div className="space-y-4 py-6">
        <h2 className="px-5 text-lg font-semibold">
          Restaurantes Recomendados
        </h2>
        <RestaurantList />
      </div>
    </>
  );
};

export default RecommendedRestaurants;
