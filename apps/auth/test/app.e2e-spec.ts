import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from './../src/auth.module';
import {ModelMockerFunction} from "@app/model/Mock/modelMockerFunction";
import {RedisService} from "../src/service/redis/redis.service";
import RedisMock from "../src/service/redis/redis.mock";

describe('AuthController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).useMocker(ModelMockerFunction).overrideProvider(RedisService).useValue(RedisMock).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('☢️Welcome to Auth microservice!! ☢');
  });
});
