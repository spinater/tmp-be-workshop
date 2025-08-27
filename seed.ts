import { DataSource } from 'typeorm';
import { User } from './src/users/user.entity';
import { config } from 'dotenv';

config();

async function run() {
  const ds = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    database: process.env.DB_NAME || 'tmpdb',
    entities: [User],
    synchronize: true,
  });

  await ds.initialize();
  const repo = ds.getRepository(User);

  const existing = await repo.findOne({ where: { email: 'admin@example.com' } });
  if (!existing) {
    const user = repo.create({
      email: 'admin@example.com',
      password: 'changeme',
      firstname: 'Admin',
      lastname: 'User',
      points: 1000,
    } as any);
    await repo.save(user);
    console.log('Seeded admin user');
  } else {
    console.log('Admin exists');
  }

  await ds.destroy();
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
