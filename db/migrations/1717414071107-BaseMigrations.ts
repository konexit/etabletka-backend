import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1717414071107 implements MigrationInterface {
    name = 'BaseMigrations1717414071107'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "company_id" integer NOT NULL DEFAULT '1', "user_id" integer, "phone" character varying(15), "city_id" integer, "store_id" integer, "type" integer NOT NULL DEFAULT '0', "delivery_type_id" integer NOT NULL, "payment_type_id" integer, "order_status" integer NOT NULL DEFAULT '1', "payment_status" integer NOT NULL DEFAULT '1', "delivery_status" integer, "sent_status" integer, "total_product" double precision NOT NULL DEFAULT '0', "total_shipping" double precision NOT NULL DEFAULT '0', "total" double precision NOT NULL DEFAULT '0', "currency" character varying(30) NOT NULL DEFAULT 'UAH', "comment" text NOT NULL, "recipient_data" json, "delivery_data" json, "payment_data" json, "data" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_items" ("id" SERIAL NOT NULL, "order_id" integer NOT NULL, "product_id" integer NOT NULL, "remnant_id" integer, "quantity" double precision NOT NULL, "price" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "hidden" SET DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "hidden" SET DEFAULT true`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TABLE "orders"`);
    }

}
