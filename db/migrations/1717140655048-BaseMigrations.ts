import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1717140655048 implements MigrationInterface {
    name = 'BaseMigrations1717140655048'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "sync_id" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ALTER COLUMN "sync_id" SET NOT NULL`);
    }

}
