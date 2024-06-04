import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1717485770332 implements MigrationInterface {
    name = 'BaseMigrations1717485770332'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items" DROP CONSTRAINT "FK_a6b42bf45dbdef19cbf05a4cacf"`);
        await queryRunner.query(`ALTER TABLE "menu_items" DROP COLUMN "menuId"`);
        await queryRunner.query(`ALTER TABLE "menu_items" DROP CONSTRAINT "UQ_1d94a24b755756d204a6e58f4f6"`);
        await queryRunner.query(`ALTER TABLE "menu_items" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "menu_items" ADD "slug" character varying(200) NOT NULL`);
        await queryRunner.query(`ALTER TABLE "menu_items" ADD CONSTRAINT "FK_ba71edc684a901b4bc9d9228f42" FOREIGN KEY ("menu_id") REFERENCES "menus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items" DROP CONSTRAINT "FK_ba71edc684a901b4bc9d9228f42"`);
        await queryRunner.query(`ALTER TABLE "menu_items" DROP COLUMN "slug"`);
        await queryRunner.query(`ALTER TABLE "menu_items" ADD "slug" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "menu_items" ADD CONSTRAINT "UQ_1d94a24b755756d204a6e58f4f6" UNIQUE ("slug")`);
        await queryRunner.query(`ALTER TABLE "menu_items" ADD "menuId" integer`);
        await queryRunner.query(`ALTER TABLE "menu_items" ADD CONSTRAINT "FK_a6b42bf45dbdef19cbf05a4cacf" FOREIGN KEY ("menuId") REFERENCES "menus"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
