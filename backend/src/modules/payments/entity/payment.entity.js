import { EntitySchema } from "typeorm";

export const PaymentSchema = new EntitySchema({
  name: "Payment",
  tableName: "payments",
  columns: {
    id: {
      type: Number,
      primary: true,
      generated: true,
    },

    order_id: {
      type: Number,
      nullable: false,
    },

    mp_payment_id: {
      type: String,
      nullable: false,
      unique: true,
    },

    payment_method_id: {
      type: String,
      nullable: true,
    },

    amount: {
      type: Number,
      nullable: false,
    },

    status: {
      type: String,
      nullable: false,
    },

    processed_at: {
      type: Date,
      createDate: true,
    },
  },
});
