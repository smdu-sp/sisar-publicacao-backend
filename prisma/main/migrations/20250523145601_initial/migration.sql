-- CreateTable
CREATE TABLE `usuarios` (
    `id` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,
    `nomeSocial` VARCHAR(191) NULL,
    `login` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `permissao` ENUM('DEV', 'ADM', 'TEC', 'USR') NOT NULL DEFAULT 'USR',
    `status` BOOLEAN NOT NULL DEFAULT true,
    `avatar` TEXT NULL,
    `ultimoLogin` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `usuarios_login_key`(`login`),
    UNIQUE INDEX `usuarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tecnicos` (
    `rf` VARCHAR(191) NOT NULL,
    `nome` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `tecnicos_rf_key`(`rf`),
    PRIMARY KEY (`rf`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `publicacoes` (
    `id` VARCHAR(191) NOT NULL,
    `numero_processo` VARCHAR(191) NOT NULL,
    `tipo_documento` ENUM('COMUNIQUESE', 'INDEFERIMENTO', 'DEFERIMENTO') NOT NULL,
    `tecnico_rf` VARCHAR(191) NOT NULL,
    `coordenadoria_id` VARCHAR(191) NOT NULL,
    `data_emissao` DATE NOT NULL,
    `data_publicacao` DATE NOT NULL,
    `prazo` INTEGER NOT NULL DEFAULT 30,
    `colegiado` ENUM('AR', 'RR', 'CEUSO', 'CAIEPS', 'CAEHIS', 'CPPU', 'CTLU') NOT NULL DEFAULT 'AR',
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `coordenadorias` (
    `id` VARCHAR(191) NOT NULL,
    `sigla` VARCHAR(191) NULL,
    `nome` VARCHAR(191) NOT NULL,
    `codigo` VARCHAR(191) NOT NULL,
    `status` BOOLEAN NOT NULL DEFAULT true,
    `criadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `atualizadoEm` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `coordenadorias_sigla_key`(`sigla`),
    UNIQUE INDEX `coordenadorias_codigo_key`(`codigo`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `publicacoes` ADD CONSTRAINT `publicacoes_tecnico_rf_fkey` FOREIGN KEY (`tecnico_rf`) REFERENCES `tecnicos`(`rf`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `publicacoes` ADD CONSTRAINT `publicacoes_coordenadoria_id_fkey` FOREIGN KEY (`coordenadoria_id`) REFERENCES `coordenadorias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
