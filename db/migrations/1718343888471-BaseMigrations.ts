import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1718343888471 implements MigrationInterface {
    name = 'BaseMigrations1718343888471'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cities" ("id" SERIAL NOT NULL, "lat" character varying, "lng" character varying, "country_id" integer, "region_id" integer, "district_id" integer, "community_id" integer, "prefix" json, "name" json NOT NULL, "slug" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8ef722e770798e37b3205370bfd" UNIQUE ("slug"), CONSTRAINT "PK_4762ffb6e5d198cfec5606bc11e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "stores" ("id" SERIAL NOT NULL, "sync_id" integer NOT NULL, "company_id" integer, "country_id" integer NOT NULL DEFAULT '1', "region_id" integer, "district_id" integer, "city_id" integer, "lat" character varying, "lng" character varying, "name" json NOT NULL, "slug" character varying NOT NULL, "cdn_data" json, "work_time" character varying(125), "contacts" character varying(125), "address" character varying(125), "active" boolean NOT NULL DEFAULT false, "sell_type" character varying(125), "store_brand_id" integer NOT NULL DEFAULT '1', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5a2b3c044e5229090699d2353ee" UNIQUE ("sync_id"), CONSTRAINT "UQ_790b2968701a6ff5ff383237765" UNIQUE ("slug"), CONSTRAINT "PK_7aa6e7d71fa7acdd7ca43d7c9cb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user_profile" ("id" SERIAL NOT NULL, "user_id" integer NOT NULL, "date_of_birth" character varying(30), "country_id" integer NOT NULL DEFAULT '1', "region_id" integer, "district_id" integer, "city_id" integer, "street_prefix" character varying(20) NOT NULL DEFAULT 'вул.', "street" character varying(200), "house" character varying(10), "apartment" character varying(10), "avatar" json, "favorite_products" json, "favorite_stores" json, CONSTRAINT "UQ_eee360f3bff24af1b6890765201" UNIQUE ("user_id"), CONSTRAINT "PK_f44d0cd18cfd80b0fed7806c3b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "phone" character varying(15) NOT NULL, "email" character varying(50), "password" character varying(250) NOT NULL, "first_name" character varying(50), "last_name" character varying(50), "is_active" boolean NOT NULL DEFAULT false, "code" character varying(10), "role_id" integer NOT NULL DEFAULT '2', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "role" character varying(125) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ccc7c1489f3a6b3c9b47d4537c5" UNIQUE ("role"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "sync_id" integer, "sync_parent_id" integer, "parent_id" integer DEFAULT '0', "name" json, "name_short" json, "path" character varying, "slug" character varying, "description" json, "seo_h1" json, "seo_title" json, "seo_description" json, "seo_keywords" json, "seo_text" json, "image" character varying, "cdn_icon" character varying, "cdn_data" json, "icon" character varying, "alt" json, "position" integer NOT NULL DEFAULT '0', "root" boolean NOT NULL DEFAULT false, "lft" integer NOT NULL DEFAULT '0', "rgt" integer NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT true, "show_menu" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_b27406dfc7906918cc418fbb0a0" UNIQUE ("sync_id"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_types" ("id" SERIAL NOT NULL, "sync_id" integer, "name" character varying(200) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5d5e9a0583fb639e7181241b90b" UNIQUE ("sync_id"), CONSTRAINT "UQ_2b3bfea1c7797e9d067dfc3c7a0" UNIQUE ("name"), CONSTRAINT "PK_6ad7b08e6491a02ebc9ed82019d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "badges" ("id" SERIAL NOT NULL, "title" json NOT NULL, "slug" character varying NOT NULL, "color" character varying(8), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_a6118739404276dfeb86e349acf" UNIQUE ("slug"), CONSTRAINT "PK_8a651318b8de577e8e217676466" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "discounts" ("id" SERIAL NOT NULL, "title" json NOT NULL, "text" json, "slug" character varying NOT NULL, "badge_title" json, "badge_color" character varying(8), "type" integer NOT NULL DEFAULT '0', "value" double precision NOT NULL DEFAULT '0', "currency" character varying(10) NOT NULL DEFAULT 'UAH', "active" boolean NOT NULL DEFAULT false, "start_date" TIMESTAMP, "end_date" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_098b34fd60b1d2ecc316b8f5f55" UNIQUE ("slug"), CONSTRAINT "PK_66c522004212dc814d6e2f14ecc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products" ("id" SERIAL NOT NULL, "sync_id" integer NOT NULL, "company_id" integer, "brand_id" integer, "name" json NOT NULL, "short_name" json NOT NULL, "atc" character varying, "slug" character varying NOT NULL, "cdn_data" json, "cdn_instruction" json, "instruction_uk" character varying, "instruction_ru" character varying, "instruction_en" character varying, "seo_h1" json, "seo_h1_auto" boolean NOT NULL DEFAULT true, "seo_title" json, "seo_title_auto" boolean NOT NULL DEFAULT true, "seo_description" json, "seo_description_auto" boolean NOT NULL DEFAULT true, "seo_keywords" json, "seo_keywords_auto" boolean NOT NULL DEFAULT true, "price" double precision NOT NULL DEFAULT '0', "discount_price" integer NOT NULL DEFAULT '0', "reviews_count" integer NOT NULL DEFAULT '0', "rating" integer NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT false, "hidden" boolean NOT NULL DEFAULT false, "in_stock" boolean NOT NULL DEFAULT false, "is_prescription" boolean NOT NULL DEFAULT false, "product_type_id" integer NOT NULL DEFAULT '1', "morion_code" integer NOT NULL DEFAULT '0', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ddc2d911fb38cf805f685ae4a14" UNIQUE ("sync_id"), CONSTRAINT "UQ_464f927ae360106b783ed0b4106" UNIQUE ("slug"), CONSTRAINT "PK_0806c755e0aca124e67c0cf6d7d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "product_remnants" ("id" SERIAL NOT NULL, "product_id" integer NOT NULL, "store_id" integer NOT NULL DEFAULT '0', "quantity" integer NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_5d59bcd9abef9884bfab50a57c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b2404d09edd7c30fb6ed5b7a25" ON "product_remnants" ("product_id") `);
        await queryRunner.query(`CREATE TABLE "menus" ("id" SERIAL NOT NULL, "title" json NOT NULL, "slug" character varying NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_478abfb63bdfce389d94d5d9323" UNIQUE ("slug"), CONSTRAINT "UQ_86e5e83ebda22635b093a57d85b" UNIQUE ("description"), CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "menu_items" ("id" SERIAL NOT NULL, "menu_id" integer NOT NULL, "title" json NOT NULL, "slug" character varying(200) NOT NULL, "position" integer NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_57e6188f929e5dc6919168620c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "order_items" ("id" SERIAL NOT NULL, "order_id" integer NOT NULL, "product_id" integer NOT NULL, "remnant_id" integer, "quantity" double precision NOT NULL, "price" double precision NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_005269d8574e6fac0493715c308" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "orders" ("id" SERIAL NOT NULL, "company_id" integer NOT NULL DEFAULT '1', "user_id" integer, "phone" character varying(15), "city_id" integer, "store_id" integer, "type" integer NOT NULL DEFAULT '0', "delivery_type_id" integer NOT NULL, "payment_type_id" integer NOT NULL DEFAULT '2', "order_status" integer NOT NULL DEFAULT '1', "payment_status" integer NOT NULL DEFAULT '1', "delivery_status" integer, "sent_status" integer, "total_product" double precision NOT NULL DEFAULT '0', "total_shipping" double precision NOT NULL DEFAULT '0', "total" double precision NOT NULL DEFAULT '0', "currency" character varying(30) NOT NULL DEFAULT 'UAH', "comment" text NOT NULL, "recipient_data" json, "delivery_data" json, "payment_data" json, "data" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog_categories" ("id" SERIAL NOT NULL, "title" json NOT NULL, "slug" character varying NOT NULL, "seo_h1" json, "seo_title" json, "seo_description" json, "seo_text" json, "seo_keywords" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_903a6ea496e83ba9bec10af5835" UNIQUE ("slug"), CONSTRAINT "PK_1056d6faca26b9957f5d26e6572" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog_comments" ("id" SERIAL NOT NULL, "post_id" integer NOT NULL, "user_id" integer NOT NULL, "comment" text NOT NULL, "is_approved" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "REL_c34a2a0bf1dcc3687871de1ff1" UNIQUE ("user_id"), CONSTRAINT "PK_b478aaeecf38441a25739aa9610" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "blog_posts" ("id" SERIAL NOT NULL, "author_id" integer NOT NULL, "censor_id" integer NOT NULL, "published_at" date NOT NULL, "title" json NOT NULL, "slug" character varying NOT NULL, "excerpt" json, "content" json, "alt" json, "cdn_data" json, "seo_h1" json, "seo_title" json, "seo_description" json, "seo_text" json, "seo_keywords" json, "published" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_5b2818a2c45c3edb9991b1c7a51" UNIQUE ("slug"), CONSTRAINT "PK_dd2add25eac93daefc93da9d387" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "banners" ("id" SERIAL NOT NULL, "name" character varying(125) NOT NULL, "slug" character varying(125) NOT NULL, "btn_pos" character varying(125) NOT NULL, "show_title" boolean NOT NULL DEFAULT false, "cdn_data" json, "url" character varying(125), "published" boolean NOT NULL DEFAULT false, "publish_start" TIMESTAMP, "publish_end" TIMESTAMP, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_f6c61dac2ffb69440ddb067deed" UNIQUE ("slug"), CONSTRAINT "PK_e9b186b959296fcb940790d31c3" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "brands" ("id" SERIAL NOT NULL, "sync_id" integer, "name" json, "slug" character varying, "image" character varying, "cdn_data" json, "position" integer NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT true, "popular" boolean NOT NULL DEFAULT true, "description" json, "seo_h1" json, "seo_title" json, "seo_description" json, "seo_keywords" json, "seo_text" json, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_1c83115558f31033f2d836bb6ac" UNIQUE ("sync_id"), CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "pages" ("id" SERIAL NOT NULL, "code" character varying NOT NULL, "slug" character varying NOT NULL, "title" json NOT NULL, "text" json, "variables" json, "seo_h1" json, "seo_title" json, "seo_description" json, "seo_keywords" json, "published" boolean NOT NULL DEFAULT false, "show_order" integer NOT NULL DEFAULT '0', "dynamic" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_81114bf36ab62f1d301df833994" UNIQUE ("code"), CONSTRAINT "UQ_fe66ca6a86dc94233e5d7789535" UNIQUE ("slug"), CONSTRAINT "PK_8f21ed625aa34c8391d636b7d3b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "site_options" ("id" SERIAL NOT NULL, "key" character varying(125) NOT NULL, "title" character varying(125) NOT NULL, "value" text, "type" character varying(125) NOT NULL, "primary" smallint NOT NULL, "switchable" smallint NOT NULL, "active" smallint NOT NULL DEFAULT '1', "editable" smallint NOT NULL DEFAULT '1', "position" integer NOT NULL, "group" character varying(125), "group_title" character varying(125), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_979d2c76702fe3ca1dd782fd9ab" UNIQUE ("key"), CONSTRAINT "PK_d274d6df319415c6e4b5ca76759" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "regions" ("id" SERIAL NOT NULL, "lat" character varying, "lng" character varying, "country_id" integer NOT NULL, "name" json NOT NULL, "short_name" character varying NOT NULL, "slug" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_53cf784f23cbf14bb7717e969d4" UNIQUE ("slug"), CONSTRAINT "PK_4fcd12ed6a046276e2deb08801c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "districts" ("id" SERIAL NOT NULL, "country_id" integer NOT NULL, "region_id" integer NOT NULL, "name" json NOT NULL, "slug" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_d5f02510e946296ac6e48637845" UNIQUE ("slug"), CONSTRAINT "PK_972a72ff4e3bea5c7f43a2b98af" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "delivery_statuses" ("id" SERIAL NOT NULL, "title" json NOT NULL, "code" smallint NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_0b40f97cb25ea95d071b4870b23" UNIQUE ("code"), CONSTRAINT "PK_9879904dd0e500b28523986648a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "communities" ("id" SERIAL NOT NULL, "country_id" integer NOT NULL, "region_id" integer NOT NULL, "district_id" integer NOT NULL, "name" json NOT NULL, "slug" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_42d5225a80ac87aa1254dfe282c" UNIQUE ("slug"), CONSTRAINT "PK_fea1fe83c86ccde9d0a089e7ea2" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "another_points" ("id" SERIAL NOT NULL, "name" character varying(50) NOT NULL, "cdn_data" json, "active" boolean NOT NULL DEFAULT true, "main_color" character varying(7) NOT NULL DEFAULT '#ff0000', "back_color" character varying(7) NOT NULL DEFAULT '#ffffff', "num_color" character varying(7) NOT NULL DEFAULT '#000000', "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_802099968b5533199ede4447a8b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "products_categories" ("category_id" integer NOT NULL, "product_id" integer NOT NULL, CONSTRAINT "PK_634f5e1b5983772473fe0ec0008" PRIMARY KEY ("category_id", "product_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_19fe0fe8c2fcf1cbe1a80f639f" ON "products_categories" ("category_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_f2c76a4306a82c696d620f81f0" ON "products_categories" ("product_id") `);
        await queryRunner.query(`CREATE TABLE "product_badges" ("badge_id" integer NOT NULL, "product_id" integer NOT NULL, CONSTRAINT "PK_87320fcae662c9a892a45e54653" PRIMARY KEY ("badge_id", "product_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_3c5f099898dc401fb5cf4a071e" ON "product_badges" ("badge_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_d16f96a2e1b441f133b9522bdc" ON "product_badges" ("product_id") `);
        await queryRunner.query(`CREATE TABLE "product_discounts" ("discount_id" integer NOT NULL, "product_id" integer NOT NULL, CONSTRAINT "PK_fb73d2ec2c65bb88066e43a7d03" PRIMARY KEY ("discount_id", "product_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_4d3f74396271c6bee81a1a547a" ON "product_discounts" ("discount_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_68e668b0341f0276ebcc2a9150" ON "product_discounts" ("product_id") `);
        await queryRunner.query(`CREATE TABLE "blog_posts_categories" ("category_id" integer NOT NULL, "post_id" integer NOT NULL, CONSTRAINT "PK_4f367a538a1669744725b3e9686" PRIMARY KEY ("category_id", "post_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_b6eab84b4c3e20428c8c00782d" ON "blog_posts_categories" ("category_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_a2b76678db1607f0ea83149ea6" ON "blog_posts_categories" ("post_id") `);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_fd834529c6758292fa80df0ae7f" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1" FOREIGN KEY ("role_id") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products" ADD CONSTRAINT "FK_9adb63f24f86528856373f0ab9a" FOREIGN KEY ("product_type_id") REFERENCES "product_types"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_remnants" ADD CONSTRAINT "FK_b2404d09edd7c30fb6ed5b7a257" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "menu_items" ADD CONSTRAINT "FK_ba71edc684a901b4bc9d9228f42" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_comments" ADD CONSTRAINT "FK_c34a2a0bf1dcc3687871de1ff1e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_comments" ADD CONSTRAINT "FK_4e0b8959256b08ceb3d001f616b" FOREIGN KEY ("post_id") REFERENCES "blog_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_posts" ADD CONSTRAINT "FK_c3fc4a3a656aad74331acfcf2a9" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_posts" ADD CONSTRAINT "FK_09cc83bdfa111d9031aa0c64c64" FOREIGN KEY ("censor_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products_categories" ADD CONSTRAINT "FK_19fe0fe8c2fcf1cbe1a80f639f1" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "products_categories" ADD CONSTRAINT "FK_f2c76a4306a82c696d620f81f08" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_badges" ADD CONSTRAINT "FK_3c5f099898dc401fb5cf4a071ef" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_badges" ADD CONSTRAINT "FK_d16f96a2e1b441f133b9522bdcb" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_discounts" ADD CONSTRAINT "FK_4d3f74396271c6bee81a1a547a0" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_discounts" ADD CONSTRAINT "FK_68e668b0341f0276ebcc2a91506" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" ADD CONSTRAINT "FK_b6eab84b4c3e20428c8c00782d4" FOREIGN KEY ("category_id") REFERENCES "blog_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" ADD CONSTRAINT "FK_a2b76678db1607f0ea83149ea66" FOREIGN KEY ("post_id") REFERENCES "blog_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" DROP CONSTRAINT "FK_a2b76678db1607f0ea83149ea66"`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" DROP CONSTRAINT "FK_b6eab84b4c3e20428c8c00782d4"`);
        await queryRunner.query(`ALTER TABLE "product_discounts" DROP CONSTRAINT "FK_68e668b0341f0276ebcc2a91506"`);
        await queryRunner.query(`ALTER TABLE "product_discounts" DROP CONSTRAINT "FK_4d3f74396271c6bee81a1a547a0"`);
        await queryRunner.query(`ALTER TABLE "product_badges" DROP CONSTRAINT "FK_d16f96a2e1b441f133b9522bdcb"`);
        await queryRunner.query(`ALTER TABLE "product_badges" DROP CONSTRAINT "FK_3c5f099898dc401fb5cf4a071ef"`);
        await queryRunner.query(`ALTER TABLE "products_categories" DROP CONSTRAINT "FK_f2c76a4306a82c696d620f81f08"`);
        await queryRunner.query(`ALTER TABLE "products_categories" DROP CONSTRAINT "FK_19fe0fe8c2fcf1cbe1a80f639f1"`);
        await queryRunner.query(`ALTER TABLE "blog_posts" DROP CONSTRAINT "FK_09cc83bdfa111d9031aa0c64c64"`);
        await queryRunner.query(`ALTER TABLE "blog_posts" DROP CONSTRAINT "FK_c3fc4a3a656aad74331acfcf2a9"`);
        await queryRunner.query(`ALTER TABLE "blog_comments" DROP CONSTRAINT "FK_4e0b8959256b08ceb3d001f616b"`);
        await queryRunner.query(`ALTER TABLE "blog_comments" DROP CONSTRAINT "FK_c34a2a0bf1dcc3687871de1ff1e"`);
        await queryRunner.query(`ALTER TABLE "menu_items" DROP CONSTRAINT "FK_ba71edc684a901b4bc9d9228f42"`);
        await queryRunner.query(`ALTER TABLE "product_remnants" DROP CONSTRAINT "FK_b2404d09edd7c30fb6ed5b7a257"`);
        await queryRunner.query(`ALTER TABLE "products" DROP CONSTRAINT "FK_9adb63f24f86528856373f0ab9a"`);
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_a2cecd1a3531c0b041e29ba46e1"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_fd834529c6758292fa80df0ae7f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a2b76678db1607f0ea83149ea6"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b6eab84b4c3e20428c8c00782d"`);
        await queryRunner.query(`DROP TABLE "blog_posts_categories"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_68e668b0341f0276ebcc2a9150"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_4d3f74396271c6bee81a1a547a"`);
        await queryRunner.query(`DROP TABLE "product_discounts"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d16f96a2e1b441f133b9522bdc"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3c5f099898dc401fb5cf4a071e"`);
        await queryRunner.query(`DROP TABLE "product_badges"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f2c76a4306a82c696d620f81f0"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_19fe0fe8c2fcf1cbe1a80f639f"`);
        await queryRunner.query(`DROP TABLE "products_categories"`);
        await queryRunner.query(`DROP TABLE "another_points"`);
        await queryRunner.query(`DROP TABLE "communities"`);
        await queryRunner.query(`DROP TABLE "delivery_statuses"`);
        await queryRunner.query(`DROP TABLE "districts"`);
        await queryRunner.query(`DROP TABLE "regions"`);
        await queryRunner.query(`DROP TABLE "site_options"`);
        await queryRunner.query(`DROP TABLE "pages"`);
        await queryRunner.query(`DROP TABLE "brands"`);
        await queryRunner.query(`DROP TABLE "banners"`);
        await queryRunner.query(`DROP TABLE "blog_posts"`);
        await queryRunner.query(`DROP TABLE "blog_comments"`);
        await queryRunner.query(`DROP TABLE "blog_categories"`);
        await queryRunner.query(`DROP TABLE "orders"`);
        await queryRunner.query(`DROP TABLE "order_items"`);
        await queryRunner.query(`DROP TABLE "menu_items"`);
        await queryRunner.query(`DROP TABLE "menus"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_b2404d09edd7c30fb6ed5b7a25"`);
        await queryRunner.query(`DROP TABLE "product_remnants"`);
        await queryRunner.query(`DROP TABLE "products"`);
        await queryRunner.query(`DROP TABLE "discounts"`);
        await queryRunner.query(`DROP TABLE "badges"`);
        await queryRunner.query(`DROP TABLE "product_types"`);
        await queryRunner.query(`DROP TABLE "categories"`);
        await queryRunner.query(`DROP TABLE "roles"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TABLE "user_profile"`);
        await queryRunner.query(`DROP TABLE "stores"`);
        await queryRunner.query(`DROP TABLE "cities"`);
    }

}