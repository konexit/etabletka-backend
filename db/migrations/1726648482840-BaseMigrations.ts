import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1726648482840 implements MigrationInterface {
    name = 'BaseMigrations1726648482840'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_attributes" ADD CONSTRAINT "UQ_2d18c00e6b7adbc4426171254fc" UNIQUE ("key")`);
        await queryRunner.query(`ALTER TYPE "public"."product_attributes_type_ui_enum" RENAME TO "product_attributes_type_ui_enum_old"`);
        await queryRunner.query(`CREATE TYPE "public"."product_attributes_type_ui_enum" AS ENUM('range', 'checkbox')`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "type_ui" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "type_ui" TYPE "public"."product_attributes_type_ui_enum" USING "type_ui"::"text"::"public"."product_attributes_type_ui_enum"`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "type_ui" SET DEFAULT 'checkbox'`);
        await queryRunner.query(`DROP TYPE "public"."product_attributes_type_ui_enum_old"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."product_attributes_type_ui_enum_old" AS ENUM('import', 'custom')`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "type_ui" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "type_ui" TYPE "public"."product_attributes_type_ui_enum_old" USING "type_ui"::"text"::"public"."product_attributes_type_ui_enum_old"`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "type_ui" SET DEFAULT 'custom'`);
        await queryRunner.query(`DROP TYPE "public"."product_attributes_type_ui_enum"`);
        await queryRunner.query(`ALTER TYPE "public"."product_attributes_type_ui_enum_old" RENAME TO "product_attributes_type_ui_enum"`);
        await queryRunner.query(`ALTER TABLE "product_attributes" DROP CONSTRAINT "UQ_2d18c00e6b7adbc4426171254fc"`);
    }

}
