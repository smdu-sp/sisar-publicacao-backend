/*
  Warnings:

  - Added the required column `coordenadoria_id` to the `publicacoes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `publicacoes` ADD COLUMN `coordenadoria_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `publicacoes` ADD CONSTRAINT `publicacoes_coordenadoria_id_fkey` FOREIGN KEY (`coordenadoria_id`) REFERENCES `coordenadorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
