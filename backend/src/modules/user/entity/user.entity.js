import { EntitySchema } from "typeorm";

export const userEntity = new EntitySchema({
    name: 'User',
    tableName: 'users',
    columns: {
        id: {
            primary: true,
            type: 'bigint',
            generated: true
        },
        nombre: {
            type: 'varchar',
            length: 100,
            nullable: false
        },
        apellido: {
            type: 'varchar',
            length: 100,
            nullable: true
        },
        email: {
            type: 'varchar',
            length: 255,
            nullable: false,
            unique: true
        },
        password: {
            type: 'varchar',
            length: 255,
            nullable: false
        },
        telefono: {
            type: 'varchar',
            length: 50,
            nullable: true
        },
        direccion: {
            type: 'varchar',
            length: 255,
            nullable: true
        },
        rol: {
            type: 'enum',
            enum: ['cliente', 'admin'],
            default: 'cliente',
            nullable: true
        },
        created_at: {
            type: 'timestamp',
            createDate: true,
            nullable: false
        }
    }
});
