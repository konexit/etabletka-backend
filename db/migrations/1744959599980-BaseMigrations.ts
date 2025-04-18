import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1744959599980 implements MigrationInterface {
    name = 'BaseMigrations1744959599980'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "reviews_count" TO "comments_count"`);
        await queryRunner.query(`ALTER TABLE "articles" ADD "image" character varying`);
        await queryRunner.query(`ALTER TABLE "articles" ADD "comments_count" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "articles" ADD "tags" integer array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "tags"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "comments_count"`);
        await queryRunner.query(`ALTER TABLE "articles" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "products" RENAME COLUMN "comments_count" TO "reviews_count"`);
    }

}
