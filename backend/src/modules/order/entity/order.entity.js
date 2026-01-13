import { EntitySchema } from "typeorm";

export const orderEntity = new EntitySchema({
  name: "Order",
  tableName: "orders",
  columns: {
    id: {
      type: "bigint",
      primary: true,
      generated: true,
    },
    total_amount: {
      type: "decimal",
      precision: 10,
      scale: 2,
      nullable: false,
    },
    status: {
      type: "enum",
      enum: ["pending", "paid", "cancelled"],
      enumName: "order_status",
      default: "pending",
    },
    mp_preference_id: {
      type: "varchar",
      nullable: true,
    },
    mp_payment_id: {
      type: "varchar",
      nullable: true,
    },
    mp_status: {
      type: "varchar",
      nullable: true,
    },
    created_at: {
      type: "timestamp",
      createDate: true,
    },
    updated_at: {
      type: "timestamp",
      updateDate: true,
    },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      joinColumn: { name: "user_id" },
      nullable: false,
    },
    details: {
      type: "one-to-many",
      target: "OrderDetail",
      inverseSide: "order",
      cascade: true,
    },
  },
});
