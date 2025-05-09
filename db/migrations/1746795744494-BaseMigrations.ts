import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1746795744494 implements MigrationInterface {
    name = 'BaseMigrations1746795744494'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" ADD "product_groups" integer array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "product_groups" ADD "active" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "product_groups" ADD "breadcrumbs_category" integer array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "product_groups" DROP CONSTRAINT "UQ_68e571537431790229b8a3a596b"`);
        await queryRunner.query(`ALTER TABLE "product_groups" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "product_groups" ADD "name" jsonb NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_groups" DROP CONSTRAINT "UQ_93f9e0d1c8a8c6360cc31b7437c"`);
        await queryRunner.query(`ALTER TABLE "product_groups" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "product_groups" ADD "slug" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_groups" ADD CONSTRAINT "UQ_93f9e0d1c8a8c6360cc31b7437c" UNIQUE ("slug")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_groups" DROP CONSTRAINT "UQ_93f9e0d1c8a8c6360cc31b7437c"`);
        await queryRunner.query(`ALTER TABLE "product_groups" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "product_groups" ADD "slug" character varying(50) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_groups" ADD CONSTRAINT "UQ_93f9e0d1c8a8c6360cc31b7437c" UNIQUE ("slug")`);
        await queryRunner.query(`ALTER TABLE "product_groups" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "product_groups" ADD "name" character varying(200) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "product_groups" ADD CONSTRAINT "UQ_68e571537431790229b8a3a596b" UNIQUE ("name")`);
        await queryRunner.query(`ALTER TABLE "product_groups" DROP COLUMN "breadcrumbs_category"`);
        await queryRunner.query(`ALTER TABLE "product_groups" DROP COLUMN "active"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "product_groups"`);
    }

}
