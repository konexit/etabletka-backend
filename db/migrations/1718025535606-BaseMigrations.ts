import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1718025535606 implements MigrationInterface {
    name = 'BaseMigrations1718025535606'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "date_of_birth" TO "code"`);
        await queryRunner.query(`CREATE TABLE "user_profile" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "date_of_birth" character varying(30), "country_id" integer NOT NULL DEFAULT '1', "region_id" integer, "district_id" integer, "city_id" integer, "street_prefix" character varying(20) NOT NULL DEFAULT 'вул.', "street" character varying(200), "house" character varying(10), "apartment" character varying(10), "avatar" json, "favorite_products" json, "favorite_stores" json, CONSTRAINT "UQ_eee360f3bff24af1b6890765201" UNIQUE ("user_id"), CONSTRAINT "PK_f44d0cd18cfd80b0fed7806c3b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "delivery_statuses" ("id" SERIAL NOT NULL, "title" json NOT NULL, "code" smallint NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0b40f97cb25ea95d071b4870b23" UNIQUE ("code"), CONSTRAINT "PK_9879904dd0e500b28523986648a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "another_points" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "cdn_data" json, "active" boolean NOT NULL DEFAULT true, "main_color" character varying(7) NOT NULL DEFAULT '#ff0000', "back_color" character varying(7) NOT NULL DEFAULT '#ffffff', "num_color" character varying(7) NOT NULL DEFAULT '#000000', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_802099968b5533199ede4447a8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "seo_text"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "seo_text_auto"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "is_active" SET DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "code" character varying(10)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "code"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "code" character varying(30)`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "is_active" SET DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "products" ADD "seo_text_auto" boolean NOT NULL DEFAULT true`);
        await queryRunner.query(`ALTER TABLE "products" ADD "seo_text" json`);
        await queryRunner.query(`ALTER TABLE "products" ADD "description" json`);
        await queryRunner.query(`DROP TABLE "another_points"`);
        await queryRunner.query(`DROP TABLE "delivery_statuses"`);
        await queryRunner.query(`DROP TABLE "user_profile"`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "code" TO "date_of_birth"`);
    }

}
