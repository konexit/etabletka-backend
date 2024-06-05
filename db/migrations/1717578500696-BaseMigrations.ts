import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1717578500696 implements MigrationInterface {
    name = 'BaseMigrations1717578500696'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "site_options" ("id" SERIAL NOT NULL, "key" character varying(125) NOT NULL, "title" character varying(125) NOT NULL, "value" text, "type" character varying(125) NOT NULL, "primary" smallint NOT NULL, "switchable" smallint NOT NULL, "active" smallint NOT NULL DEFAULT '1', "editable" smallint NOT NULL DEFAULT '1', "position" integer NOT NULL, "group" character varying(125) NOT NULL, "group_title" character varying(125) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_979d2c76702fe3ca1dd782fd9ab" UNIQUE ("key"), CONSTRAINT "PK_d274d6df319415c6e4b5ca76759" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "site_options"`);
    }

}
