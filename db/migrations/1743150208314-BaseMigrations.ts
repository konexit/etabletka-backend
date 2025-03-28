import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1743150208314 implements MigrationInterface {
    name = 'BaseMigrations1743150208314'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]::int[]`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "sync_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "email" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "phone" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "address" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]::varchar[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "address" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "phone" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "email" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "companies" ALTER COLUMN "sync_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]`);
    }

}
