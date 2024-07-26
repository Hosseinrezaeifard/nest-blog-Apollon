import { ConfigModule, ConfigService } from '@nestjs/config';
import { Client } from 'pg';

ConfigModule.forRoot({
  isGlobal: true,
  envFilePath: `.env.${process.env.NODE_ENV}`,
});

async function deleteDb() {
  const config = new ConfigService();

  const client = new Client({
    host: config.get<string>('TYPEORM_HOST'),
    port: config.get<number>('TYPEORM_PORT'),
    password: config.get<string>('TYPEORM_PASS'),
    user: config.get<string>('TYPEORM_USER'),
  });

  try {
    await client.connect();
    await client.query(
      `DROP DATABASE IF EXISTS "${config.get<string>('TYPEORM_DB')}"`,
    );
    console.log(
      `Database ${config.get<string>('TYPEORM_DB')} has been deleted successfully`,
    );
    await client.query(`CREATE DATABASE "${config.get<string>('TYPEORM_DB')}"`);
    console.log(
      `Database ${config.get<string>('TYPEORM_DB')} has been created successfully`,
    );
  } catch (error) {
    console.error(error);
  } finally {
    await client.end();
  }
}

beforeAll(async () => {
  console.log('deleting db');
  await deleteDb();
});
