"use client";

import Image from "next/image";
import { calculateProductTotalPrice, formatCurrency } from "../_helpers/price";
import { ArrowDownIcon } from "lucide-react";
import Link from "next/link";
import { cn } from "../_lib/utils";
import type { ProductCardData } from "../_lib/client-data";

interface ProductItemProps {
  product: ProductCardData;
  className?: string;
}

// Resume imagem, preco com desconto e restaurante em um link de produto.
const ProductItem = ({ product, className }: ProductItemProps) => {
  return (
    <Link
      className={cn(
        "w-[calc((100%_-_16px)_/_2)] min-w-0 shrink-0 snap-start min-[480px]:w-[calc((100%_-_32px)_/_3)] sm:w-[calc((100%_-_48px)_/_4)] md:w-[calc((100%_-_64px)_/_5)] lg:w-[calc((100%_-_80px)_/_6)] xl:w-[calc((100%_-_96px)_/_7)]",
        className,
      )}
      href={`/products/${product.id}`}
    >
      <div className="w-full space-y-2">
        <div className="relative aspect-square w-full">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            sizes="100%"
            className="rounded-lg object-cover shadow-md"
          />

          {product.discountPercentage && (
            <div className="absolute left-2 top-2 flex items-center gap-[2px] rounded-full bg-primary px-2 py-[2px] text-white">
              <ArrowDownIcon size={12} />
              <span className="text-xs font-semibold">
                {product.discountPercentage}%
              </span>
            </div>
          )}
        </div>

        <div>
          <h2 className="line-clamp-2 min-h-10 text-sm">{product.name}</h2>
          <div className="flex items-center gap-1">
            <h3 className="font-semibold">
              {formatCurrency(calculateProductTotalPrice(product))}
            </h3>
            {product.discountPercentage > 0 && (
              <span className="text-xs text-muted-foreground line-through">
                {formatCurrency(Number(product.price))}
              </span>
            )}
          </div>

          <span className="block text-xs text-muted-foreground">
            {product.restaurant.name}
          </span>
        </div>
      </div>
    </Link>
  );
};

export default ProductItem;
