/*
  Warnings:

  - You are about to drop the column `atualizadoEm` on the `coordenadorias` table. All the data in the column will be lost.
  - You are about to drop the column `criadoEm` on the `coordenadorias` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[rf]` on the table `usuarios` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `coordenadorias` DROP COLUMN `atualizadoEm`,
    DROP COLUMN `criadoEm`;

-- AlterTable
ALTER TABLE `usuarios` ADD COLUMN `rf` VARCHAR(191) NULL;

-- CreateIndex
CREATE UNIQUE INDEX `usuarios_rf_key` ON `usuarios`(`rf`);
