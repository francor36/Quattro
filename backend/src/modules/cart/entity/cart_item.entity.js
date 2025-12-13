import { EntitySchema } from "typeorm";

export const cartItemEntity = new EntitySchema({
  name: "CartItem",
  tableName: "cart_items",
  columns: {
    id: {
      type: "bigint",
      primary: true,
      generated: true,
    },
    quantity: {
      type: "int",
      nullable: false,
    },
    added_at: {
      type: "timestamp",
      createDate: true,
      nullable: false,
    },
  },
  relations: {
    cart: {
      type: "many-to-one",
      target: "ShoppingCart",
      joinColumn: { name: "cart_id" },
      nullable: false,
      onDelete: "CASCADE", // si se elimina el carrito, se eliminan los items
    },
    product: {
      type: "many-to-one",
      target: "Product",
      joinColumn: { name: "product_id" },
      nullable: false,
    },
  },
});
