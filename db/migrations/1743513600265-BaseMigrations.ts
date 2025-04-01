import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1743513600265 implements MigrationInterface {
    name = 'BaseMigrations1743513600265'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "country_id"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "region_id"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "district_id"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "city_id"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "favorite_stores"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "first_name" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "last_name" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "phone" character varying(15)`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "email" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "katottg_id" integer`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "floor" character varying(10)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "profile_id" integer`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "UQ_23371445bd80cb3e413089551bf" UNIQUE ("profile_id")`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "street_prefix" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "avatar" jsonb`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "favorite_products"`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "favorite_products" integer array NOT NULL DEFAULT ARRAY[]::int[]`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]::int[]`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]::varchar[]`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_23371445bd80cb3e413089551bf" FOREIGN KEY ("profile_id") REFERENCES "user_profile"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_23371445bd80cb3e413089551bf"`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "favorite_products"`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "favorite_products" json`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "avatar"`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "avatar" json`);
        await queryRunner.query(`ALTER TABLE "user_profile" ALTER COLUMN "street_prefix" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "UQ_23371445bd80cb3e413089551bf"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "profile_id"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "floor"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "katottg_id"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "email"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "phone"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "last_name"`);
        await queryRunner.query(`ALTER TABLE "user_profile" DROP COLUMN "first_name"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "last_name" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "first_name" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "email" character varying(50)`);
        await queryRunner.query(`ALTER TABLE "users" ADD "phone" character varying(15) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "favorite_stores" json`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "city_id" integer`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "district_id" integer`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "region_id" integer`);
        await queryRunner.query(`ALTER TABLE "user_profile" ADD "country_id" integer NOT NULL DEFAULT '1'`);
    }

}
