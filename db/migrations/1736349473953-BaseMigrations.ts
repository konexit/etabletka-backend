import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1736349473953 implements MigrationInterface {
    name = 'BaseMigrations1736349473953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "pre_orders" ("id" SERIAL NOT NULL, "trade_order_id" integer, "order_type_id" integer NOT NULL DEFAULT '1', "store_id" integer, "company_id" integer NOT NULL DEFAULT '1', "user_id" integer, "city_id" integer, "order" jsonb, "move_to_order" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_a93a078ae8f7b29b0c0c97ac8de" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]::int[]`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]::varchar[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`DROP TABLE "pre_orders"`);
    }

}
