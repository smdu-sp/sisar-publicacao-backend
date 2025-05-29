import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AppService } from "src/app.service";
import { SguService } from "src/prisma/sgu.service";
import { PublicacoesService } from "../publicacoes.service";
import { CreatePublicacaoDto } from "../dto/create-publicacao.dto";
import { UpdatePublicacaoDto } from "../dto/update-publicacao.dto";
import { UsuariosService } from "src/usuarios/usuarios.service";
import { CoordenadoriasService } from "src/coordenadorias/coordenadorias.service";
import { Tipo_Documento, Colegiado } from '_prisma/main/client';


describe('PublicaçõesService Test', () => {

    let service: PublicacoesService;
    let prisma: PrismaService;
    let app: AppService;
    let usuarios: UsuariosService;
    let sgu: SguService;
    let coordenadoria: CoordenadoriasService;

    //configuração de mocks 

    const mockPrismaService = {
        publicacao: {
            create: jest.fn(),
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            findMany: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
            count: jest.fn()
        },
        tecnicoPublicacao: {
            findUnique: jest.fn(),
            create: jest.fn()
        },
        coordenadoria: {
            findUnique: jest.fn(),
        },
    };

    const mockSguService = {
        tblUsuarios: {
            findFirst: jest.fn(),
        },
    };

    const MockAppService = {
        verificaPagina: jest
            .fn()
            .mockImplementation((pagina, limite) => [pagina, limite]),
        verificaLimite: jest
            .fn()
            .mockImplementation((pagina, limite, total) => [pagina, limite]),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PublicacoesService,
                {
                    provide: PrismaService,
                    useValue: mockPrismaService,
                },
                {
                    provide: SguService,
                    useValue: mockSguService,
                },
                {
                    provide: CoordenadoriasService,
                    useValue: mockPrismaService
                },
                {
                    provide: AppService,
                    useValue: MockAppService,
                },
                {
                    provide: UsuariosService,
                    useValue: mockPrismaService,
                }
            ],
        }).compile();
        service = module.get<PublicacoesService>(PublicacoesService);
        prisma = module.get<PrismaService>(PrismaService);
        app = module.get<AppService>(AppService);
        usuarios = module.get<UsuariosService>(UsuariosService);
        sgu = module.get<SguService>(SguService);
        coordenadoria = module.get<CoordenadoriasService>(CoordenadoriasService);
    });

    it('deverá verificar se os serviçoes foram definidos corretamente', async () => {
        expect(service).toBeDefined();
        expect(prisma).toBeDefined();
        expect(app).toBeDefined();
        expect(usuarios).toBeDefined();
    })

    it('deverá criar uma publicação nova com técnico não existente', async () => {

        const mockParams: CreatePublicacaoDto = {
            numero_processo: '20231234567',
            tipo_documento: 'COMUNIQUESE',
            tecnico_rf: '1234567',
            coordenadoria_id: 'coord-123-xyz',
            data_emissao: new Date('2023-12-01'),
            data_publicacao: new Date('2023-12-10'),
            prazo: 15,
        };

        const mockFuncionario = {
            cpID: 123456,
            cpRF: mockParams.tecnico_rf,
            cpNome: 'Tulla Luana Fontes dos Santos',
            cpVinculo: 'S',
            cpnomecargo2: 'Analista de Sistemas',
            cpRef: '123456',
            cpUnid: 'COGEAE',
            cpnomesetor2: 'Tecnologia da Informação',
            cpPermissao: 'ADM',
            cpImprimir: 'SIM',
            cpUltimaCarga: 'SIM',
            cpOBS: 'Funcionário mock para testes'
        };

        const mockTecnico = {
            rf: mockParams.tecnico_rf,
            nome: mockFuncionario.cpNome
        };

        const mockCoordenadoria = {
            id: mockParams.coordenadoria_id,
            sigla: 'COGEAE',
            nome: 'Coordenadoria de Gestão Educacional e Acompanhamento Escolar',
            codigo: 'CGEAE-2023',
            status: true,
            criadoEm: new Date('2023-01-01T10:00:00Z'),
            atualizadoEm: new Date('2023-01-01T10:00:00Z'),
        };

        const mockPublicacao = {
            id: '550e8400-e29b-41d4-a716-446655440000',
            numero_processo: '20103092025',
            tipo_documento: mockParams.tipo_documento,
            tecnico_rf: mockParams.tecnico_rf,
            coordenadoria_id: mockParams.coordenadoria_id,
            data_emissao: mockParams.data_emissao,
            data_publicacao: mockParams.data_publicacao,
            prazo: mockParams.prazo,
            colegiado: 'AR',
            criadoEm: new Date('2023-01-10T10:00:00Z'),
            atualizadoEm: new Date('2023-01-10T10:00:00Z')
        };

        (prisma.tecnicoPublicacao.findUnique as jest.Mock).mockResolvedValue(null);
        (mockSguService.tblUsuarios.findFirst as jest.Mock).mockResolvedValue(mockFuncionario);
        (prisma.tecnicoPublicacao.create as jest.Mock).mockResolvedValue(mockTecnico);
        (prisma.coordenadoria.findUnique as jest.Mock).mockResolvedValue(mockCoordenadoria);
        jest.spyOn(service, 'formataProcesso').mockReturnValue(mockPublicacao.numero_processo);
        (prisma.publicacao.create as jest.Mock).mockResolvedValue(mockPublicacao);

        const result = await service.criar(mockParams);

        expect(result).not.toBeNull();
        expect(result).toEqual(mockPublicacao);

        expect(prisma.tecnicoPublicacao.findUnique).toHaveBeenCalledWith({
            where: { rf: mockParams.tecnico_rf }
        });

        expect(sgu.tblUsuarios.findFirst).toHaveBeenCalledWith({
            where: { cpRF: mockParams.tecnico_rf }
        });

        expect(prisma.tecnicoPublicacao.create).toHaveBeenCalledWith({
            data: {
                rf: mockTecnico.rf,
                nome: mockTecnico.nome
            }
        });

        expect(prisma.coordenadoria.findUnique).toHaveBeenCalledWith({
            where: { id: mockParams.coordenadoria_id }
        });

        expect(service.formataProcesso).toHaveBeenCalledWith(mockParams.numero_processo);

        expect(prisma.publicacao.create).toHaveBeenCalledWith({
            data: {
                ...mockParams,
                numero_processo: mockPublicacao.numero_processo
            }
        });

    });

    it('deve retornar técnico existente', async () => {
        (prisma.tecnicoPublicacao.findUnique as jest.Mock).mockResolvedValue({ rf: '1', nome: 'João' });
        const result = await service.cadastrarTecnico('1');
        expect(result).not.toBe(null);
        expect(result).toEqual({ rf: '1', nome: 'João' });
    });

    it('deve retornar null se não encontrar no SGU', async () => {
        (prisma.tecnicoPublicacao.findUnique as jest.Mock).mockResolvedValue(null);
        (sgu.tblUsuarios.findFirst as jest.Mock).mockResolvedValue(null);
        const result = await service.cadastrarTecnico('1');
        expect(result).toBe(null);
    });

    it('deve lançar erro se id for vazio', async () => {
        await expect(service.buscarPorId('')).rejects.toThrow(BadRequestException);
    });

    it('deve retornar publicação se existir', async () => {
        (prisma.publicacao.findUnique as jest.Mock).mockResolvedValue({ id: '550e8400-e29b-41d4-a716-446655440000' });
        const result = await service.buscarPorId('550e8400-e29b-41d4-a716-446655440000');
        expect(result).not.toBe(null)
        expect(result).toEqual({ id: '550e8400-e29b-41d4-a716-446655440000' });
    });

    it('deve atualizar publicação', async () => {

        const mockTenico = {
            rf: '1234567',
            nome: 'Lusimar Agostinho da Silva',
        }

        const mockCoordenadoria = {
            id: 'coord-123-xyz',
            sigla: 'COGEAE',
            nome: 'Coordenadoria de Gestão Educacional e Acompanhamento Escolar',
            codigo: 'CGEAE-2023',
            status: true,
            criadoEm: new Date('2024-01-01T10:00:00.000Z'),
            atualizadoEm: new Date('2024-01-01T10:00:00.000Z'),
        }

        const mockPublicacao = {
            id: 'acbd18db-4cc2-4d0f-a3e0-91f0adf58c24',
            numero_processo: '20231234567',
            tipo_documento: Tipo_Documento.COMUNIQUESE,
            tecnico_rf: mockTenico.rf,
            coordenadoria_id: mockCoordenadoria.id,
            data_emissao: new Date('2024-05-01'),
            data_publicacao: new Date('2024-05-10'),
            prazo: 15,
            colegiado: Colegiado.AR,
            criadoEm: new Date('2024-05-01T08:00:00.000Z'),
            atualizadoEm: new Date('2024-05-01T08:00:00.000Z'),
        };

        const updateParams = {
            tipo_documento: Tipo_Documento.DEFERIMENTO,
        }

        const mockUpdatePublicacao = {
            id: 'acbd18db-4cc2-4d0f-a3e0-91f0adf58c24',
            numero_processo: '20231234567',
            tipo_documento: Tipo_Documento.DEFERIMENTO,
            tecnico_rf: mockTenico.rf,
            coordenadoria_id: mockCoordenadoria.id,
            data_emissao: new Date('2024-05-01'),
            data_publicacao: new Date('2024-05-10'),
            prazo: 15,
            colegiado: Colegiado.AR,
            criadoEm: new Date('2024-05-01T08:00:00.000Z'),
            atualizadoEm: new Date('2024-05-01T08:00:00.000Z'),
        };

        jest.spyOn(service, 'buscarPorId').mockResolvedValue(mockPublicacao);
        (prisma.publicacao.update as jest.Mock).mockResolvedValue(mockUpdatePublicacao);

        const result = await service.atualizar(mockPublicacao.id, updateParams);

        expect(result).not.toBe(null);
        expect(result).toEqual(mockUpdatePublicacao);
        expect(prisma.publicacao.findUnique).toHaveBeenCalledWith({
            where: {
                id: expect.any(String)
            }
        });
        expect(prisma.publicacao.update).toHaveBeenCalledWith({
            where: {
                id: expect.any(String)
            },
            data: updateParams
        });
    });

    it('deve retornar resultado vazio se nenhum encontrado', async () => {
        (prisma.publicacao.count as jest.Mock).mockResolvedValue(0);
        const result = await service.buscarTudo();
        expect(result).toEqual({ total: 0, pagina: 0, limite: 0, data: [] });
    });

    it('deve retornar publicações com paginação', async () => {
        (prisma.publicacao.count as jest.Mock).mockResolvedValue(2);
        (prisma.publicacao.findMany as jest.Mock).mockResolvedValue([{ id: '1' }, { id: '2' }]);
        const result = await service.buscarTudo();
        expect(result.data.length).toBe(2);
    });
})