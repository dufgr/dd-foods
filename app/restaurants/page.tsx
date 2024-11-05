import { Suspense } from "react";
import Restaurants from "./_components/restaurants";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";
import { db } from "../_lib/prisma";

// Carrega os favoritos do usuario antes de abrir a busca de restaurantes.
const RestaurantsPage = async () => {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;
  const userFavoriteRestaurants = userId
    ? await db.userFavoriteRestaurant.findMany({
        where: { userId },
        include: { restaurant: true },
      })
    : [];
  const favoriteRestaurantIds = userFavoriteRestaurants.map(
    (favorite) => favorite.restaurantId,
  );

  return (
    <Suspense>
      <Restaurants favoriteRestaurantIds={favoriteRestaurantIds} />
    </Suspense>
  );
};

export default RestaurantsPage;
