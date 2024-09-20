import type { Prisma, Product, Restaurant } from "@prisma/client";

type ProductWithRestaurantName = Prisma.ProductGetPayload<{
  include: {
    restaurant: {
      select: {
        name: true;
      };
    };
  };
}>;

type ProductWithRestaurant = Prisma.ProductGetPayload<{
  include: {
    restaurant: true;
  };
}>;

export type ProductCardData = Omit<ProductWithRestaurantName, "price"> & {
  price: number;
};

export type SerializedProduct = Omit<Product, "price"> & { price: number };

export type ProductDetailsData = Omit<
  ProductWithRestaurant,
  "price" | "restaurant"
> & {
  price: number;
  restaurant: Omit<ProductWithRestaurant["restaurant"], "deliveryFee"> & {
    deliveryFee: number;
  };
};

export type RestaurantCardData = Omit<Restaurant, "deliveryFee"> & {
  deliveryFee: number;
};

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    restaurant: true;
    products: {
      include: {
        product: true;
      };
    };
  };
}>;

export type OrderItemData = Omit<
  OrderWithRelations,
  "totalPrice" | "restaurant" | "products"
> & {
  totalPrice: number;
  restaurant: RestaurantCardData;
  products: Array<
    Omit<OrderWithRelations["products"][number], "product"> & {
      product: SerializedProduct;
    }
  >;
};
