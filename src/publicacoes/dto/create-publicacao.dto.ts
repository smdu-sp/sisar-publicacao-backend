import { Tipo_Documento } from 'node_modules/_prisma/main/client';

export class CreatePublicacaoDto {
    numero_processo: string;
    tipo_documento: Tipo_Documento;
    tecnico_rf: string;
    coordenadoria_id: string;
    data_emissao: Date;
    data_publicacao: Date;
    prazo?: number;
}
