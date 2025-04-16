import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1744793048190 implements MigrationInterface {
    name = 'BaseMigrations1744793048190'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" RENAME COLUMN "cdn_data" TO "image"`);
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "image" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP COLUMN "image"`);
        await queryRunner.query(`ALTER TABLE "stores" ADD "image" jsonb`);
        await queryRunner.query(`ALTER TABLE "stores" RENAME COLUMN "image" TO "cdn_data"`);
    }

}
