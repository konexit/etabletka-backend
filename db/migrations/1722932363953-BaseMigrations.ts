import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1722932363953 implements MigrationInterface {
    name = 'BaseMigrations1722932363953'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_groups" ("id" SERIAL NOT NULL, "name" character varying(200) NOT NULL, "slug" character varying(50) NOT NULL, "root" boolean NOT NULL DEFAULT false, "parent_id" integer, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_68e571537431790229b8a3a596b" UNIQUE ("name"), CONSTRAINT "UQ_93f9e0d1c8a8c6360cc31b7437c" UNIQUE ("slug"), CONSTRAINT "PK_bccc8805f3453d0cce77c1beedb" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "product_groups"`);
    }

}
