import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1742465357150 implements MigrationInterface {
    name = 'BaseMigrations1742465357150'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "brands" ("id" SERIAL NOT NULL, "sync_id" integer, "name" json, "slug" character varying, "image" character varying, "cdn_data" json, "position" integer NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT true, "popular" boolean NOT NULL DEFAULT true, "description" json, "seo_h1" json, "seo_title" json, "seo_description" json, "seo_keywords" json, "seo_text" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1c83115558f31033f2d836bb6ac" UNIQUE ("sync_id"), CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]::int[]`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]::varchar[]`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_1530a6f15d3c79d1b70be98f2be" FOREIGN KEY ("brand_id") REFERENCES "brands"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_1530a6f15d3c79d1b70be98f2be"`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`DROP TABLE "brands"`);
    }

}
