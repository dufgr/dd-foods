"use server";

import { revalidatePath } from "next/cache";
import { db } from "../_lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../_lib/auth";

export const toggleFavoriteRestaurant = async (restaurantId: string) => {
  const session = await getServerSession(authOptions);
  const userId = session?.user.id;

  if (!userId) throw new Error("É necessário entrar para salvar favoritos.");

  // A sessao define a propriedade; IDs de usuario enviados pelo navegador sao ignorados.
  const isFavorite = await db.userFavoriteRestaurant.findUnique({
    where: {
      userId_restaurantId: {
        userId,
        restaurantId,
      },
    },
  });

  if (isFavorite) {
    await db.userFavoriteRestaurant.delete({
      where: {
        userId_restaurantId: {
          userId,
          restaurantId,
        },
      },
    });

    revalidatePath("/");
    return;
  }

  await db.userFavoriteRestaurant.create({
    data: {
      userId,
      restaurantId,
    },
  });

  revalidatePath("/");
};
