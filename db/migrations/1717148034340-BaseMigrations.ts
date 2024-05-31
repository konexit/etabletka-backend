import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1717148034340 implements MigrationInterface {
    name = 'BaseMigrations1717148034340'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "regions" DROP COLUMN "short_name"`);
        await queryRunner.query(`ALTER TABLE "regions" ADD "short_name" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "regions" DROP COLUMN "short_name"`);
        await queryRunner.query(`ALTER TABLE "regions" ADD "short_name" json NOT NULL`);
    }

}
