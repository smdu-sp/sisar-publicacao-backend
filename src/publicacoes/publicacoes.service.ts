import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreatePublicacaoDto } from './dto/create-publicacao.dto';
import { UpdatePublicacaoDto } from './dto/update-publicacao.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppService } from 'src/app.service';
import { Publicacao, Usuario } from '_prisma/main/client';
import { SguService } from 'src/prisma/sgu.service';
import { UsuariosService } from 'src/usuarios/usuarios.service';

@Injectable()
export class PublicacoesService {
  constructor(
    private prisma: PrismaService,
    private sgu: SguService,
    private usuario: UsuariosService,
    private app: AppService,
  ) {}
  
  async criar(createPublicacaoDto: CreatePublicacaoDto) {
    const { tecnico_rf, coordenadoria_id } = createPublicacaoDto;
    if (!tecnico_rf || tecnico_rf == '') throw new BadRequestException('Tecnico não informado.');
    if (!coordenadoria_id || coordenadoria_id == '') throw new BadRequestException('Coordenadoria não informado.');
    const tecnico = await this.cadastrarTecnico(tecnico_rf);
    if (!tecnico) throw new BadRequestException('Tecnico não cadastrado.');
    const coordenadoria = await this.prisma.coordenadoria.findUnique({ where: { id: coordenadoria_id } });
    if (!coordenadoria) throw new BadRequestException('Coordenadoria não encontrada.');
    delete createPublicacaoDto.tecnico_rf;
    const publicacao: Publicacao = await this.prisma.publicacao.create({
      data: {
        ...createPublicacaoDto,
        tecnico_id: tecnico.id,
      },
    });
    if (!publicacao) throw new InternalServerErrorException('Publicação nao criada.');
    return publicacao;
  }

  async cadastrarTecnico(rf: string): Promise<Usuario> {
    console.log(rf);
    let tecnico = await this.prisma.usuario.findUnique({ where: { rf }});
    if (tecnico) return tecnico;
    const funcionario = await this.sgu.tblUsuarios.findFirst({ where: { cpRF: rf }});
    if (!funcionario) return null;
    let novoUsuario = await this.usuario.buscarPorRf(rf);
    if (!novoUsuario || novoUsuario.login == '' || novoUsuario.login == null) novoUsuario = await this.usuario.buscarPorNome(funcionario.cpNome);
    if (!novoUsuario || novoUsuario.login == '' || novoUsuario.login == null) return null;
    tecnico = await this.prisma.usuario.create({ data: { ...novoUsuario, rf, permissao: 'TEC' }});
    return tecnico;
  }

  async buscarTudo(
    pagina: number = 1,
    limite: number = 10,
    busca?: string,
  ) {
    [pagina, limite] = this.app.verificaPagina(pagina, limite);
    const searchParams = {
      ...(busca && { OR: [
        { numero_processo: { contains: busca }},
      ]}),
    };
    const total: number = await this.prisma.publicacao.count({ where: searchParams });
    if (total == 0) return { total: 0, pagina: 0, limite: 0, data: [] };
    [pagina, limite] = this.app.verificaLimite(pagina, limite, total);
    const publicacoes: Publicacao[] = await this.prisma.publicacao.findMany({
      where: searchParams,
      include: { tecnico: true, coordenadoria: true },
      orderBy: { data_publicacao: 'desc' },
      skip: (pagina - 1) * limite,
      take: limite,
    });
    return {
      total: +total,
      pagina: +pagina,
      limite: +limite,
      data: publicacoes,
    };
  }

  async buscarPorId(id: string) {
    if (!id || id == '') throw new BadRequestException('ID vazio.');
    const publicacao: Publicacao = await this.prisma.publicacao.findUnique({ where: { id } });
    if (!publicacao) throw new BadRequestException('Publicação não encontrada.');
    return publicacao;
  }

  async atualizar(id: string, updatePublicacaoDto: UpdatePublicacaoDto) {
    await this.buscarPorId(id);
    const publicacao: Publicacao = await this.prisma.publicacao.update({ where: { id }, data: updatePublicacaoDto });
    if (!publicacao) throw new InternalServerErrorException('Publicação não atualizada.');
    return publicacao;
  }
}
