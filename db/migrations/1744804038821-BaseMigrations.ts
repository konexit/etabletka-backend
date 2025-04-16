import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1744804038821 implements MigrationInterface {
    name = 'BaseMigrations1744804038821'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "comment_answers" ("id" SERIAL NOT NULL, "comment_id" integer NOT NULL, "user_id" integer NOT NULL, "answer" text NOT NULL, "approved" boolean NOT NULL DEFAULT false, "anonymous" boolean NOT NULL DEFAULT false, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, CONSTRAINT "PK_d0cd2a45731957505befe29f230" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "parent_id"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "likes" integer array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "dislikes" integer array NOT NULL DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "answers" integer array NOT NULL DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "answers"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "dislikes"`);
        await queryRunner.query(`ALTER TABLE "comments" DROP COLUMN "likes"`);
        await queryRunner.query(`ALTER TABLE "comments" ADD "parent_id" integer`);
        await queryRunner.query(`DROP TABLE "comment_answers"`);
    }

}
