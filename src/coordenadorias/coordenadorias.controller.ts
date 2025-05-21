import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CoordenadoriasService } from './coordenadorias.service';
import { CreateCoordenadoriaDto } from './dto/create-coordenadoria.dto';
import { UpdateCoordenadoriaDto } from './dto/update-coordenadoria.dto';

@Controller('coordenadorias')
export class CoordenadoriasController {
  constructor(private readonly coordenadoriasService: CoordenadoriasService) {}

  @Post('criar')
  criar(@Body() createCoordenadoriaDto: CreateCoordenadoriaDto) {
    return this.coordenadoriasService.criar(createCoordenadoriaDto);
  }

  @Get('buscar-tudo')
  buscarTudo(
    @Query('pagina') pagina?: string,
    @Query('limite') limite?: string,
    @Query('busca') busca?: string
  ) {
    return this.coordenadoriasService.buscarTudo(+pagina, +limite, busca);
  }

  @Get('lista-completa')
  listaCompleta(): Promise<{ value: string, label: string }[]> {
    return this.coordenadoriasService.listaCompleta();
  }

  @Get('buscar-por-id/:id')
  buscarPorId(@Param('id') id: string) {
    return this.coordenadoriasService.buscarPorId(id);
  }

  @Patch('atualizar/:id')
  atualizar(@Param('id') id: string, @Body() updateCoordenadoriaDto: UpdateCoordenadoriaDto) {
    return this.coordenadoriasService.atualizar(id, updateCoordenadoriaDto);
  }

  @Delete('desativar/:id')
  desativar(@Param('id') id: string) {
    return this.coordenadoriasService.desativar(id);
  }
}
