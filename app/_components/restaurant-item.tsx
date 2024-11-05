"use client";

import { BikeIcon, HeartIcon, StarIcon, TimerIcon } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "../_helpers/price";
import { Button } from "./ui/button";
import Link from "next/link";
import { cn } from "../_lib/utils";
import { toggleFavoriteRestaurant } from "../_actions/restaurant";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import type { RestaurantCardData } from "../_lib/client-data";

interface RestaurantItemProps {
  restaurant: RestaurantCardData;
  className?: string;
  favoriteRestaurantIds: string[];
}

// Resume entrega e permite favoritar sem confiar no ID do usuario cliente.
const RestaurantItem = ({
  restaurant,
  className,
  favoriteRestaurantIds,
}: RestaurantItemProps) => {
  const { data } = useSession();
  const router = useRouter();
  const isFavorite = favoriteRestaurantIds.includes(restaurant.id);

  const handleFavoriteClick = async () => {
    if (!data?.user.id) return;
    try {
      await toggleFavoriteRestaurant(restaurant.id);
      router.refresh();
      toast.success(
        isFavorite
          ? "Restaurante removido dos favoritos."
          : "Restaurante favoritado.",
      );
    } catch {
      toast.error("Erro ao favoritar restaurante.");
    }
  };

  return (
    <div
      className={cn(
        "w-full shrink-0 snap-start min-[480px]:w-[calc((100%_-_16px)_/_2)] sm:w-[calc((100%_-_32px)_/_3)] md:w-[calc((100%_-_48px)_/_4)] xl:w-[calc((100%_-_64px)_/_5)]",
        className,
      )}
    >
      <div className="w-full space-y-3">
        {/* IMAGEM */}
        <div className="relative h-[136px] w-full">
          <Link
            href={`/restaurants/${restaurant.id}`}
            className="absolute inset-0"
          >
            <Image
              src={restaurant.imageUrl}
              fill
              sizes="100%"
              className="rounded-lg object-cover"
              alt={restaurant.name}
            />
          </Link>

          <div className="absolute left-2 top-2 flex items-center gap-[2px] rounded-full bg-primary bg-white px-2 py-[2px]">
            <StarIcon size={12} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-semibold">5.0</span>
          </div>

          {data?.user.id && (
            <Button
              size="icon"
              className={`absolute right-2 top-2 h-7 w-7 rounded-full bg-gray-700 ${isFavorite && "bg-primary hover:bg-gray-700"}`}
              onClick={handleFavoriteClick}
            >
              <HeartIcon size={16} className="fill-white" />
            </Button>
          )}
        </div>
        {/* TEXTO */}
        <div>
          <h3 className="text-sm font-semibold">{restaurant.name}</h3>
          {/* INFORMAÇÕES DA ENTREGA */}
          <div className="flex gap-3">
            {/* CUSTO DE ENTREGA */}
            <div className="flex items-center gap-1">
              <BikeIcon className="text-primary" size={14} />
              <span className="text-xs text-muted-foreground">
                {Number(restaurant.deliveryFee) === 0
                  ? "Entrega grátis"
                  : formatCurrency(Number(restaurant.deliveryFee))}
              </span>
            </div>
            {/* TEMPO DE ENTREGA */}
            <div className="flex items-center gap-1">
              <TimerIcon className="text-primary" size={14} />
              <span className="text-xs text-muted-foreground">
                {restaurant.deliveryTimeMinutes} min
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantItem;
