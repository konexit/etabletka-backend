import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1725447777774 implements MigrationInterface {
    name = 'BaseMigrations1725447777774'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_comments" DROP CONSTRAINT "FK_c34a2a0bf1dcc3687871de1ff1e"`);
        await queryRunner.query(`ALTER TABLE "blog_comments" DROP CONSTRAINT "REL_c34a2a0bf1dcc3687871de1ff1"`);
        await queryRunner.query(`ALTER TABLE "blog_comments" ADD CONSTRAINT "FK_c34a2a0bf1dcc3687871de1ff1e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_comments" DROP CONSTRAINT "FK_c34a2a0bf1dcc3687871de1ff1e"`);
        await queryRunner.query(`ALTER TABLE "blog_comments" ADD CONSTRAINT "REL_c34a2a0bf1dcc3687871de1ff1" UNIQUE ("user_id")`);
        await queryRunner.query(`ALTER TABLE "blog_comments" ADD CONSTRAINT "FK_c34a2a0bf1dcc3687871de1ff1e" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
