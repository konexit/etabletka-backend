import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1725451906878 implements MigrationInterface {
    name = 'BaseMigrations1725451906878'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_comments" DROP CONSTRAINT "FK_100cd3bee88b5cea4ab4dc428cd"`);
        await queryRunner.query(`ALTER TABLE "blog_comments" DROP COLUMN "blogPostId"`);
        await queryRunner.query(`ALTER TABLE "blog_comments" ADD CONSTRAINT "FK_4e0b8959256b08ceb3d001f616b" FOREIGN KEY ("post_id") REFERENCES "blog_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_comments" DROP CONSTRAINT "FK_4e0b8959256b08ceb3d001f616b"`);
        await queryRunner.query(`ALTER TABLE "blog_comments" ADD "blogPostId" integer`);
        await queryRunner.query(`ALTER TABLE "blog_comments" ADD CONSTRAINT "FK_100cd3bee88b5cea4ab4dc428cd" FOREIGN KEY ("blogPostId") REFERENCES "blog_posts"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
