import { MemoryDb } from "./memory-db";
import { Test, TestingModule } from "@nestjs/testing";
import { OrderModule } from "../src/eshop/order/order.module";
import { ConfigService } from "../src/config/config.service";
import { useContainer } from 'class-validator';
import { DataMockEntities, MOCK_TOKEN } from '@pyxismedia/lib-model';
import * as request from "supertest";
import { AuthSignInRequestDto } from "../src/auth/auth/dto/auth-sign-in-request.dto";
import { AuthSignInResponseDto } from "../src/auth/auth/dto/auth-sign-in-response.dto";

describe('OrderController (e2e)', () => {
  let app: any;
  let db: MemoryDb;
  let dbUri: string;
  const URL = '/commerce/order';

  beforeAll(async () => {
    db = new MemoryDb();
    db.import(DataMockEntities.PRODUCTS);
    db.import(DataMockEntities.USERS);
    db.import(DataMockEntities.ROLES);
    db.import(DataMockEntities.ACCESS);
    db.import(DataMockEntities.ORDERS);
    dbUri = await db.uri;
    await db.ensure();
  });

  afterAll(async () => {
    await db.stop();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [OrderModule],
    })
      .overrideProvider(ConfigService)
      .useValue({
        get() {
          return dbUri;
        },
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    useContainer(app, { fallbackOnErrors: true });
  });

  describe('access rights - any', () => {
    let auth: AuthSignInResponseDto;

    beforeEach(async () => {
      auth = await request(app.getHttpServer())
        .post('/auth')
        .send(
          new AuthSignInRequestDto({
            email: 'karel@vomacka.cz',
            password: '12345',
          }),
        )
        .then(res => res.body);
    });

    describe('/commerce/order (GET)', () => {
      it('should be possible to get all orders', async () => {
        return await request(app.getHttpServer())
          .get('/commerce/order?skip=0')
          .set('Authorization', `Bearer ${auth.token}`)
          .expect(200)
          .expect([
            {
              "createdAt": "Sun Dec 29 2019 11:28:45 GMT+0100 (CET)",
              "id": "5e01c779d893e6938c118879",
              "products": [
                {
                  "description": "aThis is mock description EN",
                  "id": "5de3e0a388e99a666e8ee8ad",
                  "images": [
                    {
                      "alt": "aThis is alt of image",
                      "src": "https://picsum.photos/200/300"
                    }
                  ],
                  "price": 123,
                  "title": "aMock title EN"
                },
                {
                  "description": "This is mock description EN",
                  "id": "5de3e0a388e99a666e8ee8ab",
                  "images": [
                    {
                      "alt": "This is alt of image",
                      "src": "https://picsum.photos/200/300"
                    }
                  ],
                  "price": 124,
                  "title": "Mock title EN"
                }
              ],
              "user": {
                "email": "karel@vomacka.cz",
                "forname": "Karel",
                "id": "000000000000000000000a00",
                "roles": [
                  "5dc9bc0c99e35856ffe90e66"
                ],
                "surname": "Vomacka"
              }
            },
            {
              "createdAt": "Sun Dec 29 2019 11:28:46 GMT+0100 (CET)",
              "id": "5e03379ad2e5526d3d8eb277",
              "products": [
                {
                  "description": "aThis is mock description EN",
                  "id": "5de3e0a388e99a666e8ee8ad",
                  "images": [
                    {
                      "alt": "aThis is alt of image",
                      "src": "https://picsum.photos/200/300"
                    }
                  ],
                  "price": 123,
                  "title": "aMock title EN"
                },
                {
                  "description": "This is mock description EN",
                  "id": "5de3e0a388e99a666e8ee8ab",
                  "images": [
                    {
                      "alt": "This is alt of image",
                      "src": "https://picsum.photos/200/300"
                    }
                  ],
                  "price": 124,
                  "title": "Mock title EN"
                }
              ],
              "user": {
                "email": "tonda@zakaznik.cz",
                "forname": "Tonda",
                "id": "5e021cc4b0d0a6bd5f64b67c",
                "roles": [
                  "5e021e7c909b5abd8afb0ba5"
                ],
                "surname": "Zakaznik"
              }
            }
          ])
      });

      it('should be possible to skip all orders by one', async () => {
        return await request(app.getHttpServer())
          .get('/commerce/order?skip=1')
          .set('Authorization', `Bearer ${auth.token}`)
          .expect(200)
          .expect([
            {
              "createdAt": "Sun Dec 29 2019 11:28:46 GMT+0100 (CET)",
              "id": "5e03379ad2e5526d3d8eb277",
              "products": [
                {
                  "description": "aThis is mock description EN",
                  "id": "5de3e0a388e99a666e8ee8ad",
                  "images": [
                    {
                      "alt": "aThis is alt of image",
                      "src": "https://picsum.photos/200/300"
                    }
                  ],
                  "price": 123,
                  "title": "aMock title EN"
                },
                {
                  "description": "This is mock description EN",
                  "id": "5de3e0a388e99a666e8ee8ab",
                  "images": [
                    {
                      "alt": "This is alt of image",
                      "src": "https://picsum.photos/200/300"
                    }
                  ],
                  "price": 124,
                  "title": "Mock title EN"
                }
              ],
              "user": {
                "email": "tonda@zakaznik.cz",
                "forname": "Tonda",
                "id": "5e021cc4b0d0a6bd5f64b67c",
                "roles": [
                  "5e021e7c909b5abd8afb0ba5"
                ],
                "surname": "Zakaznik"
              }
            }
          ])
      });
    });

    describe('/commerce/order/:id (GET)', () => {
      it('should be possible to get any by id', async () => {
        return await request(app.getHttpServer())
          .get('/commerce/order/5e01c779d893e6938c118879')
          .set('Authorization', `Bearer ${auth.token}`)
          .expect(200)
          .expect(
            {
              "createdAt": "Sun Dec 29 2019 11:28:45 GMT+0100 (CET)",
              "id": "5e01c779d893e6938c118879",
              "products": [
                {
                  "description": "aThis is mock description EN",
                  "id": "5de3e0a388e99a666e8ee8ad",
                  "images": [
                    {
                      "alt": "aThis is alt of image",
                      "src": "https://picsum.photos/200/300"
                    }
                  ],
                  "price": 123,
                  "title": "aMock title EN"
                },
                {
                  "description": "This is mock description EN",
                  "id": "5de3e0a388e99a666e8ee8ab",
                  "images": [
                    {
                      "alt": "This is alt of image",
                      "src": "https://picsum.photos/200/300"
                    }
                  ],
                  "price": 124,
                  "title": "Mock title EN"
                }
              ],
              "user": {
                "email": "karel@vomacka.cz",
                "forname": "Karel",
                "id": "000000000000000000000a00",
                "roles": [
                  "5dc9bc0c99e35856ffe90e66"
                ],
                "surname": "Vomacka"
              }
            }
          )
      });
    });

    describe('/commerce/order (POST)', () => {
      it.todo('should be possible to create order under current user');
      it.todo('should response with Bad RequestException when whole request object is incorrect');

      describe('user error', () => {
        it.todo('should respond with error when user is undefined');
        it.todo('should respond with error when user is not valid ObjectID');
        it.todo('should respond with error when user does not exist');
      });

      describe('products error', () => {
        // At least only with one product we can make an order
        it.todo('should respond with error when products are empty array');
        it.todo('should respond with error when product is not valid ObjectID');
        it.todo('should respond with error when product is undefined');
      });
    });

    describe('/commerce/order (DELETE)', () => {
      it.todo('should be possible to delete any order');
    });

    describe('/commerce/order/:id (PUT)', () => {
      it.todo('should be possible to update any order');
      it.todo('should response with Bad RequestException when whole request object is incorrect');

      describe('user error', () => {
        it.todo('should respond with error when user is undefined');
        it.todo('should respond with error when user is not valid ObjectID');
        it.todo('should respond with error when user does not exist');
      });

      describe('products error', () => {
        // At least only with one product we can make an order
        it.todo('should respond with error when products are empty array');
        it.todo('should respond with error when product is not valid ObjectID');
        it.todo('should respond with error when product is undefined');
      });
    });
  });

  describe('access rights - own', () => {
    let auth: AuthSignInResponseDto;

    beforeEach(async () => {
      auth = await request(app.getHttpServer())
        .post('/auth')
        .send(
          new AuthSignInRequestDto({
            email: 'tonda@zakaznik.cz',
            password: '12345',
          }),
        )
        .then(res => res.body);
    });

    describe('/commerce/order (GET)', () => {
      it('should be possible to get all own orders', async () => {
        return await request(app.getHttpServer())
          .get('/commerce/order?skip=0')
          .set('Authorization', `Bearer ${auth.token}`)
          .expect(200)
          .expect([
            {
              "createdAt": "Sun Dec 29 2019 11:28:46 GMT+0100 (CET)",
              "id": "5e03379ad2e5526d3d8eb277",
              "products": [
                {
                  "description": "aThis is mock description EN",
                  "id": "5de3e0a388e99a666e8ee8ad",
                  "images": [
                    {
                      "alt": "aThis is alt of image",
                      "src": "https://picsum.photos/200/300"
                    }
                  ],
                  "price": 123,
                  "title": "aMock title EN"
                },
                {
                  "description": "This is mock description EN",
                  "id": "5de3e0a388e99a666e8ee8ab",
                  "images": [
                    {
                      "alt": "This is alt of image",
                      "src": "https://picsum.photos/200/300"
                    }
                  ],
                  "price": 124,
                  "title": "Mock title EN"
                }
              ],
              "user": {
                "email": "tonda@zakaznik.cz",
                "forname": "Tonda",
                "id": "5e021cc4b0d0a6bd5f64b67c",
                "roles": [
                  "5e021e7c909b5abd8afb0ba5"
                ],
                "surname": "Zakaznik"
              }
            }
          ])
      });
    });

    describe('/commerce/order/:id (GET)', () => {
      it('should not be possible to get not own by id', async () => {
        return await request(app.getHttpServer())
          .get('/commerce/order/5e01c779d893e6938c118879')
          .set('Authorization', `Bearer ${auth.token}`)
          .expect(404)
          .expect({
            statusCode: 404,
            error: 'Not Found',
            message:
              'Order with userId of 5e021cc4b0d0a6bd5f64b67c and id of 5e01c779d893e6938c118879 doesn\'t exist.'
          })
      });

      it('should be possible to get own by id', async () => {
        return await request(app.getHttpServer())
          .get('/commerce/order/5e03379ad2e5526d3d8eb277')
          .set('Authorization', `Bearer ${auth.token}`)
          .expect(200)
          .expect({
            "createdAt": "Sun Dec 29 2019 11:28:46 GMT+0100 (CET)",
            "id": "5e03379ad2e5526d3d8eb277",
            "products": [
              {
                "description": "aThis is mock description EN",
                "id": "5de3e0a388e99a666e8ee8ad",
                "images": [
                  {
                    "alt": "aThis is alt of image",
                    "src": "https://picsum.photos/200/300"
                  }
                ],
                "price": 123,
                "title": "aMock title EN"
              },
              {
                "description": "This is mock description EN",
                "id": "5de3e0a388e99a666e8ee8ab",
                "images": [{
                    "alt": "This is alt of image",
                    "src": "https://picsum.photos/200/300"
                  }],
                "price": 124,
                "title": "Mock title EN"
              }
            ],
            "user": {
              "email": "tonda@zakaznik.cz",
              "forname": "Tonda",
              "id": "5e021cc4b0d0a6bd5f64b67c",
              "roles": ["5e021e7c909b5abd8afb0ba5"],
              "surname": "Zakaznik"
            }
          })
      });
    });

    describe('/commerce/order (POST)', () => {
      it.todo('should be possible to create own order');

      it.todo('should response with Bad RequestException when whole request object is incorrect');

      describe('user error', () => {
        it.todo('should respond with error when user is undefined');
        it.todo('should respond with error when user is not valid ObjectID');
        it.todo('should respond with error when user does not exist');
      });

      describe('products error', () => {
        // At least only with one product we can make an order
        it.todo('should respond with error when products are empty array');
        it.todo('should respond with error when product is not valid ObjectID');
        it.todo('should respond with error when product is undefined');
      });
    });

    describe('/commerce/order (DELETE)', () => {
      it.todo('should be possible to delete own order');
      it.todo('should not be possible to delete not own order');
    });

    describe('/commerce/order/:id (PUT)', () => {
      // This is due to situation that when order is made it cannot be update by customer
      it.todo('should be not possible to update own order');

      it.todo('should response with Bad RequestException when whole request object is incorrect');

      describe('user error', () => {
        it.todo('should respond with error when user is undefined');
        it.todo('should respond with error when user is not valid ObjectID');
        it.todo('should respond with error when user does not exist');
      });

      describe('products error', () => {
        // At least only with one product we can make an order
        it.todo('should respond with error when products are empty array');
        it.todo('should respond with error when product is not valid ObjectID');
        it.todo('should respond with error when product is undefined');
      });
    });
  });
});
