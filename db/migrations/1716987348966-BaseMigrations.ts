import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1716987348966 implements MigrationInterface {
    name = 'BaseMigrations1716987348966'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "stores" ("id" SERIAL NOT NULL, "sync_id" integer NOT NULL, "company_id" integer, "country_id" integer NOT NULL DEFAULT '1', "region_id" integer, "district_id" integer, "city_id" integer, "lat" character varying, "lng" character varying, "name" json NOT NULL, "slug" character varying NOT NULL, "cdn_data" json, "work_time" character varying(125), "contacts" character varying(125), "address" character varying(125), "active" boolean NOT NULL DEFAULT false, "sell_type" character varying(125), "store_brand_id" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5a2b3c044e5229090699d2353ee" UNIQUE ("sync_id"), CONSTRAINT "UQ_790b2968701a6ff5ff383237765" UNIQUE ("slug"), CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "badges" ("id" SERIAL NOT NULL, "title" json NOT NULL, "slug" character varying NOT NULL, "color" character varying(8), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a6118739404276dfeb86e349acf" UNIQUE ("slug"), CONSTRAINT "PK_8a651318b8de577e8e217676466" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_badges" ("id" SERIAL NOT NULL, "product_id" integer, "badge_id" integer, CONSTRAINT "PK_b1bbb31a15781da772c9354b4c2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "discounts" ("id" SERIAL NOT NULL, "title" json NOT NULL, "text" json, "slug" character varying NOT NULL, "badge_title" json, "badge_color" character varying(8), "type" integer NOT NULL DEFAULT '0', "value" double precision NOT NULL DEFAULT '0', "currency" character varying(10) NOT NULL DEFAULT 'UAH', "active" boolean NOT NULL DEFAULT false, "start_date" TIMESTAMP, "end_date" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_098b34fd60b1d2ecc316b8f5f55" UNIQUE ("slug"), CONSTRAINT "PK_66c522004212dc814d6e2f14ecc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_discounts" ("id" SERIAL NOT NULL, "product_id" integer, "discount_id" integer, CONSTRAINT "PK_5efa6c73d79028c47f6c1855cfb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "sync_parent_id" integer`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "cdn_data" json`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "root" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "lft" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "rgt" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "parent_id" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "price" double precision NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "product_badges" ADD CONSTRAINT "FK_d16f96a2e1b441f133b9522bdcb" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_badges" ADD CONSTRAINT "FK_3c5f099898dc401fb5cf4a071ef" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_discounts" ADD CONSTRAINT "FK_68e668b0341f0276ebcc2a91506" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_discounts" ADD CONSTRAINT "FK_4d3f74396271c6bee81a1a547a0" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_discounts" DROP CONSTRAINT "FK_4d3f74396271c6bee81a1a547a0"`);
        await queryRunner.query(`ALTER TABLE "product_discounts" DROP CONSTRAINT "FK_68e668b0341f0276ebcc2a91506"`);
        await queryRunner.query(`ALTER TABLE "product_badges" DROP CONSTRAINT "FK_3c5f099898dc401fb5cf4a071ef"`);
        await queryRunner.query(`ALTER TABLE "product_badges" DROP CONSTRAINT "FK_d16f96a2e1b441f133b9522bdcb"`);
        await queryRunner.query(`ALTER TABLE "products" DROP COLUMN "price"`);
        await queryRunner.query(`ALTER TABLE "products" ADD "price" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "parent_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "rgt"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "lft"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "root"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "cdn_data"`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "sync_parent_id"`);
        await queryRunner.query(`DROP TABLE "product_discounts"`);
        await queryRunner.query(`DROP TABLE "discounts"`);
        await queryRunner.query(`DROP TABLE "product_badges"`);
        await queryRunner.query(`DROP TABLE "badges"`);
        await queryRunner.query(`DROP TABLE "stores"`);
    }

}
