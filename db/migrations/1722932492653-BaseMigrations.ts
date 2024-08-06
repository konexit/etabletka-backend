import { MigrationInterface, QueryRunner } from "typeorm";

export class BaseMigrations1722932492653 implements MigrationInterface {
    name = 'BaseMigrations1722932492653'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cross_groups_products" DROP CONSTRAINT "FK_05d4e16b529d851d70b8913c68a"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_05d4e16b529d851d70b8913c68"`);
        await queryRunner.query(`ALTER TABLE "cross_groups_products" RENAME COLUMN "productGroupId" TO "productGroupsId"`);
        await queryRunner.query(`ALTER TABLE "cross_groups_products" RENAME CONSTRAINT "PK_a7c4bcd3fbf254e2769f6b11e64" TO "PK_ef4beedfd9298b6a147b9985cc7"`);
        await queryRunner.query(`CREATE INDEX "IDX_40b0642d18c70a24a0085093ad" ON "cross_groups_products" ("productGroupsId") `);
        await queryRunner.query(`ALTER TABLE "cross_groups_products" ADD CONSTRAINT "FK_40b0642d18c70a24a0085093ad9" FOREIGN KEY ("productGroupsId") REFERENCES "product_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cross_groups_products" DROP CONSTRAINT "FK_40b0642d18c70a24a0085093ad9"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_40b0642d18c70a24a0085093ad"`);
        await queryRunner.query(`ALTER TABLE "cross_groups_products" RENAME CONSTRAINT "PK_ef4beedfd9298b6a147b9985cc7" TO "PK_a7c4bcd3fbf254e2769f6b11e64"`);
        await queryRunner.query(`ALTER TABLE "cross_groups_products" RENAME COLUMN "productGroupsId" TO "productGroupId"`);
        await queryRunner.query(`CREATE INDEX "IDX_05d4e16b529d851d70b8913c68" ON "cross_groups_products" ("productGroupId") `);
        await queryRunner.query(`ALTER TABLE "cross_groups_products" ADD CONSTRAINT "FK_05d4e16b529d851d70b8913c68a" FOREIGN KEY ("productGroupId") REFERENCES "product_group"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
