import { Global, Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '_prisma/main/client';

@Global()
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  async onModuleInit() {
    await this.$connect();
  }
}