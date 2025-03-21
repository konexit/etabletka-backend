import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1742551472936 implements MigrationInterface {
    name = 'BaseMigrations1742551472936'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" ADD "work_schedule" character varying`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "is_closed" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "is_whs_order" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "contacts"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "contacts" character varying`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "address" character varying`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]::int[]`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]::varchar[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "address"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "address" character varying(125)`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "contacts"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "contacts" character varying(125)`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "is_whs_order"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "is_closed"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "work_schedule"`);
    }

}
