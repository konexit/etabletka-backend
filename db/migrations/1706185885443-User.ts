import { MigrationInterface, QueryRunner } from "typeorm";

export class User1706185885443 implements MigrationInterface {
    name = 'User1706185885443'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE \`user\` (\`id\` int NOT NULL AUTO_INCREMENT, \`email\` varchar(255) NOT NULL, \`password\` varchar(255) NOT NULL, \`firstName\` varchar(255) NOT NULL, \`lastName\` varchar(255) NOT NULL, \`isActive\` tinyint NOT NULL DEFAULT 1, \`userType\` int NOT NULL DEFAULT '1', UNIQUE INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product_remnant\` (\`id\` int NOT NULL AUTO_INCREMENT, \`productId\` int NOT NULL, \`storeId\` int NOT NULL DEFAULT '1', \`quantity\` int NOT NULL DEFAULT '0', \`isActive\` tinyint NOT NULL DEFAULT 0, INDEX \`IDX_dacb2cc696b0516d6134b6e3f1\` (\`productId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`CREATE TABLE \`product\` (\`id\` int NOT NULL AUTO_INCREMENT, \`syncId\` int NOT NULL, \`companyId\` int NULL, \`name\` json NOT NULL, \`shortName\` json NOT NULL, \`seoH1\` json NULL, \`seoTitle\` json NULL, \`seoDescription\` json NULL, \`seoKeywords\` json NULL, \`seoText\` json NULL, \`price\` int NOT NULL DEFAULT '0', \`isActive\` tinyint NOT NULL DEFAULT 0, \`inStoke\` tinyint NOT NULL DEFAULT 0, UNIQUE INDEX \`IDX_5b7c7c0d182a8b4ad88a23c73e\` (\`syncId\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`);
        await queryRunner.query(`ALTER TABLE \`product_remnant\` ADD CONSTRAINT \`FK_dacb2cc696b0516d6134b6e3f16\` FOREIGN KEY (\`productId\`) REFERENCES \`product\`(\`id\`) ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE \`product_remnant\` DROP FOREIGN KEY \`FK_dacb2cc696b0516d6134b6e3f16\``);
        await queryRunner.query(`DROP INDEX \`IDX_5b7c7c0d182a8b4ad88a23c73e\` ON \`product\``);
        await queryRunner.query(`DROP TABLE \`product\``);
        await queryRunner.query(`DROP INDEX \`IDX_dacb2cc696b0516d6134b6e3f1\` ON \`product_remnant\``);
        await queryRunner.query(`DROP TABLE \`product_remnant\``);
        await queryRunner.query(`DROP INDEX \`IDX_e12875dfb3b1d92d7d7c5377e2\` ON \`user\``);
        await queryRunner.query(`DROP TABLE \`user\``);
    }

}
