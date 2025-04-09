import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1744204348450 implements MigrationInterface {
    name = 'BaseMigrations1744204348450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" ADD "rating" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "rating"`);
    }

}
