import { PrismaClient } from '_prisma/main/client';

const prisma = new PrismaClient();

async function main() {
  const usuario = await prisma.usuario.upsert({
    where: { login: 'x414090' },
    update: {
      nome: 'Fernando Lacerda',
      email: 'fanjoslacerda@prefeitura.sp.gov.br',
      permissao: 'DEV',
      status: true,
    },
    create: {
      nome: 'Fernando Lacerda',
      login: 'x414090',
      email: 'fanjoslacerda@prefeitura.sp.gov.br',
      permissao: 'DEV',
      status: true,
    }
  });

  console.log(usuario);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
