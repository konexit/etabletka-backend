import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1743150040169 implements MigrationInterface {
    name = 'BaseMigrations1743150040169'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "companies" ("id" SERIAL NOT NULL, "name" character varying NOT NULL, "sync_id" integer NOT NULL, "edrpou" integer NOT NULL, "email" character varying NOT NULL, "phone" character varying NOT NULL, "address" character varying NOT NULL, "cdn_data" jsonb, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "PK_d4bc3e82a314fa9e29f652c2c22" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]::int[]`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]::varchar[]`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_2be771fa4dcfdc26f586264a62e" FOREIGN KEY ("company_id") REFERENCES "companies"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_2be771fa4dcfdc26f586264a62e"`);
        await queryRunner.query(`ALTER TABLE "product_attributes" ALTER COLUMN "merge_keys" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`ALTER TABLE "products" ALTER COLUMN "categories" SET DEFAULT ARRAY[]`);
        await queryRunner.query(`DROP TABLE "companies"`);
    }

}
