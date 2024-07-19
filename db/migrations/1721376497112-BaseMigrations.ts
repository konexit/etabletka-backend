import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1721376497112 implements MigrationInterface {
    name = 'BaseMigrations1721376497112'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP CONSTRAINT "FK_3ae3c58b21087e07f873de507be"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP CONSTRAINT "FK_cd267f0cd5fc18448910a5d57b5"`);
        await queryRunner.query(`ALTER TABLE "product_badges" DROP CONSTRAINT "FK_d16f96a2e1b441f133b9522bdcb"`);
        await queryRunner.query(`ALTER TABLE "product_badges" DROP CONSTRAINT "FK_3c5f099898dc401fb5cf4a071ef"`);
        await queryRunner.query(`ALTER TABLE "product_discounts" DROP CONSTRAINT "FK_68e668b0341f0276ebcc2a91506"`);
        await queryRunner.query(`ALTER TABLE "product_discounts" DROP CONSTRAINT "FK_4d3f74396271c6bee81a1a547a0"`);
        await queryRunner.query(`ALTER TABLE "products_categories" DROP CONSTRAINT "FK_f2c76a4306a82c696d620f81f08"`);
        await queryRunner.query(`ALTER TABLE "products_categories" DROP CONSTRAINT "FK_19fe0fe8c2fcf1cbe1a80f639f1"`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" DROP CONSTRAINT "FK_b6eab84b4c3e20428c8c00782d4"`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" DROP CONSTRAINT "FK_a2b76678db1607f0ea83149ea66"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cd267f0cd5fc18448910a5d57b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3ae3c58b21087e07f873de507b"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP CONSTRAINT "PK_2c534412780c2b82c9c29b333c2"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD CONSTRAINT "PK_3ae3c58b21087e07f873de507be" PRIMARY KEY ("discount_id")`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP COLUMN "group_id"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP CONSTRAINT "PK_3ae3c58b21087e07f873de507be"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP COLUMN "discount_id"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD "group_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD CONSTRAINT "PK_cd267f0cd5fc18448910a5d57b5" PRIMARY KEY ("group_id")`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD "discount_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP CONSTRAINT "PK_cd267f0cd5fc18448910a5d57b5"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD CONSTRAINT "PK_2c534412780c2b82c9c29b333c2" PRIMARY KEY ("group_id", "discount_id")`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD "discount_id_1" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP CONSTRAINT "PK_2c534412780c2b82c9c29b333c2"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD CONSTRAINT "PK_35b2bfef0c4d3d271da38f7287e" PRIMARY KEY ("group_id", "discount_id", "discount_id_1")`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD "discount_id_2" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP CONSTRAINT "PK_35b2bfef0c4d3d271da38f7287e"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD CONSTRAINT "PK_01402fda57b15a4a1c7a65a2e68" PRIMARY KEY ("group_id", "discount_id", "discount_id_1", "discount_id_2")`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP CONSTRAINT "PK_01402fda57b15a4a1c7a65a2e68"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD CONSTRAINT "PK_2c534412780c2b82c9c29b333c2" PRIMARY KEY ("group_id", "discount_id")`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP CONSTRAINT "PK_01402fda57b15a4a1c7a65a2e68"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD CONSTRAINT "PK_a4540d85f4b54c1893ea23496c0" PRIMARY KEY ("discount_id_1", "discount_id_2")`);
        await queryRunner.query(`CREATE INDEX "IDX_cd267f0cd5fc18448910a5d57b" ON "discounts_groups" ("group_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_3ae3c58b21087e07f873de507b" ON "discounts_groups" ("discount_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_c1719b4b0afd3d8159a071c167" ON "discounts_groups" ("discount_id_1") `);
        await queryRunner.query(`CREATE INDEX "IDX_9e228d2b7812331f93efbb426f" ON "discounts_groups" ("discount_id_2") `);
        await queryRunner.query(`ALTER TABLE "products_categories" ADD CONSTRAINT "FK_19fe0fe8c2fcf1cbe1a80f639f1" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "products_categories" ADD CONSTRAINT "FK_f2c76a4306a82c696d620f81f08" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_badges" ADD CONSTRAINT "FK_3c5f099898dc401fb5cf4a071ef" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_badges" ADD CONSTRAINT "FK_d16f96a2e1b441f133b9522bdcb" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD CONSTRAINT "FK_cd267f0cd5fc18448910a5d57b5" FOREIGN KEY ("group_id") REFERENCES "discount_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD CONSTRAINT "FK_3ae3c58b21087e07f873de507be" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_discounts" ADD CONSTRAINT "FK_4d3f74396271c6bee81a1a547a0" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_discounts" ADD CONSTRAINT "FK_68e668b0341f0276ebcc2a91506" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD CONSTRAINT "FK_c1719b4b0afd3d8159a071c1673" FOREIGN KEY ("discount_id_1") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD CONSTRAINT "FK_9e228d2b7812331f93efbb426f6" FOREIGN KEY ("discount_id_2") REFERENCES "discount_groups"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" ADD CONSTRAINT "FK_b6eab84b4c3e20428c8c00782d4" FOREIGN KEY ("category_id") REFERENCES "blog_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" ADD CONSTRAINT "FK_a2b76678db1607f0ea83149ea66" FOREIGN KEY ("post_id") REFERENCES "blog_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" DROP CONSTRAINT "FK_a2b76678db1607f0ea83149ea66"`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" DROP CONSTRAINT "FK_b6eab84b4c3e20428c8c00782d4"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP CONSTRAINT "FK_9e228d2b7812331f93efbb426f6"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP CONSTRAINT "FK_c1719b4b0afd3d8159a071c1673"`);
        await queryRunner.query(`ALTER TABLE "product_discounts" DROP CONSTRAINT "FK_68e668b0341f0276ebcc2a91506"`);
        await queryRunner.query(`ALTER TABLE "product_discounts" DROP CONSTRAINT "FK_4d3f74396271c6bee81a1a547a0"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP CONSTRAINT "FK_3ae3c58b21087e07f873de507be"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP CONSTRAINT "FK_cd267f0cd5fc18448910a5d57b5"`);
        await queryRunner.query(`ALTER TABLE "product_badges" DROP CONSTRAINT "FK_d16f96a2e1b441f133b9522bdcb"`);
        await queryRunner.query(`ALTER TABLE "product_badges" DROP CONSTRAINT "FK_3c5f099898dc401fb5cf4a071ef"`);
        await queryRunner.query(`ALTER TABLE "products_categories" DROP CONSTRAINT "FK_f2c76a4306a82c696d620f81f08"`);
        await queryRunner.query(`ALTER TABLE "products_categories" DROP CONSTRAINT "FK_19fe0fe8c2fcf1cbe1a80f639f1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_9e228d2b7812331f93efbb426f"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c1719b4b0afd3d8159a071c167"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_3ae3c58b21087e07f873de507b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_cd267f0cd5fc18448910a5d57b"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP CONSTRAINT "PK_a4540d85f4b54c1893ea23496c0"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD CONSTRAINT "PK_01402fda57b15a4a1c7a65a2e68" PRIMARY KEY ("group_id", "discount_id", "discount_id_1", "discount_id_2")`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP CONSTRAINT "PK_2c534412780c2b82c9c29b333c2"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD CONSTRAINT "PK_01402fda57b15a4a1c7a65a2e68" PRIMARY KEY ("group_id", "discount_id", "discount_id_1", "discount_id_2")`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP CONSTRAINT "PK_01402fda57b15a4a1c7a65a2e68"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD CONSTRAINT "PK_35b2bfef0c4d3d271da38f7287e" PRIMARY KEY ("group_id", "discount_id", "discount_id_1")`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP COLUMN "discount_id_2"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP CONSTRAINT "PK_35b2bfef0c4d3d271da38f7287e"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD CONSTRAINT "PK_2c534412780c2b82c9c29b333c2" PRIMARY KEY ("group_id", "discount_id")`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP COLUMN "discount_id_1"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP CONSTRAINT "PK_2c534412780c2b82c9c29b333c2"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD CONSTRAINT "PK_cd267f0cd5fc18448910a5d57b5" PRIMARY KEY ("group_id")`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP COLUMN "discount_id"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP CONSTRAINT "PK_cd267f0cd5fc18448910a5d57b5"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP COLUMN "group_id"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD "discount_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD CONSTRAINT "PK_3ae3c58b21087e07f873de507be" PRIMARY KEY ("discount_id")`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD "group_id" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" DROP CONSTRAINT "PK_3ae3c58b21087e07f873de507be"`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD CONSTRAINT "PK_2c534412780c2b82c9c29b333c2" PRIMARY KEY ("group_id", "discount_id")`);
        await queryRunner.query(`CREATE INDEX "IDX_3ae3c58b21087e07f873de507b" ON "discounts_groups" ("discount_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_cd267f0cd5fc18448910a5d57b" ON "discounts_groups" ("group_id") `);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" ADD CONSTRAINT "FK_a2b76678db1607f0ea83149ea66" FOREIGN KEY ("post_id") REFERENCES "blog_posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "blog_posts_categories" ADD CONSTRAINT "FK_b6eab84b4c3e20428c8c00782d4" FOREIGN KEY ("category_id") REFERENCES "blog_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "products_categories" ADD CONSTRAINT "FK_19fe0fe8c2fcf1cbe1a80f639f1" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "products_categories" ADD CONSTRAINT "FK_f2c76a4306a82c696d620f81f08" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_discounts" ADD CONSTRAINT "FK_4d3f74396271c6bee81a1a547a0" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_discounts" ADD CONSTRAINT "FK_68e668b0341f0276ebcc2a91506" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "product_badges" ADD CONSTRAINT "FK_3c5f099898dc401fb5cf4a071ef" FOREIGN KEY ("badge_id") REFERENCES "badges"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "product_badges" ADD CONSTRAINT "FK_d16f96a2e1b441f133b9522bdcb" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD CONSTRAINT "FK_cd267f0cd5fc18448910a5d57b5" FOREIGN KEY ("group_id") REFERENCES "discount_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "discounts_groups" ADD CONSTRAINT "FK_3ae3c58b21087e07f873de507be" FOREIGN KEY ("discount_id") REFERENCES "discounts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
