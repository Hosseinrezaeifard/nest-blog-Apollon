import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Authentication System', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('signup as a new user & get the currently logged in user and then signout the user', async () => {
    const email = 'test@test.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email, password: 'test' })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
    await request(app.getHttpServer())
      .post('/auth/signout')
      .set('Cookie', cookie)
      .expect(201);
  });

  it('signin created user & get the currently logged in user and then signout the user', async () => {
    const email = 'test@test.com';

    const res = await request(app.getHttpServer())
      .post('/auth/signin')
      .send({ email, password: 'test' })
      .expect(201);

    const cookie = res.get('Set-Cookie');

    const { body } = await request(app.getHttpServer())
      .get('/auth/whoami')
      .set('Cookie', cookie)
      .expect(200);

    expect(body.email).toEqual(email);
    await request(app.getHttpServer())
      .post('/auth/signout')
      .set('Cookie', cookie)
      .expect(201);
  });
});
