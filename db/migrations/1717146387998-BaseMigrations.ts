import { MigrationInterface, QueryRunner } from 'typeorm';

export class BaseMigrations1717146387998 implements MigrationInterface {
  name = 'BaseMigrations1717146387998';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "product_remnants" ("id" SERIAL NOT NULL, "product_id" integer NOT NULL, "store_id" integer NOT NULL DEFAULT '0', "quantity" integer NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5d59bcd9abef9884bfab50a57c8" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_b2404d09edd7c30fb6ed5b7a25" ON "product_remnants" ("product_id") `,
    );
    await queryRunner.query(
      `CREATE TABLE "badges" ("id" SERIAL NOT NULL, "title" json NOT NULL, "slug" character varying NOT NULL, "color" character varying(8), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a6118739404276dfeb86e349acf" UNIQUE ("slug"), CONSTRAINT "PK_8a651318b8de577e8e217676466" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_badges" ("id" SERIAL NOT NULL, "product_id" integer, "badge_id" integer, CONSTRAINT "PK_b1bbb31a15781da772c9354b4c2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "discounts" ("id" SERIAL NOT NULL, "title" json NOT NULL, "text" json, "slug" character varying NOT NULL, "badge_title" json, "badge_color" character varying(8), "type" integer NOT NULL DEFAULT '0', "value" double precision NOT NULL DEFAULT '0', "currency" character varying(10) NOT NULL DEFAULT 'UAH', "active" boolean NOT NULL DEFAULT false, "start_date" TIMESTAMP, "end_date" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_098b34fd60b1d2ecc316b8f5f55" UNIQUE ("slug"), CONSTRAINT "PK_66c522004212dc814d6e2f14ecc" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_discounts" ("id" SERIAL NOT NULL, "product_id" integer, "discount_id" integer, CONSTRAINT "PK_5efa6c73d79028c47f6c1855cfb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "products" ("id" SERIAL NOT NULL, "sync_id" integer NOT NULL, "company_id" integer, "brand_id" integer, "name" json NOT NULL, "short_name" json NOT NULL, "atc" character varying, "slug" character varying NOT NULL, "cdn_instruction" json, "description" json, "instruction_uk" character varying NOT NULL, "instruction_ru" character varying NOT NULL, "instruction_en" character varying NOT NULL, "seo_h1" json, "seo_h1_auto" boolean NOT NULL DEFAULT true, "seo_title" json, "seo_title_auto" boolean NOT NULL DEFAULT true, "seo_description" json, "seo_description_auto" boolean NOT NULL DEFAULT true, "seo_keywords" json, "seo_keywords_auto" boolean NOT NULL DEFAULT true, "seo_text" json, "seo_text_auto" boolean NOT NULL DEFAULT true, "price" double precision NOT NULL DEFAULT '0', "discount_price" integer NOT NULL DEFAULT '0', "reviews_count" integer NOT NULL DEFAULT '0', "rating" integer NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT false, "hidden" boolean NOT NULL DEFAULT true, "in_stock" boolean NOT NULL DEFAULT false, "is_prescription" boolean NOT NULL DEFAULT false, "product_type_id" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "productTypeId" integer, CONSTRAINT "UQ_ddc2d911fb38cf805f685ae4a14" UNIQUE ("sync_id"), CONSTRAINT "UQ_464f927ae360106b783ed0b4106" UNIQUE ("slug"), CONSTRAINT "UQ_3c0af0455cd2d82ad2bbc8c9679" UNIQUE ("instruction_uk"), CONSTRAINT "UQ_3af8c8a9b60dbd078827f9991c1" UNIQUE ("instruction_ru"), CONSTRAINT "UQ_69b65e4b1956d70a7cf7e4b379f" UNIQUE ("instruction_en"), CONSTRAINT "REL_fed065ae1a8b80a37a9230da1f" UNIQUE ("productTypeId"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "product_types" ("id" SERIAL NOT NULL, "name" character varying(200) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_2b3bfea1c7797e9d067dfc3c7a0" UNIQUE ("name"), CONSTRAINT "PK_6ad7b08e6491a02ebc9ed82019d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "phone" character varying(15) NOT NULL, "email" character varying, "password" character varying NOT NULL, "first_name" character varying(30) NOT NULL, "last_name" character varying(30) NOT NULL, "date_of_birth" character varying(30) NOT NULL, "is_active" boolean NOT NULL DEFAULT true, "role_id" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "banners" ("id" SERIAL NOT NULL, "name" character varying(125) NOT NULL, "slug" character varying(125) NOT NULL, "btn_pos" character varying(125) NOT NULL, "show_title" boolean NOT NULL DEFAULT false, "cdn_data" json, "url" character varying(125), "published" boolean NOT NULL DEFAULT false, "publish_start" TIMESTAMP, "publish_end" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f6c61dac2ffb69440ddb067deed" UNIQUE ("slug"), CONSTRAINT "PK_e9b186b959296fcb940790d31c3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "districts" ("id" SERIAL NOT NULL, "country_id" integer NOT NULL, "region_id" integer NOT NULL, "name" json NOT NULL, "slug" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d5f02510e946296ac6e48637845" UNIQUE ("slug"), CONSTRAINT "PK_972a72ff4e3bea5c7f43a2b98af" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "cities" ("id" SERIAL NOT NULL, "lat" character varying, "lng" character varying, "country_id" integer, "region_id" integer, "district_id" integer, "community_id" integer, "prefix" json, "name" json NOT NULL, "slug" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8ef722e770798e37b3205370bfd" UNIQUE ("slug"), CONSTRAINT "PK_4762ffb6e5d198cfec5606bc11e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "communities" ("id" SERIAL NOT NULL, "country_id" integer NOT NULL, "region_id" integer NOT NULL, "district_id" integer NOT NULL, "name" json NOT NULL, "slug" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_42d5225a80ac87aa1254dfe282c" UNIQUE ("slug"), CONSTRAINT "PK_fea1fe83c86ccde9d0a089e7ea2" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "categories" ("id" SERIAL NOT NULL, "sync_id" integer, "sync_parent_id" integer, "parent_id" integer DEFAULT '0', "name" json, "name_short" json, "path" character varying, "slug" character varying, "description" json, "seo_h1" json, "seo_title" json, "seo_description" json, "seo_keywords" json, "seo_text" json, "image" character varying, "cdn_icon" character varying, "cdn_data" json, "icon" character varying, "alt" json, "position" integer NOT NULL DEFAULT '0', "root" boolean NOT NULL DEFAULT false, "lft" integer NOT NULL DEFAULT '0', "rgt" integer NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT true, "show_menu" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b27406dfc7906918cc418fbb0a0" UNIQUE ("sync_id"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "stores" ("id" SERIAL NOT NULL, "sync_id" integer NOT NULL, "company_id" integer, "country_id" integer NOT NULL DEFAULT '1', "region_id" integer, "district_id" integer, "city_id" integer, "lat" character varying, "lng" character varying, "name" json NOT NULL, "slug" character varying NOT NULL, "cdn_data" json, "work_time" character varying(125), "contacts" character varying(125), "address" character varying(125), "active" boolean NOT NULL DEFAULT false, "sell_type" character varying(125), "store_brand_id" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5a2b3c044e5229090699d2353ee" UNIQUE ("sync_id"), CONSTRAINT "UQ_790b2968701a6ff5ff383237765" UNIQUE ("slug"), CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_remnants" ADD CONSTRAINT "FK_b2404d09edd7c30fb6ed5b7a257" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_badges" ADD CONSTRAINT "FK_d16f96a2e1b441f133b9522bdcb" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_badges" ADD CONSTRAINT "FK_3c5f099898dc401fb5cf4a071ef" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_discounts" ADD CONSTRAINT "FK_68e668b0341f0276ebcc2a91506" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_discounts" ADD CONSTRAINT "FK_4d3f74396271c6bee81a1a547a0" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "products" ADD CONSTRAINT "FK_fed065ae1a8b80a37a9230da1fa" FOREIGN KEY ("productTypeId") REFERENCES "product_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "products" DROP CONSTRAINT "FK_fed065ae1a8b80a37a9230da1fa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_discounts" DROP CONSTRAINT "FK_4d3f74396271c6bee81a1a547a0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_discounts" DROP CONSTRAINT "FK_68e668b0341f0276ebcc2a91506"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_badges" DROP CONSTRAINT "FK_3c5f099898dc401fb5cf4a071ef"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_badges" DROP CONSTRAINT "FK_d16f96a2e1b441f133b9522bdcb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "product_remnants" DROP CONSTRAINT "FK_b2404d09edd7c30fb6ed5b7a257"`,
    );
    await queryRunner.query(`DROP TABLE "stores"`);
    await queryRunner.query(`DROP TABLE "categories"`);
    await queryRunner.query(`DROP TABLE "communities"`);
    await queryRunner.query(`DROP TABLE "cities"`);
    await queryRunner.query(`DROP TABLE "districts"`);
    await queryRunner.query(`DROP TABLE "banners"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TABLE "product_types"`);
    await queryRunner.query(`DROP TABLE "products"`);
    await queryRunner.query(`DROP TABLE "product_discounts"`);
    await queryRunner.query(`DROP TABLE "discounts"`);
    await queryRunner.query(`DROP TABLE "product_badges"`);
    await queryRunner.query(`DROP TABLE "badges"`);
    await queryRunner.query(
      `DROP INDEX "public"."IDX_b2404d09edd7c30fb6ed5b7a25"`,
    );
    await queryRunner.query(`DROP TABLE "product_remnants"`);
  }
}
