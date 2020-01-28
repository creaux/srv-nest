import { Test, TestingModule } from "@nestjs/testing";
import * as request from "supertest";
import { ProductModule } from "../src/store/product/product.module";
import { ConfigService } from "../src/config/config.service";
import { DataMockEntities, MOCK_TOKEN } from "@pyxismedia/lib-model";
import { MemoryDb } from "./memory-db";
import { useContainer } from "class-validator";
import { AuthSignInRequestDto } from "../src/auth/auth/dto/auth-sign-in-request.dto";
import { AuthSignInResponseDto } from "../src/auth/auth/dto/auth-sign-in-response.dto";
import { CreateProductRequestDto } from "../src/store/product/dto";
import { ImageResponseDto } from "../src/image.response.dto";

describe("ProductController (e2e)", () => {
  let app: any;
  let db: MemoryDb;
  let dbUri: string;
  const URL = "/store/product";

  beforeAll(async () => {
    db = new MemoryDb();
    db.import(DataMockEntities.PRODUCTS);
    db.import(DataMockEntities.USERS);
    db.import(DataMockEntities.ROLES);
    db.import(DataMockEntities.ACCESS);
    dbUri = await db.uri;
    await db.ensure();
  });

  afterAll(async () => {
    await db.stop();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [ProductModule]
    })
      .overrideProvider(ConfigService)
      .useValue({
        get() {
          return dbUri;
        }
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    useContainer(app, { fallbackOnErrors: true });
  });

  describe("with anonymous access", () => {
    describe(`${URL} (GET)`, () => {
      it("should be possible to get all products", async () => {
        return request(app.getHttpServer())
          .get(URL)
          .expect(200)
          .expect(
            [
              {
                "description": "This is mock description EN",
                "id": "5de3e0a388e99a666e8ee8ab",
                "images": [
                  {
                    "alt": "This is alt of image",
                    "src": "https://picsum.photos/200/300"
                  }
                ],
                "prices": [
                  {
                    "currency": "usd",
                    "value": 124
                  },
                  {
                    "currency": "czk",
                    "value": 11
                  }
                ],
                "title": "Mock title EN"
              },
              {
                "description": "aThis is mock description EN",
                "id": "5de3e0a388e99a666e8ee8ad",
                "images": [
                  {
                    "alt": "aThis is alt of image",
                    "src": "https://picsum.photos/200/300"
                  }
                ],
                "prices": [
                  {
                    "currency": "usd",
                    "value": 123
                  },
                  {
                    "currency": "czk",
                    "value": 10
                  }
                ],
                "title": "aMock title EN"
              },
              {
                "description": "bThis is mock description EN",
                "id": "5e1efa1c284fd310a7387799",
                "images": [
                  {
                    "alt": "This is alt of image",
                    "src": "https://picsum.photos/200/300"
                  }
                ],
                "prices": [
                  {
                    "currency": "usd",
                    "value": 123
                  },
                  {
                    "currency": "czk",
                    "value": 10
                  }
                ],
                "title": "bMock title EN"
              }
            ]
          );
      });

      it("should respond with Bad Request", async () => {
        return request(app.getHttpServer())
          .get(`${URL}?skip=abc`)
          .expect(400)
          .expect({
            statusCode: 400,
            error: "Bad Request",
            message: "You have to provide numeric value."
          });
      });

      it("should be possible to skip posts", async () => {
        return request(app.getHttpServer())
          .get(`${URL}?skip=3`)
          .expect(200)
          .expect([]);
      });
    });

    describe(`${URL}/:id (GET)`, () => {
      it("should be possible to get product", done => {
        return request(app.getHttpServer())
          .get(`${URL}/${db.get(DataMockEntities.PRODUCTS)[0].id}`)
          .expect(200)
          .end((err, { body }) => {
            expect(body).toEqual({
              "description": "aThis is mock description EN",
              "id": "5de3e0a388e99a666e8ee8ad",
              "images": [
                {
                  "alt": "aThis is alt of image",
                  "src": "https://picsum.photos/200/300"
                }
              ],
              "prices": [
                {
                  "currency": "usd",
                  "value": 123
                },
                {
                  "currency": "czk",
                  "value": 10
                }
              ],
              "title": "aMock title EN"
            });
            done();
          });
      });

      it(`${URL}/:id (GET) should respond with Bad Request`, () => {
        return request(app.getHttpServer())
          .get(`${URL}/135`)
          .expect(400)
          .expect({
            statusCode: 400,
            error: "Bad Request",
            message: "Requested id is not ObjectId."
          });
      });

      it(`${URL}/:id (GET) should respond with Not Found`, () => {
        return request(app.getHttpServer())
          .get(`${URL}/00000000000000000000000a`)
          .expect(404)
          .expect({
            statusCode: 404,
            error: "Not Found",
            message: "There is no product exists with requested id."
          });
      });
    });
  });

  describe("with access rights", () => {
    let auth: AuthSignInResponseDto;

    beforeEach(async () => {
      auth = await request(app.getHttpServer())
        .post("/auth")
        .send(
          new AuthSignInRequestDto({
            email: "karel@vomacka.cz",
            password: "12345"
          })
        )
        .then(res => res.body);
    });

    describe("/store/product (POST)", () => {
      let createProductRequestMock: CreateProductRequestDto;

      beforeEach(() => {
        const Mock = Reflect.getMetadata(MOCK_TOKEN, CreateProductRequestDto);
        createProductRequestMock = new Mock();
      });

      it("should be possible to create product", done => {
        return request(app.getHttpServer())
          .post(URL)
          .send(createProductRequestMock)
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(201)
          .end((err, { body }) => {
            expect(body.title).toEqual(createProductRequestMock.title);
            expect(body.description).toEqual(createProductRequestMock.description);
            expect(body.images[0].src).toEqual(createProductRequestMock.images[0].src);
            expect(body.images[0].alt).toEqual(createProductRequestMock.images[0].alt);
            expect(body.prices[0].value).toEqual(createProductRequestMock.prices[0].value);
            expect(body.prices[0].currency).toEqual(createProductRequestMock.prices[0].currency);
            return done();
          });
      });

      it("should respond with Bad Request when whole object is incorrect", done => {
        return request(app.getHttpServer())
          .post(URL)
          .send({ abc: "abc" })
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(200)
          .end((err, { body }) => {
            expect(body.message[0].property).toBe("title");
            expect(body.message[1].property).toBe("description");
            expect(body.message[2].property).toBe("images");
            expect(body.message[3].property).toBe("prices");
            done();
          });
      });

      describe("title error", () => {
        it("should respond with error when it is undefined", done => {
          const { title, ...rest } = createProductRequestMock;
          const send = { ...rest };
          return request(app.getHttpServer())
            .post(URL)
            .send(send)
            .set("Authorization", `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body }) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual("Request validation failed");
              expect(body.message[0].value).toEqual(undefined);
              expect(body.message[0].property).toEqual("title");
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.isDefined).toEqual(
                "title should not be null or undefined"
              );
              expect(body.message[0].constraints.isString).toEqual(
                "title must be a string"
              );
              expect(body.message[0].constraints.length).toEqual(
                "title must be longer than or equal to 1 characters"
              );
              expect(body.message[1]).toBeUndefined();
              done();
            });
        });


        it("should respond with error when it is not string", done => {
          const { title, ...rest } = createProductRequestMock;
          const send = { ...rest, title: 123 };
          return request(app.getHttpServer())
            .post(URL)
            .send(send)
            .set("Authorization", `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body }) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual("Request validation failed");
              expect(body.message[0].value).toEqual(123);
              expect(body.message[0].property).toEqual("title");
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.length).toEqual(
                "title must be longer than or equal to 1 and shorter than or equal to 120 characters"
              );
              expect(body.message[0].constraints.isString).toEqual(
                "title must be a string"
              );
              expect(body.message[1]).toBeUndefined();
              done();
            });
        });

        it("should respond with error when it is empty", done => {
          const { title, ...rest } = createProductRequestMock;
          return request(app.getHttpServer())
            .post(URL)
            .send({ ...rest, title: "" })
            .set("Authorization", `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body }) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual("Request validation failed");
              expect(body.message[0].value).toEqual("");
              expect(body.message[0].property).toEqual("title");
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.length).toEqual(
                "title must be longer than or equal to 1 characters"
              );
              expect(body.message[1]).toBeUndefined();
              done();
            });
        });
      });

      describe("description error", () => {
        it("should respond with error when it is undefined", done => {
          const { description, ...rest } = createProductRequestMock;
          // @ts-ignore
          const send = { ...rest, description: undefined };
          return request(app.getHttpServer())
            .post(URL)
            .send(send)
            .set("Authorization", `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body }) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual("Request validation failed");
              expect(body.message[0].value).toEqual(undefined);
              expect(body.message[0].property).toEqual("description");
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.isDefined).toEqual(
                "description should not be null or undefined"
              );
              expect(body.message[0].constraints.isString).toEqual(
                "description must be a string"
              );
              expect(body.message[1]).toBeUndefined();
              done();
            });
        });


        it("should respond with error when it is not string", done => {
          const { description, ...rest } = createProductRequestMock;
          const send = { ...rest, description: 123 };
          return request(app.getHttpServer())
            .post(URL)
            .send(send)
            .set("Authorization", `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body }) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual("Request validation failed");
              expect(body.message[0].value).toEqual(123);
              expect(body.message[0].property).toEqual("description");
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.isString).toEqual(
                "description must be a string"
              );
              expect(body.message[1]).toBeUndefined();
              done();
            });
        });

        it("should respond with error when it is empty", done => {
          const { description, ...rest } = createProductRequestMock;
          return request(app.getHttpServer())
            .post(URL)
            .send({ ...rest, description: "" })
            .set("Authorization", `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body }) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual("Request validation failed");
              expect(body.message[0].value).toEqual("");
              expect(body.message[0].property).toEqual("description");
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.length).toEqual(
                "description must be longer than or equal to 1 characters"
              );
              expect(body.message[1]).toBeUndefined();
              done();
            });
        });

        it("should respond with error when it is empty", done => {
          const { description, ...rest } = createProductRequestMock;
          const send = {
            ...rest,
            description: "Vestibulum id ligula porta felis euismod semper. Etiam porta sem malesuada magna mollis euismod. Sed posuere consectetur est at lobortis. Donec sed odio dui. Vestibulum id ligula porta felis euismod semper. Etiam porta sem malesuada magna m."
          };
          return request(app.getHttpServer())
            .post(URL)
            .send(send)
            .set("Authorization", `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body }) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual("Request validation failed");
              expect(body.message[0].value).toEqual(send.description);
              expect(body.message[0].property).toEqual("description");
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.length).toEqual(
                "description must be shorter than or equal to 240 characters"
              );
              expect(body.message[1]).toBeUndefined();
              done();
            });
        });
      });

      describe("images error", () => {
        it("should respond with error when it is undefined", done => {
          const { images, ...rest } = createProductRequestMock;
          const send = { ...rest };
          return request(app.getHttpServer())
            .post(URL)
            .send(send)
            .set("Authorization", `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body }) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual("Request validation failed");
              expect(body.message[0].value).toEqual(undefined);
              expect(body.message[0].property).toEqual("images");
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.isDefined).toEqual(
                "images should not be null or undefined"
              );
              expect(body.message[1]).toBeUndefined();
              done();
            });
        });

        it("should respond with error when images are empty", done => {
          const { images, ...rest } = createProductRequestMock;
          const send = { ...rest, images: [] as string[] };
          return request(app.getHttpServer())
            .post(URL)
            .send(send)
            .set("Authorization", `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body }) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual("Request validation failed");
              expect(body.message[0].value).toEqual([]);
              expect(body.message[0].property).toEqual("images");
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.arrayNotEmpty).toEqual(
                "images should not be empty"
              );
              expect(body.message[1]).toBeUndefined();
              done();
            });
        });

        it("should respond with error when any image validation fail", done => {
          const { images, ...rest } = createProductRequestMock;
          // @ts-ignore
          const send = { ...rest, images: [new ImageResponseDto({ src: "abc", alt: 123 })] as string[] };
          return request(app.getHttpServer())
            .post(URL)
            .send(send)
            .set("Authorization", `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body }) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual("Request validation failed");
              expect(body.message[0].value).toEqual([{
                "alt": 123,
                "src": "abc"
              }]);
              expect(body.message[0].property).toEqual("images");
              expect(body.message[0].children).toEqual([{
                "children": [
                  {
                    "children": [],
                    "constraints": {
                      "isUrl": "src must be an URL address"
                    },
                    "property": "src",
                    "target": {
                      "alt": 123,
                      "src": "abc"
                    },
                    "value": "abc"
                  },
                  {
                    "children": [],
                    "constraints": {
                      "isString": "alt must be a string"
                    },
                    "property": "alt",
                    "target": {
                      "alt": 123,
                      "src": "abc"
                    },
                    "value": 123
                  }
                ],
                "property": "0",
                "target": [
                  {
                    "alt": 123,
                    "src": "abc"
                  }
                ],
                "value": {
                  "alt": 123,
                  "src": "abc"
                }
              }]);
              expect(body.message[1]).toBeUndefined();
              done();
            });
        });
      });

      describe("prices error", () => {
        it("should respond with error when it is undefined", done => {
          const { prices, ...rest } = createProductRequestMock;
          // @ts-ignore
          const send = { ...rest, prices: undefined };
          return request(app.getHttpServer())
            .post(URL)
            .send(send)
            .set("Authorization", `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body }) => {
              expect(body.statusCode).toEqual(400);
              expect(body.error).toEqual("Request validation failed");
              expect(body.message[0].value).toEqual(undefined);
              expect(body.message[0].property).toEqual("prices");
              expect(body.message[0].children).toEqual([]);
              expect(body.message[0].constraints.isDefined).toEqual(
                "prices should not be null or undefined"
              );
              expect(body.message[1]).toBeUndefined();
              done();
            });
        });
      });
    });
  });
});
