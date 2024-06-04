import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1717484053593 implements MigrationInterface {
    name = 'BaseMigrations1717484053593'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "menu_items" ("id" SERIAL NOT NULL, "menu_id" integer NOT NULL, "title" json NOT NULL, "slug" character varying NOT NULL, "position" integer NOT NULL DEFAULT '0', "active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "menuId" integer, CONSTRAINT "UQ_1d94a24b755756d204a6e58f4f6" UNIQUE ("slug"), CONSTRAINT "PK_57e6188f929e5dc6919168620c8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "menus" ("id" SERIAL NOT NULL, "title" json NOT NULL, "slug" character varying NOT NULL, "description" character varying NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_478abfb63bdfce389d94d5d9323" UNIQUE ("slug"), CONSTRAINT "UQ_86e5e83ebda22635b093a57d85b" UNIQUE ("description"), CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "payment_type_id" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "payment_type_id" SET DEFAULT '2'`);
        await queryRunner.query(`ALTER TABLE "menu_items" ADD CONSTRAINT "FK_a6b42bf45dbdef19cbf05a4cacf" FOREIGN KEY ("menuId") REFERENCES "menus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items" DROP CONSTRAINT "FK_a6b42bf45dbdef19cbf05a4cacf"`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "payment_type_id" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "orders" ALTER COLUMN "payment_type_id" DROP NOT NULL`);
        await queryRunner.query(`DROP TABLE "menus"`);
        await queryRunner.query(`DROP TABLE "menu_items"`);
    }

}
