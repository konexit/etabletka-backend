import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1742375299485 implements MigrationInterface {
    name = 'BaseMigrations1742375299485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "order_statuses" ("id" SERIAL NOT NULL, "order_id" integer, "trade_order_id" integer, "trade_status_id" integer, "order_type_id" integer NOT NULL DEFAULT '1', "status_code" character varying NOT NULL, "status_msg" character varying, "status_time" TIMESTAMP, "sent_status_time" TIMESTAMP, CONSTRAINT "UQ_62aefceabc2de091c60f318832b" UNIQUE ("trade_status_id"), CONSTRAINT "PK_76c6dc5bccb3ef1a4a8510cab3a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]::int[]`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]::varchar[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`DROP TABLE "order_statuses"`);
    }

}
