/*
  Warnings:

  - Added the required column `nome` to the `coordenadorias` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `coordenadorias` ADD COLUMN `nome` VARCHAR(191) NOT NULL,
    MODIFY `sigla` VARCHAR(191) NULL;
