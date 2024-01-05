import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { E2EUtils } from './utils/e2e.utils';
import { CreateEbookDto } from '../src/ebooks/dto/create-ebook.dto';
import { Ebook } from '@prisma/client';
import { EbookFactory } from './factories/ebook.factory';
import { faker } from '@faker-js/faker';
import { UpdateEbookDto } from '../src/ebooks/dto/update-ebook.dto';

describe('Ebooks (e2e) Tests', () => {
  let app: INestApplication;
  let prisma: PrismaService = new PrismaService();

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(PrismaService)
    .useValue(prisma)
    .compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());

    await app.init();

    await E2EUtils.cleanDb(prisma);
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it("POST /ebooks => should create an ebook", async () => {
    const ebookDto: CreateEbookDto = new CreateEbookDto({
      title: faker.lorem.words(3), 
      author: faker.person.fullName(), 
      description: faker.lorem.paragraph(), 
      pdf: `${faker.system.commonFileName()}.pdf`, 
    });

    const loginData = {
      username: process.env.ADMIN_USER,
      password: process.env.PASSWORD,
    };

    const response = await request(app.getHttpServer())
      .post("/auth/sign-in")
      .send(loginData)
      .expect(HttpStatus.OK);
    const token = response.body.token;


    await request(app.getHttpServer())
        .post("/ebooks")
        .send(ebookDto)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.CREATED)
    
    const ebooks = await prisma.ebook.findMany();
    expect(ebooks).toHaveLength(1);
    const ebook = ebooks[0];
    expect(ebook).toEqual<Ebook>({
        id: expect.any(Number),
        title: ebookDto.title,
        description: ebookDto.description,
        author: ebookDto.author,
        pdf: ebookDto.pdf
    })
  })

  it("POST /ebooks => should not create an ebook with information that already exists", async () => {
    await new EbookFactory(prisma)
        .withTitle(faker.lorem.word(3))
        .withDescription(faker.lorem.paragraph())
        .withAuthor(faker.person.fullName())
        .withPDF(`${faker.system.commonFileName()}.pdf`)
        .persist;

    const ebookDto: CreateEbookDto = new CreateEbookDto({
      title: faker.lorem.words(3), 
      author: faker.person.fullName(), 
      description: faker.lorem.paragraph(), 
      pdf: `${faker.system.commonFileName()}.pdf`, 
    });

    const loginData = {
      username: process.env.ADMIN_USER,
      password: process.env.PASSWORD,
    };

    const response = await request(app.getHttpServer())
      .post("/auth/sign-in")
      .send(loginData)
      .expect(HttpStatus.OK);
    const token = response.body.token;
    
    await request(app.getHttpServer())
        .post('/ebooks')
        .send(ebookDto)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.CREATED)

    await request(app.getHttpServer())
    .post('/ebooks')
    .send(ebookDto)
    .set('Authorization', `Bearer ${token}`)
    .expect(HttpStatus.CONFLICT)
  })

  it("POST /ebooks => should not create an ebook with properties missing", async () => {
    const ebookDto = new CreateEbookDto();

    const loginData = {
      username: process.env.ADMIN_USER,
      password: process.env.PASSWORD,
    };

    const response = await request(app.getHttpServer())
      .post("/auth/sign-in")
      .send(loginData)
      .expect(HttpStatus.OK);
    const token = response.body.token;

    await request(app.getHttpServer())
      .post('/ebooks')
      .send(ebookDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.BAD_REQUEST)
  });

  it("GET /ebooks => should get all ebooks", async () => {
    await new EbookFactory(prisma)
      .withTitle(faker.lorem.word(3))
      .withDescription(faker.lorem.paragraph())
      .withAuthor(faker.person.fullName())
      .withPDF(`${faker.system.commonFileName()}.pdf`)
      .persist();

    await new EbookFactory(prisma)
      .withTitle(faker.lorem.word(3))
      .withDescription(faker.lorem.paragraph())
      .withAuthor(faker.person.fullName())
      .withPDF(`${faker.system.commonFileName()}.pdf`)
      .persist();

    const { status, body } = await request(app.getHttpServer()).get("/ebooks");
    expect(status).toBe(HttpStatus.OK);
    expect(body).toHaveLength(2);
  });

  it("GET /ebooks/:id => should get specific ebooks", async () => {
    const ebookDto = await new EbookFactory(prisma)
      .withTitle(faker.lorem.word(3))
      .withDescription(faker.lorem.paragraph())
      .withAuthor(faker.person.fullName())
      .withPDF(`${faker.system.commonFileName()}.pdf`)
      .persist();

    await new EbookFactory(prisma)
      .withTitle(faker.lorem.word(3))
      .withDescription(faker.lorem.paragraph())
      .withAuthor(faker.person.fullName())
      .withPDF(`${faker.system.commonFileName()}.pdf`)
      .persist();

    const { status, body } = await request(app.getHttpServer()).get(`/ebooks/${ebookDto.id}`);
    expect(status).toBe(HttpStatus.OK);
    expect(body).toEqual({
      id: expect.any(Number),
      title: ebookDto.title,
      description: ebookDto.description,
      author: ebookDto.author,
      pdf: ebookDto.pdf
    })
  });

  it("GET /ebooks/:id => should get an error when specific ebook does not exist", async () => {
    const { status } = await request(app.getHttpServer()).get(`/ebooks/9999`);
    expect(status).toBe(HttpStatus.NOT_FOUND);
  });

  it('PUT /ebooks => should update an ebook', async () => {
    const newEbook = await new EbookFactory(prisma)
      .withTitle(faker.lorem.word(3))
      .withDescription(faker.lorem.paragraph())
      .withAuthor(faker.person.fullName())
      .withPDF(`${faker.system.commonFileName()}.pdf`)
      .persist();


    const ebookDto: CreateEbookDto = new CreateEbookDto();
    ebookDto.title = faker.lorem.words(3);
    ebookDto.author = faker.person.fullName(); 
    ebookDto.description = faker.lorem.paragraph(); 
    ebookDto.pdf = `${faker.system.commonFileName()}.pdf`; 

    const loginData = {
      username: process.env.ADMIN_USER,
      password: process.env.PASSWORD,
    };

    const response = await request(app.getHttpServer())
      .post("/auth/sign-in")
      .send(loginData)
      .expect(HttpStatus.OK);
    const token = response.body.token;

    await request(app.getHttpServer())
      .put(`/ebooks/${newEbook.id}`)
      .send(ebookDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK)

    const ebooks = await prisma.ebook.findMany();
    expect(ebooks).toHaveLength(1);
    const ebook = ebooks[0];
    expect(ebook).toEqual({
      id: expect.any(Number),
      title: ebookDto.title,
      description: ebookDto.description,
      author: ebookDto.author,
      pdf: ebookDto.pdf
    })
  });

  it('PUT /ebooks => should not update an ebook if the information already exists', async () => {
    const ebook = await new EbookFactory(prisma)
      .withTitle(faker.lorem.word(3))
      .withDescription(faker.lorem.paragraph())
      .withAuthor(faker.person.fullName())
      .withPDF(`${faker.system.commonFileName()}.pdf`)
      .persist();

    await new EbookFactory(prisma)
      .withTitle(faker.lorem.word(3))
      .withDescription(faker.lorem.paragraph())
      .withAuthor(faker.person.fullName())
      .withPDF(`${faker.system.commonFileName()}.pdf`)
      .persist();

    const ebookDto: UpdateEbookDto = new UpdateEbookDto({
      title: faker.lorem.word(3),
      description: faker.lorem.paragraph(),
      author: faker.person.fullName(),
      pdf: `${faker.system.commonFileName()}.pdf`
    });

    const loginData = {
      username: process.env.ADMIN_USER,
      password: process.env.PASSWORD,
    };

    const response = await request(app.getHttpServer())
      .post("/auth/sign-in")
      .send(loginData)
      .expect(HttpStatus.OK);
    const token = response.body.token;

    await request(app.getHttpServer())
        .post('/ebooks')
        .send(ebookDto)
        .set('Authorization', `Bearer ${token}`)
        .expect(HttpStatus.CREATED)

    await request(app.getHttpServer())
      .put(`/ebooks/${ebook.id}`)
      .send(ebookDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.CONFLICT)
  });

  it('PUT /ebooks => should not update an ebook if does not exist', async () => {
    const mediaDto: UpdateEbookDto = new UpdateEbookDto({
      title: faker.lorem.word(3),
      description: faker.lorem.paragraph(),
      author: faker.person.fullName(),
      pdf: `${faker.system.commonFileName()}.pdf`
    });

    const loginData = {
      username: process.env.ADMIN_USER,
      password: process.env.PASSWORD,
    };

    const response = await request(app.getHttpServer())
      .post("/auth/sign-in")
      .send(loginData)
      .expect(HttpStatus.OK);
    const token = response.body.token;

    await request(app.getHttpServer())
      .put(`/medias/9999`)
      .send(mediaDto)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.NOT_FOUND)
  });

  it('DELETE /ebooks => should delete an ebook', async () => {
    const ebook = await new EbookFactory(prisma)
      .withTitle(faker.lorem.word(3))
      .withDescription(faker.lorem.paragraph())
      .withAuthor(faker.person.fullName())
      .withPDF(`${faker.system.commonFileName()}.pdf`)
      .persist();

    const loginData = {
      username: process.env.ADMIN_USER,
      password: process.env.PASSWORD,
    };

    const response = await request(app.getHttpServer())
      .post("/auth/sign-in")
      .send(loginData)
      .expect(HttpStatus.OK);
    const token = response.body.token;

    await request(app.getHttpServer())
      .delete(`/ebooks/${ebook.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.OK);

    const ebooks = await prisma.ebook.findMany();
    expect(ebooks).toHaveLength(0);
  });

  it('DELETE /ebooks => should not delete an ebook if does not exist', async () => {
    const loginData = {
      username: process.env.ADMIN_USER,
      password: process.env.PASSWORD,
    };

    const response = await request(app.getHttpServer())
      .post("/auth/sign-in")
      .send(loginData)
      .expect(HttpStatus.OK);

    const token = response.body.token;

    await request(app.getHttpServer())
      .delete(`/medias/9999`)
      .set('Authorization', `Bearer ${token}`)
      .expect(HttpStatus.NOT_FOUND);
  });

});
