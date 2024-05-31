import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1717157523519 implements MigrationInterface {
    name = 'BaseMigrations1717157523519'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "pages" ALTER COLUMN "text" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pages" ALTER COLUMN "variables" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "stores" ADD CONSTRAINT "FK_fd834529c6758292fa80df0ae7f" FOREIGN KEY ("city_id") REFERENCES "cities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "stores" DROP CONSTRAINT "FK_fd834529c6758292fa80df0ae7f"`);
        await queryRunner.query(`ALTER TABLE "pages" ALTER COLUMN "variables" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "pages" ALTER COLUMN "text" SET NOT NULL`);
    }

}
