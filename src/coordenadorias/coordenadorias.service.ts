import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateCoordenadoriaDto } from './dto/create-coordenadoria.dto';
import { UpdateCoordenadoriaDto } from './dto/update-coordenadoria.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppService } from 'src/app.service';
import { Coordenadoria } from '_prisma/main/client';

@Injectable()
export class CoordenadoriasService {
  constructor(
    private prisma: PrismaService,
    private app: AppService
  ) {}
  
  async criar(createCoordenadoriaDto: CreateCoordenadoriaDto) {
    return 'This action adds a new coordenadoria';
  }

  async listaCompleta(): Promise<{ value: string, label: string }[]> {
    const coordenadorias: Partial<Coordenadoria>[] = await this.prisma.coordenadoria.findMany({
      orderBy: { sigla: 'asc' },
      select: { id: true, sigla: true, nome: true },
    });
    if (!coordenadorias) throw new InternalServerErrorException('Coordenadorias nao encontradas.');
    const resposta = coordenadorias.map(coordenadoria => {
      return {
        value: coordenadoria.id,
        label: `${coordenadoria.sigla} - ${coordenadoria.nome}`
      }
    })
    return resposta;
  }

  async buscarTudo(pagina: number = 1, limite: number = 10, busca?: string) {
    [pagina, limite] = this.app.verificaPagina(pagina, limite);
    const searchParams = {
      ...(busca && { OR: [
        { nome: { contains: busca }},
        { sigla: { contains: busca }},
      ]}),
    };
    const total: number = await this.prisma.coordenadoria.count({ where: searchParams });
    if (total == 0) return { total: 0, pagina: 0, limite: 0, data: [] };
    [pagina, limite] = this.app.verificaLimite(pagina, limite, total);
    const coordenadorias: Coordenadoria[] = await this.prisma.coordenadoria.findMany({
      where: searchParams,
      skip: (pagina - 1) * limite,
      take: limite,
    });
    return {
      total: +total,
      pagina: +pagina,
      limite: +limite,
      data: coordenadorias,
    };
  }

  async buscarPorId(id: string) {
    if (!id || id == '') throw new BadRequestException('ID vazio.');
    const coordenadoria: Coordenadoria = await this.prisma.coordenadoria.findUnique({ where: { id } });
    if (!coordenadoria) throw new InternalServerErrorException('Coordenadoria não encontrada.');
    return coordenadoria;
  }

  async atualizar(id: string, updateCoordenadoriaDto: UpdateCoordenadoriaDto) {
    await this.buscarPorId(id);
    const { sigla, codigo } = updateCoordenadoriaDto;
    if (sigla) {
      const coordSigla = await this.buscarPorSigla(sigla);
      if (coordSigla && coordSigla.id != id) throw new BadRequestException('Sigla já cadastrada.');
    }
    if (codigo) {
      const coordCodigo = await this.buscarPorCodigo(codigo);
      if (coordCodigo && coordCodigo.id != id) throw new BadRequestException('Código já cadastrado.');
    }
    const coordenadoria: Coordenadoria = await this.prisma.coordenadoria.update({ where: { id }, data: updateCoordenadoriaDto });
    if (!coordenadoria) throw new InternalServerErrorException('Coordenadoria nao atualizada.');
    return coordenadoria;
  }

  async buscarPorSigla(sigla: string) {
    if (!sigla || sigla == '') throw new BadRequestException('Sigla vazia.');
    const coordenadoria: Coordenadoria = await this.prisma.coordenadoria.findUnique({ where: { sigla } });
    return coordenadoria;
  }

  async buscarPorCodigo(codigo: string) {
    if (!codigo || codigo == '') throw new BadRequestException('Código vazio.');
    const coordenadoria: Coordenadoria = await this.prisma.coordenadoria.findUnique({ where: { codigo } });
    return coordenadoria;
  }

  async desativar(id: string) {
    await this.buscarPorId(id);
    const desativado = await this.prisma.coordenadoria.update({ where: { id }, data: { status: false } });
    if (!desativado) throw new InternalServerErrorException('Coordenadoria nao desativada.');
    return { desativado: true };
  }
}
