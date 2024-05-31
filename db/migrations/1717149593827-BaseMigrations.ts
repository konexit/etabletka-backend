import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1717149593827 implements MigrationInterface {
    name = 'BaseMigrations1717149593827'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_fed065ae1a8b80a37a9230da1fa"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "REL_fed065ae1a8b80a37a9230da1f"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "productTypeId"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "product_type_id"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "product_type_id" integer NOT NULL DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "UQ_9adb63f24f86528856373f0ab9a" UNIQUE ("product_type_id")`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_9adb63f24f86528856373f0ab9a" FOREIGN KEY ("product_type_id") REFERENCES "product_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9adb63f24f86528856373f0ab9a"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "UQ_9adb63f24f86528856373f0ab9a"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "product_type_id"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "product_type_id" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "products" ADD "productTypeId" integer`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "REL_fed065ae1a8b80a37a9230da1f" UNIQUE ("productTypeId")`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_fed065ae1a8b80a37a9230da1fa" FOREIGN KEY ("productTypeId") REFERENCES "product_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
