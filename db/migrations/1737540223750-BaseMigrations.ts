import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1737540223750 implements MigrationInterface {
    name = 'BaseMigrations1737540223750'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "trade_order_id" integer, "order_type_id" integer NOT NULL DEFAULT '1', "store_id" integer, "company_id" integer NOT NULL DEFAULT '1', "user_id" integer, "city_id" integer, "order" jsonb, "integration_time" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_statuses" ("id" SERIAL NOT NULL, "order_id" character varying, "status_code" character varying NOT NULL, "status_msg" character varying, "status_time" TIMESTAMP, "sent_status_time" TIMESTAMP, CONSTRAINT "PK_76c6dc5bccb3ef1a4a8510cab3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_carts" ("id" SERIAL NOT NULL, "trade_order_id" integer, "order_type_id" integer NOT NULL DEFAULT '1', "store_id" integer, "company_id" integer NOT NULL DEFAULT '1', "user_id" integer, "city_id" integer, "order" jsonb, "move_to_order" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_f7da442d2cfc56fa567f7c19fca" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]::int[]`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]::varchar[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`DROP TABLE "order_carts"`);
        await queryRunner.query(`DROP TABLE "order_statuses"`);
        await queryRunner.query(`DROP TABLE "orders"`);
    }

}
