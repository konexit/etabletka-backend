import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1744267794622 implements MigrationInterface {
    name = 'BaseMigrations1744267794622'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "is_approved"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "userId"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "modelId"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "model_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "user_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "approved" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "deleted_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "favorite_products" SET DEFAULT '{}'::integer[]`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "comments" SET DEFAULT '{}'::integer[]`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "answers" SET DEFAULT '{}'::integer[]`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT '{}'::integer[]`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT '{}'::integer[]`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "answers" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "comments" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "favorite_products" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "deleted_at"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "approved"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "user_id"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "model_id"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "modelId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "userId" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "is_approved" boolean NOT NULL DEFAULT false`);
    }

}
