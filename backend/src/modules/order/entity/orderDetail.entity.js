import { EntitySchema } from "typeorm";

export const orderDetailEntity = new EntitySchema({
  name: "OrderDetail",
  tableName: "order_details",
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
    price: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
  },
  relations: {
    order: {
      type: "many-to-one",
      target: "Order",
      joinColumn: { name: "order_id" },
      nullable: false,
      onDelete: "CASCADE",
    },
    product: {
      type: "many-to-one",
      target: "Product",
      joinColumn: { name: "product_id" },
      nullable: false,
    },
  },
});
