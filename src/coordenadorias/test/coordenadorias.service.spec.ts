import { CoordenadoriasService } from '../coordenadorias.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppService } from 'src/app.service';
import { Test, TestingModule } from '@nestjs/testing';
import exp from 'constants';

describe('Coordenadorias Service Test', () => {
  let service: CoordenadoriasService;
  let prisma: PrismaService;
  let app: AppService;

  const mockPrismaService = {
    coordenadoria: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  };

  const mockAppService = {
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
        CoordenadoriasService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    service = module.get<CoordenadoriasService>(CoordenadoriasService);
    prisma = module.get<PrismaService>(PrismaService);
    app = module.get<AppService>(AppService);
  });

  it('verificar se os serviços estão definidos', async () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
    expect(app).toBeDefined();
  });

  // deverá retornar lista completa
  it('deverá listar todas as coordenadorias no formato correto', async () => {
    const mockPrismaResponse = [
      {
        id: '1a2b3c4d-0000-0000-0000-000000000001',
        sigla: 'COGEP',
        nome: 'Coordenadoria de Gestão de Pessoas',
        codigo: '00000001111',
      },
      {
        id: '1a2b3c4d-0000-0000-0000-000000000002',
        sigla: 'COINF',
        nome: 'Coordenadoria de Informações',
        codigo: '00000001111',
      },
      {
        id: '1a2b3c4d-0000-0000-0000-000000000003',
        sigla: 'COADM',
        nome: 'Coordenadoria Administrativa',
        codigo: '00000001111',
      },
    ];

    const expectedResult = [
      {
        value: '1a2b3c4d-0000-0000-0000-000000000001',
        label: 'COGEP - Coordenadoria de Gestão de Pessoas',
      },
      {
        value: '1a2b3c4d-0000-0000-0000-000000000002',
        label: 'COINF - Coordenadoria de Informações',
      },
      {
        value: '1a2b3c4d-0000-0000-0000-000000000003',
        label: 'COADM - Coordenadoria Administrativa',
      },
    ];

    (prisma.coordenadoria.findMany as jest.Mock).mockResolvedValue(
      mockPrismaResponse,
    );

    const result = await service.listaCompleta();

    expect(prisma.coordenadoria.findMany).toHaveBeenCalledWith({
      orderBy: { sigla: 'asc' },
      select: { id: true, sigla: true, nome: true },
    });
    expect(result).toEqual(expectedResult);
  });

  // deverá buscar tudo

  it('deverá buscar todas as coordenadorias', async () => {
    const mockPrismaResponse = [
      {
        id: '1a2b3c4d-0000-0000-0000-000000000001',
        sigla: 'COGEP',
        nome: 'Coordenadoria de Gestão de Pessoas',
      },
      {
        id: '1a2b3c4d-0000-0000-0000-000000000002',
        sigla: 'COINF',
        nome: 'Coordenadoria de Informações',
      },
      {
        id: '1a2b3c4d-0000-0000-0000-000000000003',
        sigla: 'COADM',
        nome: 'Coordenadoria Administrativa',
      },
    ];

    const expectedTransformedResult = [
      {
        value: '1a2b3c4d-0000-0000-0000-000000000001',
        label: 'COGEP - Coordenadoria de Gestão de Pessoas',
      },
      {
        value: '1a2b3c4d-0000-0000-0000-000000000002',
        label: 'COINF - Coordenadoria de Informações',
      },
      {
        value: '1a2b3c4d-0000-0000-0000-000000000003',
        label: 'COADM - Coordenadoria Administrativa',
      },
    ];

    const mockPaginacao = {
      total: 3,
      pagina: 1,
      limite: 10,
      data: mockPrismaResponse,
    };

    const mockParams = {
      pagina: 1,
      limite: 10,
      busca: 'Coordenadoria',
    };

    (prisma.coordenadoria.count as jest.Mock).mockResolvedValue(3);
    jest.spyOn(app, 'verificaLimite').mockReturnValue([1, 10]);
    (prisma.coordenadoria.findMany as jest.Mock).mockResolvedValue(
      mockPrismaResponse,
    );

    const result = await service.buscarTudo(
      mockParams.pagina,
      mockParams.limite,
      mockParams.busca,
    );

    expect(result).not.toBeNull();
    expect(result).toEqual(mockPaginacao);

    expect(prisma.coordenadoria.count).toHaveBeenCalledWith({
      where: {
        OR: [
          { nome: { contains: mockParams.busca } },
          { sigla: { contains: mockParams.busca } },
        ],
      },
    });
  });

  //deverá buscar uma coordenadoria pelo id

  it('deverá buscar uma coordenadoria pelo id', async () => {

    const mockCoordenadoria = {
      id: '1a2b3c4d-0000-0000-0000-000000000001',
      sigla: 'COGEP',
      nome: 'Coordenadoria de Gestão de Pessoas',
      codigo: '00000001111',
    };

    (prisma.coordenadoria.findUnique as jest.Mock).mockResolvedValue(mockCoordenadoria);

    const result = await service.buscarPorId('1a2b3c4d-0000-0000-0000-000000000001')

    expect(result).toEqual(mockCoordenadoria);
    expect(prisma.coordenadoria.findUnique).toHaveBeenCalledWith({
      where: {
        id: expect.any(String),
      },
    });
  })

  //deverá buscar uma coordenadoria pela sigla

  it('deverá buscar uma coordenadoria pela sigla', async () => {
    const mockCoordenadoria = {
      id: '1a2b3c4d-0000-0000-0000-000000000001',
      sigla: 'COGEP',
      nome: 'Coordenadoria de Gestão de Pessoas',
      codigo: '00000001111',
    };

    (prisma.coordenadoria.findUnique as jest.Mock).mockResolvedValue(mockCoordenadoria);

    const result = await service.buscarPorSigla(mockCoordenadoria.sigla)

    expect(result).not.toBe(null)
    expect(result).toEqual(mockCoordenadoria)
    expect(prisma.coordenadoria.findUnique).toHaveBeenCalledWith({
      where: {
        sigla: expect.any(String)
      },
    });
  })

  //deverá buscar uma coordenadoria pelo código

  it('deverá buscar uma coordenadoria pelo código', async () => {
    const mockCoordenadoria = {
      id: '1a2b3c4d-0000-0000-0000-000000000001',
      sigla: 'COGEP',
      nome: 'Coordenadoria de Gestão de Pessoas',
      codigo: '00000001111',
    };

    (prisma.coordenadoria.findUnique as jest.Mock).mockResolvedValue(mockCoordenadoria);

    const result = await service.buscarPorCodigo(mockCoordenadoria.codigo)

    expect(result).not.toBe(null);
    expect(result).toEqual(mockCoordenadoria)
    expect(prisma.coordenadoria.findUnique).toHaveBeenCalledWith({
      where: {
        codigo: expect.any(String)
      }
    });
  })

  //deverá atualizar uma coordenadoria

  it('deverá atualizar uma coordenadoria', async () => {
    const mockCoordenadoria = {
      id: '1a2b3c4d-0000-0000-0000-000000000001',
      sigla: 'COGEP',
      nome: 'Coordenadoria de Gestão de Pessoas',
      codigo: '00000001111',
      status: true,
      criadoEm: new Date('2025-05-27T14:30:00.000-03:00'),
      atualizadoEm: new Date('2025-05-27T14:30:00.000-03:00')
    };

    const mockUpdateCoordenadoria = {
      ...mockCoordenadoria,
      nome: 'Coordenadoria de Gerenciamento de Pessoas',
      atualizadoEm: new Date()
    };

    const updateParam = {
      nome: 'Coordenadoria de Gerenciamento de Pessoas',
    };

    jest.spyOn(service, 'buscarPorId').mockResolvedValue(mockCoordenadoria);
    jest.spyOn(service, 'buscarPorSigla').mockResolvedValue(null);
    jest.spyOn(service, 'buscarPorCodigo').mockResolvedValue(null);
    (prisma.coordenadoria.update as jest.Mock).mockResolvedValue(mockUpdateCoordenadoria);

    const result = await service.atualizar(
      mockCoordenadoria.id,
      updateParam
    );

    expect(result).not.toBeNull();
    expect(result).toEqual(mockUpdateCoordenadoria);

    expect(service.buscarPorId).toHaveBeenCalledWith(mockCoordenadoria.id);
    expect(prisma.coordenadoria.update).toHaveBeenCalledWith({
      where: { id: mockCoordenadoria.id },
      data: updateParam
    });
  });

  //deverá desativar uma coordenadoria

  it('deverá desativar uma coordenadoria', async () => {
    const mockCoordenadoria = {
      id: '1a2b3c4d-0000-0000-0000-000000000001',
      sigla: 'COGEP',
      nome: 'Coordenadoria de Gestão de Pessoas',
      codigo: '00000001111',
      status: true,
    };

    const mockDesativado = {
      ...mockCoordenadoria,
      status: false,
    };

    (prisma.coordenadoria.findUnique as jest.Mock).mockResolvedValue(mockCoordenadoria);
    (prisma.coordenadoria.update as jest.Mock).mockResolvedValue(mockDesativado);

    const result = await service.desativar(mockCoordenadoria.id);

    expect(result).not.toBeNull();
    expect(result).toEqual({ desativado: true });

    expect(prisma.coordenadoria.findUnique).toHaveBeenCalledWith({
      where: { id: mockCoordenadoria.id },
    });

    expect(prisma.coordenadoria.update).toHaveBeenCalledWith({
      where: { id: mockCoordenadoria.id },
      data: { status: false },
    });
  });


});
