import { EntitySchema } from "typeorm";

export const productEntity = new EntitySchema({
    name: 'Product',
    tableName: 'products',
    columns: {
        id: {
            primary: true,
            type: 'bigint',
            generated: true
        },
        name: {
            type: 'varchar',
            nullable: false
        },
        description: {
            type: 'text',
            nullable: true
        },
        price: {
            type: 'decimal',
            nullable: false
        },
        category: {
            type: 'varchar',
            nullable: false
        },
        stock: {
            type: 'int',
            nullable: false
        },
        image: {
            type: "varchar",
            length: 255,
            nullable: true, 
        },
        created_at: {
            type: 'timestamp',
            createDate: true,
            nullable: false
        },
    },
});