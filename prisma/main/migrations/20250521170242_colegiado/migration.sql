-- AlterTable
ALTER TABLE `publicacoes` ADD COLUMN `colegiado` ENUM('AR', 'RR', 'CEUSO', 'CAIEPS', 'CAEHIS', 'CPPU', 'CTLU') NOT NULL DEFAULT 'AR';
