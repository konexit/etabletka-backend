import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1726648183218 implements MigrationInterface {
    name = 'BaseMigrations1726648183218'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."product_attributes_type_enum" AS ENUM('import', 'custom')`);
        await queryRunner.query(`CREATE TYPE "public"."product_attributes_type_ui_enum" AS ENUM('import', 'custom')`);
        await queryRunner.query(`CREATE TYPE "public"."product_attributes_section_views_enum" AS ENUM('main', 'attributes', 'preview')`);
        await queryRunner.query(`CREATE TABLE "product_attributes" ("id" SERIAL NOT NULL, "key" character varying NOT NULL, "name" jsonb NOT NULL, "type" "public"."product_attributes_type_enum" NOT NULL DEFAULT 'custom', "type_ui" "public"."product_attributes_type_ui_enum" NOT NULL DEFAULT 'custom', "section_views" "public"."product_attributes_section_views_enum" array NOT NULL, "order" integer NOT NULL DEFAULT '0', "filter" boolean NOT NULL DEFAULT false, "filter_ui" boolean NOT NULL DEFAULT false, "values" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_4fa18fc5c893cb9894fc40ca921" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "product_attributes"`);
        await queryRunner.query(`DROP TYPE "public"."product_attributes_section_views_enum"`);
        await queryRunner.query(`DROP TYPE "public"."product_attributes_type_ui_enum"`);
        await queryRunner.query(`DROP TYPE "public"."product_attributes_type_enum"`);
    }

}
