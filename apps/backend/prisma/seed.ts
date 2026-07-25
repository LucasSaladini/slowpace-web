import { TransactionType } from "@prisma/client";
import { faker } from "@faker-js/faker";
import * as dotenv from "dotenv";
import { prisma } from "../src/db/database";

dotenv.config();

async function main() {
    const existingUserCount = await prisma.user.count();

    if (existingUserCount > 0) {
        console.log('⚡ O banco de dados já possui dados cadastrados. O seed foi ignorado para preservar seus registros.');
        return;
    }

    console.log('🌱 Limpando o banco de dados antes de iniciar o seed....');

    await prisma.transaction.deleteMany();
    await prisma.session.deleteMany();
    await prisma.focusTask.deleteMany();
    await prisma.hobby.deleteMany();
    await prisma.user.deleteMany();

    console.log('⚡ Gerando massa de dados....');

    const users = [];
    for (let i = 0; i < 50; i++) {
        const user = await prisma.user.create({
            data: {
                email: i === 0 ? 'dev@slowpace.com' : faker.internet.email(),
                password: i === 0 ? '$2b$12$K8M9XWv6f78YvHz6b5K8OuY3H1Z2a3b4c5d6e7f8g9h0i1j2k3l4m' : faker.internet.password({ length: 20 }),
                hasSeenTour: i === 0 ? true : false,
                createdAt: faker.date.past({ years: 1 })
            }
        });
        users.push(user);
    }

    for (const user of users) {
        console.log(`\t-> Gerando dados para o usuário: ${user.email}`);

        const hobbyCategories = ['Leitura', 'Corrida', 'Meditação', 'Estudo de Idiomas', 'Desenvolvimento', 'Culinária', 'Desenho'];
        const hobbies = [];

        for (let h = 0; h < 5; h++) {
            const hobby = await prisma.hobby.create({
                data: {
                    userId: user.id,
                    name: hobbyCategories[h % hobbyCategories.length],
                    color: faker.color.rgb({ format: 'hex', casing: 'lower' }),
                    frequency: faker.helpers.arrayElement(['daily', 'weekly', '3x_week']),
                    createdAt: faker.date.past({ years: 1, refDate: user.createdAt })
                }
            });
            hobbies.push(hobby);
        }

        for (let s = 0; s < 100; s++) {
            const randomHobby = faker.helpers.arrayElement(hobbies);
            await prisma.session.create({
                data: {
                    hobbyId: randomHobby.id,
                    duration: faker.number.int({ min: 15, max: 120 }),
                    content: faker.helpers.arrayElement([
                        'Foco total sem distrações',
                        'Sessão profunda de estudo',
                        'Prática matinal consistente',
                        'Leitura de capítulos técnicos',
                        null
                    ]),
                    createdAt: faker.date.between({ from: randomHobby.createdAt, to: new Date() })
                }
            });
        }

        for (let t = 0; t < 50; t++) {
            const type = faker.helpers.arrayElement([TransactionType.INCOME, TransactionType.EXPENSE]);
            await prisma.transaction.create({
                data: {
                    userId: user.id,
                    description: type === TransactionType.INCOME
                        ? faker.helpers.arrayElement(['Salário PJ', 'Freelance UI', 'Rendimento Investimento'])
                        : faker.helpers.arrayElement(['Supermercado', 'Assinatura Cloud', 'Cafeteria', 'Aluguel']),
                    amount: faker.number.int({ min: 1500, max: 150000 }),
                    type,
                    category: type === TransactionType.INCOME ? 'Receitas' : faker.helpers.arrayElement(['Alimentação', 'Serviços', 'Lazer']),
                    createdAt: faker.date.past({ years: 1 })
                }
            });
        }

        for (let f = 0; f < 10; f++) {
            await prisma.focusTask.create({
                data: {
                    userId: user.id,
                    title: faker.helpers.arrayElement([
                        'Refatorar camada de repository',
                        'Revisar PR de infraestrutura',
                        'Configurar CI/CD pipeline',
                        'Mapear índices no Prisma',
                        'Alinhamento com stakeholder',
                        'Estudar conceitos de concorrência'
                    ]),
                    isCompleted: f < 3,
                    isBacklog: f >= 5,
                    createdAt: faker.date.recent({ days: 2 })
                }
            });
        }
    }

    console.log('✨ Banco de dados populado com sucesso para simulações!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });