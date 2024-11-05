import { getServerSession } from "next-auth";
import { db } from "../_lib/prisma";
import RestaurantItem from "./restaurant-item";
import { authOptions } from "../_lib/auth";
import { RestaurantCardData } from "../_lib/client-data";
import Carousel from "./carousel";

// Busca restaurantes em destaque e os favoritos do usuario atual.
const RestaurantList = async ({ take }: { take?: number }) => {
  const session = await getServerSession(authOptions);

  // TODO: pegar restaurantes com maior número de pedidos
  const restaurants =
    take === undefined
      ? await db.restaurant.findMany()
      : await db.restaurant.findMany({ take });
  const userId = session?.user.id;
  const userFavoriteRestaurants = userId
    ? await db.userFavoriteRestaurant.findMany({ where: { userId } })
    : [];
  const favoriteRestaurantIds = userFavoriteRestaurants.map(
    (favorite) => favorite.restaurantId,
  );

  return (
    <Carousel ariaLabel="Carrossel de restaurantes">
      {restaurants.map((restaurant) => (
        <RestaurantItem
          key={restaurant.id}
          restaurant={
            {
              ...restaurant,
              deliveryFee: Number(restaurant.deliveryFee),
            } satisfies RestaurantCardData
          }
          favoriteRestaurantIds={favoriteRestaurantIds}
        />
      ))}
    </Carousel>
  );
};

export default RestaurantList;
