import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1725610609073 implements MigrationInterface {
    name = 'BaseMigrations1725610609073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_comments" DROP CONSTRAINT "FK_310f5a0059db779ef661d04b31b"`);
        await queryRunner.query(`ALTER TABLE "product_comments" DROP CONSTRAINT "REL_310f5a0059db779ef661d04b31"`);
        await queryRunner.query(`ALTER TABLE "product_comments" ADD CONSTRAINT "FK_310f5a0059db779ef661d04b31b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "product_comments" DROP CONSTRAINT "FK_310f5a0059db779ef661d04b31b"`);
        await queryRunner.query(`ALTER TABLE "product_comments" ADD CONSTRAINT "REL_310f5a0059db779ef661d04b31" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "product_comments" ADD CONSTRAINT "FK_310f5a0059db779ef661d04b31b" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
