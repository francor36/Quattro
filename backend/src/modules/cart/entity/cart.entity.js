import { EntitySchema } from "typeorm";

export const cartEntity = new EntitySchema({
    name: "ShoppingCart",
    tableName: "shopping_carts",
    columns: {
        id: {
            type: "bigint",
            primary: true,
            generated: true,
        },
        created_at: {
            type: "timestamp",
            createDate: true,
            nullable: false,
        },
    },
    relations: {
        user: {
            type: "many-to-one",
            target: "User",
            joinColumn: { name: "user_id" },
            nullable: false,
        },
        items: {
            type: "one-to-many",
            target: "CartItem",
            inverseSide: "cart",
            cascade: true,
        },
    },
});
