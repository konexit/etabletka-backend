import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1746092422596 implements MigrationInterface {
    name = 'BaseMigrations1746092422596'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items" ADD "url" character varying(1000)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "menu_items" DROP COLUMN "url"`);
    }

}
