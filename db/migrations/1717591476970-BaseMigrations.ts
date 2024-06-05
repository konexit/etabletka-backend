import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1717591476970 implements MigrationInterface {
    name = 'BaseMigrations1717591476970'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "roles" ("id" SERIAL NOT NULL, "role" character varying(125) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_ccc7c1489f3a6b3c9b47d4537c5" UNIQUE ("role"), CONSTRAINT "PK_c1433d71a4838793a49dcad46ab" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "users" ADD "roleId" integer`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role_id" SET DEFAULT '2'`);
        await queryRunner.query(`ALTER TABLE "users" ADD CONSTRAINT "FK_368e146b785b574f42ae9e53d5e" FOREIGN KEY ("roleId") REFERENCES "roles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP CONSTRAINT "FK_368e146b785b574f42ae9e53d5e"`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "role_id" SET DEFAULT '1'`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "roleId"`);
        await queryRunner.query(`DROP TABLE "roles"`);
    }

}
