import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1718629456797 implements MigrationInterface {
    name = 'BaseMigrations1718629456797'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_badges" DROP CONSTRAINT "FK_d16f96a2e1b441f133b9522bdcb"`);
        await queryRunner.query(`ALTER TABLE "product_badges" DROP CONSTRAINT "FK_3c5f099898dc401fb5cf4a071ef"`);
        await queryRunner.query(`ALTER TABLE "product_discounts" DROP CONSTRAINT "FK_68e668b0341f0276ebcc2a91506"`);
        await queryRunner.query(`ALTER TABLE "product_discounts" DROP CONSTRAINT "FK_4d3f74396271c6bee81a1a547a0"`);
        await queryRunner.query(`ALTER TABLE "products_categories" DROP CONSTRAINT "FK_f2c76a4306a82c696d620f81f08"`);
        await queryRunner.query(`ALTER TABLE "products_categories" DROP CONSTRAINT "FK_19fe0fe8c2fcf1cbe1a80f639f1"`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" DROP CONSTRAINT "FK_a2b76678db1607f0ea83149ea66"`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" DROP CONSTRAINT "FK_b6eab84b4c3e20428c8c00782d4"`);
        await queryRunner.query(`CREATE TABLE "faq_items" ("id" SERIAL NOT NULL, "author_id" integer NOT NULL, "question" json, "answer" json, "published" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_72fbce3e53149fa821abbf674ea" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "pages" ADD "menu_index" smallint NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "product_remnants" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "product_remnants" ADD "quantity" numeric(1000,3) NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "faq_items" ADD CONSTRAINT "FK_78670b09fcadf84ceb4e528aa85" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products_categories" ADD CONSTRAINT "FK_19fe0fe8c2fcf1cbe1a80f639f1" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "products_categories" ADD CONSTRAINT "FK_f2c76a4306a82c696d620f81f08" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_badges" ADD CONSTRAINT "FK_3c5f099898dc401fb5cf4a071ef" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_badges" ADD CONSTRAINT "FK_d16f96a2e1b441f133b9522bdcb" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_discounts" ADD CONSTRAINT "FK_4d3f74396271c6bee81a1a547a0" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_discounts" ADD CONSTRAINT "FK_68e668b0341f0276ebcc2a91506" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" ADD CONSTRAINT "FK_a2b76678db1607f0ea83149ea66" FOREIGN KEY ("post_id") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" ADD CONSTRAINT "FK_b6eab84b4c3e20428c8c00782d4" FOREIGN KEY ("category_id") REFERENCES "blog_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" DROP CONSTRAINT "FK_b6eab84b4c3e20428c8c00782d4"`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" DROP CONSTRAINT "FK_a2b76678db1607f0ea83149ea66"`);
        await queryRunner.query(`ALTER TABLE "product_discounts" DROP CONSTRAINT "FK_68e668b0341f0276ebcc2a91506"`);
        await queryRunner.query(`ALTER TABLE "product_discounts" DROP CONSTRAINT "FK_4d3f74396271c6bee81a1a547a0"`);
        await queryRunner.query(`ALTER TABLE "product_badges" DROP CONSTRAINT "FK_d16f96a2e1b441f133b9522bdcb"`);
        await queryRunner.query(`ALTER TABLE "product_badges" DROP CONSTRAINT "FK_3c5f099898dc401fb5cf4a071ef"`);
        await queryRunner.query(`ALTER TABLE "products_categories" DROP CONSTRAINT "FK_f2c76a4306a82c696d620f81f08"`);
        await queryRunner.query(`ALTER TABLE "products_categories" DROP CONSTRAINT "FK_19fe0fe8c2fcf1cbe1a80f639f1"`);
        await queryRunner.query(`ALTER TABLE "faq_items" DROP CONSTRAINT "FK_78670b09fcadf84ceb4e528aa85"`);
        await queryRunner.query(`ALTER TABLE "product_remnants" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "product_remnants" ADD "quantity" integer NOT NULL DEFAULT '0'`);
        await queryRunner.query(`ALTER TABLE "pages" DROP COLUMN "menu_index"`);
        await queryRunner.query(`DROP TABLE "faq_items"`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" ADD CONSTRAINT "FK_b6eab84b4c3e20428c8c00782d4" FOREIGN KEY ("category_id") REFERENCES "blog_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" ADD CONSTRAINT "FK_a2b76678db1607f0ea83149ea66" FOREIGN KEY ("post_id") REFERENCES "blog_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products_categories" ADD CONSTRAINT "FK_19fe0fe8c2fcf1cbe1a80f639f1" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "products_categories" ADD CONSTRAINT "FK_f2c76a4306a82c696d620f81f08" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_discounts" ADD CONSTRAINT "FK_4d3f74396271c6bee81a1a547a0" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_discounts" ADD CONSTRAINT "FK_68e668b0341f0276ebcc2a91506" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_badges" ADD CONSTRAINT "FK_3c5f099898dc401fb5cf4a071ef" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_badges" ADD CONSTRAINT "FK_d16f96a2e1b441f133b9522bdcb" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
