import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1742811044910 implements MigrationInterface {
    name = 'BaseMigrations1742811044910'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_fd834529c6758292fa80df0ae7f"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_9c590ae1483777903f8b953aa70"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_20d8079f3a0833a4b044d69bc19"`);
        await queryRunner.query(`CREATE TABLE "katottg" ("id" SERIAL NOT NULL, "first_level" character varying NOT NULL, "second_level" character varying NOT NULL, "third_level" character varying NOT NULL, "fourth_level" character varying NOT NULL, "additional_level" character varying NOT NULL, "object_category" character varying NOT NULL, "name" jsonb NOT NULL, "prefix" jsonb, "lat" character varying, "lng" character varying, "slug" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8754ee57facf393241fdb60a0a8" UNIQUE ("slug"), CONSTRAINT "PK_022390e62a164a2757d9a7d94fa" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "katottg_id" integer`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]::int[]`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]::varchar[]`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_026d29ef0eb4a329e083ba7b7ed" FOREIGN KEY ("katottg_id") REFERENCES "katottg"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_026d29ef0eb4a329e083ba7b7ed"`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "katottg_id"`);
        await queryRunner.query(`DROP TABLE "katottg"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_20d8079f3a0833a4b044d69bc19" FOREIGN KEY ("region_id") REFERENCES "regions"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_9c590ae1483777903f8b953aa70" FOREIGN KEY ("district_id") REFERENCES "districts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_fd834529c6758292fa80df0ae7f" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
