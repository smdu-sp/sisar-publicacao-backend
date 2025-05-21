import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { PublicacoesService } from './publicacoes.service';
import { CreatePublicacaoDto } from './dto/create-publicacao.dto';
import { UpdatePublicacaoDto } from './dto/update-publicacao.dto';

@Controller('publicacoes')
export class PublicacoesController {
  constructor(private readonly publicacoesService: PublicacoesService) {}

  @Post('criar')
  criar(@Body() createPublicacaoDto: CreatePublicacaoDto) {
    return this.publicacoesService.criar(createPublicacaoDto);
  }

  @Get('buscar-tudo')
  buscarTudo(
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
    @Query('busca') busca?: string,
  ) {
    return this.publicacoesService.buscarTudo(+pagina, +limite, busca);
  }

  @Get('buscar-por-id/:id')
  buscarPorId(@Param('id') id: string) {
    return this.publicacoesService.buscarPorId(id);
  }

  @Get('buscar-por-processo/:processo')
  buscarPorProcesso(@Param('processo') processo: string) {
    return this.publicacoesService.buscarPorId(processo);
  }

  @Patch('atualizar/:id')
  atualizar(@Param('id') id: string, @Body() updatePublicacaoDto: UpdatePublicacaoDto) {
    return this.publicacoesService.atualizar(id, updatePublicacaoDto);
  }
}
