"use server";

import { db } from "@/app/_lib/prisma";

// Pesquisa nomes sem diferenciar maiusculas para aceitar consultas naturais.
export const searchForRestaurants = async (search: string) => {
  const restaurants = await db.restaurant.findMany({
    where: {
      name: {
        contains: search,
        mode: "insensitive",
      },
    },
  });

  return restaurants.map((restaurant) => ({
    ...restaurant,
    deliveryFee: Number(restaurant.deliveryFee),
  }));
};
