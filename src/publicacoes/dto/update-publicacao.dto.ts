import { PartialType } from '@nestjs/swagger';
import { CreatePublicacaoDto } from './create-publicacao.dto';

export class UpdatePublicacaoDto extends PartialType(CreatePublicacaoDto) {}
