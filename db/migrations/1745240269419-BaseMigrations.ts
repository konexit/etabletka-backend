import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1745240269419 implements MigrationInterface {
    name = 'BaseMigrations1745240269419'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "tags" ("id" SERIAL NOT NULL, "title" jsonb NOT NULL, "slug" character varying NOT NULL, "seo_h1" jsonb, "seo_title" jsonb, "seo_description" jsonb, "seo_text" jsonb, "articles" integer array NOT NULL DEFAULT '{}', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b3aa10c29ea4e61a830362bd25a" UNIQUE ("slug"), CONSTRAINT "PK_e7dc17249a1148a1970748eda99" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "tags"`);
    }

}
