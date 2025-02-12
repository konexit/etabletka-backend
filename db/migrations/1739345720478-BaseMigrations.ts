import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1739345720478 implements MigrationInterface {
    name = 'BaseMigrations1739345720478'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_statuses_descriptions" ("id" SERIAL NOT NULL, "trade_status_id" integer, "code" character varying NOT NULL, "type" character varying NOT NULL, "description" character varying NOT NULL, "order_index" integer NOT NULL, "is_manual" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_eb5b7a73ecf94dec2b1c42ffc46" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]::int[]`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]::varchar[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`DROP TABLE "order_statuses_descriptions"`);
    }

}
