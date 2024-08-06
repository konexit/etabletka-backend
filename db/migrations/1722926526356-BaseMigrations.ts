import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1722926526356 implements MigrationInterface {
    name = 'BaseMigrations1722926526356'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "product_group" ("id" SERIAL NOT NULL, "name" character varying(200) NOT NULL, "slug" character varying(50) NOT NULL, "root" boolean NOT NULL DEFAULT false, "parent_id" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_3ed948122d6757c9c28ebc7b6db" UNIQUE ("name"), CONSTRAINT "UQ_19f9d127be5902555a3b2dd6b8b" UNIQUE ("slug"), CONSTRAINT "PK_8c03e90007cd9645242e594a041" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cross_groups_products" ("productGroupId" integer NOT NULL, "productsId" integer NOT NULL, CONSTRAINT "PK_a7c4bcd3fbf254e2769f6b11e64" PRIMARY KEY ("productGroupId", "productsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_05d4e16b529d851d70b8913c68" ON "cross_groups_products" ("productGroupId") `);
        await queryRunner.query(`CREATE INDEX "IDX_b0e560399515f4582443f6513e" ON "cross_groups_products" ("productsId") `);
        await queryRunner.query(`ALTER TABLE "site_options" ADD "json" jsonb`);
        await queryRunner.query(`ALTER TABLE "cross_groups_products" ADD CONSTRAINT "FK_05d4e16b529d851d70b8913c68a" FOREIGN KEY ("productGroupId") REFERENCES "product_group"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "cross_groups_products" ADD CONSTRAINT "FK_b0e560399515f4582443f6513e1" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cross_groups_products" DROP CONSTRAINT "FK_b0e560399515f4582443f6513e1"`);
        await queryRunner.query(`ALTER TABLE "cross_groups_products" DROP CONSTRAINT "FK_05d4e16b529d851d70b8913c68a"`);
        await queryRunner.query(`ALTER TABLE "site_options" DROP COLUMN "json"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b0e560399515f4582443f6513e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_05d4e16b529d851d70b8913c68"`);
        await queryRunner.query(`DROP TABLE "cross_groups_products"`);
        await queryRunner.query(`DROP TABLE "product_group"`);
    }

}
