import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1741605244878 implements MigrationInterface {
    name = 'BaseMigrations1741605244878'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."orders_sent_status_enum" AS ENUM('pending', 'sent', 'failed', 'in_progress')`);
        await queryRunner.query(`ALTER TABLE "orders" ADD "sent_status" "public"."orders_sent_status_enum" NOT NULL DEFAULT 'pending'`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]::int[]`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]::varchar[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "orders" DROP COLUMN "sent_status"`);
        await queryRunner.query(`DROP TYPE "public"."orders_sent_status_enum"`);
    }

}
