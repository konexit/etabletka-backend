import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1717146940206 implements MigrationInterface {
    name = 'BaseMigrations1717146940206'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "regions" ("id" SERIAL NOT NULL, "lat" character varying, "lng" character varying, "country_id" integer NOT NULL, "name" json NOT NULL, "short_name" json NOT NULL, "slug" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_53cf784f23cbf14bb7717e969d4" UNIQUE ("slug"), CONSTRAINT "PK_4fcd12ed6a046276e2deb08801c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pages" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "slug" character varying NOT NULL, "title" json NOT NULL, "text" json NOT NULL, "variables" json NOT NULL, "seo_h1" json, "seo_title" json, "seo_description" json, "seo_keywords" json, "published" boolean NOT NULL DEFAULT false, "show_order" integer NOT NULL DEFAULT '0', "dynamic" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_81114bf36ab62f1d301df833994" UNIQUE ("code"), CONSTRAINT "UQ_fe66ca6a86dc94233e5d7789535" UNIQUE ("slug"), CONSTRAINT "PK_8f21ed625aa34c8391d636b7d3b" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "pages"`);
        await queryRunner.query(`DROP TABLE "regions"`);
    }

}
