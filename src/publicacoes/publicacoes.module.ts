import { Module } from '@nestjs/common';
import { PublicacoesService } from './publicacoes.service';
import { PublicacoesController } from './publicacoes.controller';

@Module({
  controllers: [PublicacoesController],
  providers: [PublicacoesService],
})
export class PublicacoesModule {}
