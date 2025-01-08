import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1736347633554 implements MigrationInterface {
    name = 'BaseMigrations1736347633554'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "trade_order_id" integer, "order_type_id" integer NOT NULL DEFAULT '1', "store_id" integer, "company_id" integer NOT NULL DEFAULT '1', "user_id" integer, "city_id" integer, "order" jsonb, "order_statuses" jsonb, "integration_time" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "cross_categories_products" ("categoriesId" integer NOT NULL, "productsId" integer NOT NULL, CONSTRAINT "PK_ee5be5af5d8413335bf9ee12fa9" PRIMARY KEY ("categoriesId", "productsId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6616eef054533fb283edabf15b" ON "cross_categories_products" ("categoriesId") `);
        await queryRunner.query(`CREATE INDEX "IDX_c8c25ded57ddb4221d6e532c7e" ON "cross_categories_products" ("productsId") `);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]::int[]`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]::varchar[]`);
        await queryRunner.query(`ALTER TABLE "cross_categories_products" ADD CONSTRAINT "FK_6616eef054533fb283edabf15bf" FOREIGN KEY ("categoriesId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "cross_categories_products" ADD CONSTRAINT "FK_c8c25ded57ddb4221d6e532c7e4" FOREIGN KEY ("productsId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cross_categories_products" DROP CONSTRAINT "FK_c8c25ded57ddb4221d6e532c7e4"`);
        await queryRunner.query(`ALTER TABLE "cross_categories_products" DROP CONSTRAINT "FK_6616eef054533fb283edabf15bf"`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c8c25ded57ddb4221d6e532c7e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_6616eef054533fb283edabf15b"`);
        await queryRunner.query(`DROP TABLE "cross_categories_products"`);
        await queryRunner.query(`DROP TABLE "orders"`);
    }

}
