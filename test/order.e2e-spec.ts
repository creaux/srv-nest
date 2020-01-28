import { MemoryDb } from "./memory-db";
import { Test, TestingModule } from "@nestjs/testing";
import { OrderModule } from "../src/eshop/order/order.module";
import { ConfigService } from "../src/config/config.service";
import { useContainer } from "class-validator";
import { DataMockEntities, MOCK_TOKEN } from "@pyxismedia/lib-model";
import * as request from "supertest";
import { AuthSignInRequestDto } from "../src/auth/auth/dto/auth-sign-in-request.dto";
import { AuthSignInResponseDto } from "../src/auth/auth/dto/auth-sign-in-response.dto";
import { CreateProductRequestDto } from "../src/eshop/product/product/dto/create-product-request.dto";
import { CreateOrderRequest } from "../src/eshop/order/dto/create-order-request.dto";

const { keys } = Object;

describe("OrderController (e2e)", () => {
  let app: any;
  let db: MemoryDb;
  let dbUri: string;
  const URL = "/commerce/order";

  beforeEach(async () => {
    db = new MemoryDb();
    db.import(DataMockEntities.PRODUCTS);
    db.import(DataMockEntities.USERS);
    db.import(DataMockEntities.ROLES);
    db.import(DataMockEntities.ACCESS);
    db.import(DataMockEntities.ORDERS);
    dbUri = await db.uri;
    await db.ensure();
  });

  afterEach(async () => {
    await db.stop();
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [OrderModule]
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

  describe("access rights - any", () => {
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

    describe("/commerce/order (GET)", () => {
      it("should be possible to get all orders", async () => {
        return await request(app.getHttpServer())
          .get("/commerce/order?skip=0")
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(200)
          .expect([
            {
              "createdAt": "Sun Dec 29 2019 11:28:45 GMT+0100 (CET)",
              "id": "5e01c779d893e6938c118879",
              "process": "unpaid",
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
                  "prices": [
                    {
                      "value": 123,
                      "currency": "usd"
                    },
                    {
                      "value": 10,
                      "currency": "czk"
                    }
                  ],
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
                  "prices": [
                    {
                      "value": 124,
                      "currency": "usd"
                    },
                    {
                      "value": 11,
                      "currency": "czk"
                    }
                  ],
                  "title": "Mock title EN"
                }
              ],
              "user": {
                "email": "karel@vomacka.cz",
                "forname": "Karel",
                "id": "000000000000000000000a00",
                "l10n": [],
"roles": [
                  "5dc9bc0c99e35856ffe90e66"
                ],
                "surname": "Vomacka"
              }
            },
            {
              "createdAt": "Sun Dec 29 2019 11:28:46 GMT+0100 (CET)",
              "id": "5e03379ad2e5526d3d8eb277",
              "process": "paid",
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
                  "prices": [
                    {
                      "value": 123,
                      "currency": "usd"
                    },
                    {
                      "value": 10,
                      "currency": "czk"
                    }
                  ],
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
                  "prices": [
                    {
                      "value": 124,
                      "currency": "usd"
                    },
                    {
                      "value": 11,
                      "currency": "czk"
                    }
                  ],
                  "title": "Mock title EN"
                }
              ],
              "user": {
                "email": "tonda@zakaznik.cz",
                "forname": "Tonda",
                "id": "5e021cc4b0d0a6bd5f64b67c",
                "l10n": [],
"roles": [
                  "5e021e7c909b5abd8afb0ba5"
                ],
                "surname": "Zakaznik"
              }
            }
          ]);
      });

      it("should be possible to skip all orders by one", async () => {
        return await request(app.getHttpServer())
          .get("/commerce/order?skip=1")
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(200)
          .expect([
            {
              "createdAt": "Sun Dec 29 2019 11:28:46 GMT+0100 (CET)",
              "id": "5e03379ad2e5526d3d8eb277",
              "process": "paid",
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
                }
              ],
              "user": {
                "email": "tonda@zakaznik.cz",
                "forname": "Tonda",
                "id": "5e021cc4b0d0a6bd5f64b67c",
                "l10n": [],
                "roles": [
                  "5e021e7c909b5abd8afb0ba5"
                ],
                "surname": "Zakaznik"
              }
            }
          ]);
      });
    });

    describe("/commerce/order/:id (GET)", () => {
      it("should be possible to get any by id", async () => {
        return await request(app.getHttpServer())
          .get("/commerce/order/5e01c779d893e6938c118879")
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(200)
          .expect(
            {
              "createdAt": "Sun Dec 29 2019 11:28:45 GMT+0100 (CET)",
              "id": "5e01c779d893e6938c118879",
              "process": "unpaid",
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
                }
              ],
              "user": {
                "email": "karel@vomacka.cz",
                "forname": "Karel",
                "id": "000000000000000000000a00",
                "l10n": [],
"roles": [
                  "5dc9bc0c99e35856ffe90e66"
                ],
                "surname": "Vomacka"
              }
            }
          );
      });
    });

    describe("/commerce/order (POST)", () => {
      let createOrderRequestDto: CreateOrderRequest;

      beforeEach(() => {
        const Mock = Reflect.getMetadata(MOCK_TOKEN, CreateOrderRequest);
        createOrderRequestDto = new Mock();
      });

      it("should be possible to create order under current user", done => {
        return request(app.getHttpServer())
          .post(URL)
          .send({
            products: ["5de3e0a388e99a666e8ee8ad"]
          })
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(201)
          .end((err, { body }) => {
            expect(body.user).toEqual({
              "email": "karel@vomacka.cz",
              "forname": "Karel",
              "id": "000000000000000000000a00",
              "l10n": [],
"roles": [
                "5dc9bc0c99e35856ffe90e66"
              ],
              "surname": "Vomacka"
            });
            expect(body.products).toEqual([
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
              }
            ]);
            return done();
          });
      });

      it("should respond with not found exception when product doesn't exists", () => {
        return request(app.getHttpServer())
          .post(URL)
          .send(createOrderRequestDto)
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(404)
          .expect({
            statusCode: 404,
            error: "Not Found",
            message: "There is no product exists with requested id."
          });
      });

      it("should response with BadRequest Exception when whole request object is incorrect", () => {
        return request(app.getHttpServer())
          .post(URL)
          .send({ abc: "abc" })
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(400)
          .expect({
            "error": "Request validation failed",
            "message": [
              {
                "children": [],
                "constraints": {
                  "arrayNotEmpty": "products should not be empty",
                  "isArray": "products must be an array",
                  "isDefined": "products should not be null or undefined"
                },
                "property": "products",
                "target": {
                  "abc": "abc",
                  "process": "unpaid"
                }
              }
            ],
            "statusCode": 400
          });
      });

      describe("products error", () => {
        // At least only with one product we can make an order
        it("should respond with error when products are empty array", done => {
          return request(app.getHttpServer())
            .post(URL)
            .send({ products: [] })
            .set("Authorization", `Bearer ${auth.token}`)
            .expect(200)
            .end((err, { body }) => {
              expect(body.message[0].property).toBe("products");
              expect(keys(body.message[0].constraints)).toEqual(["arrayNotEmpty"]);
              done();
            });
        });
        it("should respond with error when product is not valid ObjectID", done => {
          return request(app.getHttpServer())
            .post(URL)
            .send({ products: ["abc"] })
            .set("Authorization", `Bearer ${auth.token}`)
            .expect(200)
            .end((err, { body }) => {
              expect(body.message[0].property).toBe("products");
              expect(keys(body.message[0].constraints)).toEqual(["isMongoId"]);
              done();
            });
        });
        it("should respond with error when product is undefined", done => {
          return request(app.getHttpServer())
            .post(URL)
            .send({ products: undefined })
            .set("Authorization", `Bearer ${auth.token}`)
            .expect(200)
            .end((err, { body }) => {
              expect(body.message[0].property).toBe("products");
              expect(keys(body.message[0].constraints)).toEqual(["isDefined", "arrayNotEmpty", "isArray"]);
              done();
            });
        });
      });
    });

    describe("/commerce/order/:id (DELETE)", () => {
      it("should be possible to delete any order", done => {
        return request(app.getHttpServer())
          .delete(`/commerce/order/5e03379ad2e5526d3d8eb277`)
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(200)
          .end((err, { body }) => {
            expect(body.products).toEqual([
              {
                "title": "aMock title EN",
                "description": "aThis is mock description EN",
                "images": [
                  {
                    "src": "https://picsum.photos/200/300",
                    "alt": "aThis is alt of image"
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
                "id": "5de3e0a388e99a666e8ee8ad"
              },
              {
                "title": "Mock title EN",
                "description": "This is mock description EN",
                "images": [
                  {
                    "src": "https://picsum.photos/200/300",
                    "alt": "This is alt of image"
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
                "id": "5de3e0a388e99a666e8ee8ab"
              }
            ]);
            expect(body.user).toEqual({
              "email": "tonda@zakaznik.cz",
              "forname": "Tonda",
              "id": "5e021cc4b0d0a6bd5f64b67c",
              "l10n": [],
"roles": [
                "5e021e7c909b5abd8afb0ba5"
              ],
              "surname": "Zakaznik"
            });
            expect(body.createdAt).toEqual("Sun Dec 29 2019 11:28:46 GMT+0100 (CET)");
            expect(body.id).toEqual("5e03379ad2e5526d3d8eb277");
            done();
          });
      });

      it("should respond with exception when id is not provided", () => {
        return request(app.getHttpServer())
          .delete(`/commerce/order/abc`)
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(400)
          .expect({
            statusCode: 400,
            error: "Bad Request",
            message: "Requested id is not ObjectId."
          });
      });
    });

    describe("/commerce/order/:id (PUT)", () => {
      let updateOrderRequestDto: CreateOrderRequest;

      beforeEach(() => {
        const Mock = Reflect.getMetadata(MOCK_TOKEN, CreateOrderRequest);
        updateOrderRequestDto = new Mock();
      });

      it("should be possible to update any order", done => {
        return request(app.getHttpServer())
          .put(URL + "/5e01c779d893e6938c118879")
          .send({ products: ["5de3e0a388e99a666e8ee8ab"] })
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(201)
          .end((err, { body }) => {
            expect(body.products).toEqual([{
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
            }]);
            return done();
          });
      });

      it("should response with whole object when request is incorrect as params are optional", done => {
        return request(app.getHttpServer())
          .put(URL + "/5e01c779d893e6938c118879")
          .send({ abc: 123 })
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(400)
          .end((err, { body }) => {
            expect(body).toEqual({
              "createdAt": "Sun Dec 29 2019 11:28:45 GMT+0100 (CET)",
              "id": "5e01c779d893e6938c118879",
              "process": "unpaid",
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
                }
              ],
              "user": {
                "email": "karel@vomacka.cz",
                "forname": "Karel",
                "id": "000000000000000000000a00",
                "l10n": [],
"roles": [
                  "5dc9bc0c99e35856ffe90e66"
                ],
                "surname": "Vomacka"
              }
            });
            done();
          });
      });

      describe("user error", () => {
        it("should respond with error when user is not valid ObjectID", done => {
          return request(app.getHttpServer())
            .put(URL + "/5e01c779d893e6938c118879")
            .send({ user: "abc" })
            .set("Authorization", `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body }) => {
              expect(body).toEqual({
                "error": "Request validation failed",
                "message": [
                  {
                    "children": [],
                    "constraints": {
                      "isMongoId": "user must be a mongodb id"
                    },
                    "property": "user",
                    "target": {
                      "user": "abc"
                    },
                    "value": "abc"
                  }
                ],
                "statusCode": 400
              });
              done();
            });
        });
        it("should respond with NotFound when user does not exist", done => {
          return request(app.getHttpServer())
            .put(URL + "/5e01c779d893e6938c118879")
            .send({ user: "5e1e0b455ef69b3708dbfcae" })
            .set("Authorization", `Bearer ${auth.token}`)
            .expect(404)
            .end((err, { body }) => {
              expect(body).toEqual({
                "error": "Not Found",
                "message": "User with provided id 5e1e0b455ef69b3708dbfcae doesn't exists",
                "statusCode": 404
              });
              done();
            });
        });
      });

      describe("products error", () => {
        // At least only with one product we can make an order
        it("should respond with error when products are empty array", done => {
          return request(app.getHttpServer())
            .put(URL + "/5e01c779d893e6938c118879")
            .send({ products: [] })
            .set("Authorization", `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body }) => {
              expect(body).toEqual({
                "error": "Request validation failed",
                "message": [
                  {
                    "children": [],
                    "constraints": {
                      "arrayNotEmpty": "products should not be empty"
                    },
                    "property": "products",
                    "target": {
                      "products": []
                    },
                    "value": []
                  }
                ],
                "statusCode": 400
              });
              done();
            });
        });

        it("should respond with error when product is not valid ObjectID", done => {
          return request(app.getHttpServer())
            .put(URL + "/5e01c779d893e6938c118879")
            .send({ products: ["abc"] })
            .set("Authorization", `Bearer ${auth.token}`)
            .expect(400)
            .end((err, { body }) => {
              expect(body).toEqual({
                "error": "Request validation failed",
                "message": [
                  {
                    "children": [],
                    "constraints": {
                      "isMongoId": "each value in products must be a mongodb id"
                    },
                    "property": "products",
                    "target": {
                      "products": [
                        "abc"
                      ]
                    },
                    "value": [
                      "abc"
                    ]
                  }
                ],
                "statusCode": 400
              });
              done();
            });
        });

        it("should respond with error when any product does not exists", done => {
          return request(app.getHttpServer())
            .put(URL + "/5e01c779d893e6938c118879")
            .send({ products: ["5e1e12de0ac961f8b111a83f"] })
            .set("Authorization", `Bearer ${auth.token}`)
            .expect(404)
            .end((err, { body }) => {
              expect(body).toEqual({
                "error": "Not Found",
                "message": "There is no product exists with requested id.",
                "statusCode": 404
              });
              done();
            });
        });
      });
    });

    describe("/commerce/:orderId/:productId (PUT)", () => {
      it("should be possible to add one unique product", done => {
        return request(app.getHttpServer())
          .put(URL + "/5e01c779d893e6938c118879/5e1efa1c284fd310a7387799")
          .send()
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(201)
          .end((err, { body }) => {
            expect(body.products).toEqual([
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
            ]);
            return done();
          });
      });

      it("should be possible to add one existing product ones more time", done => {
        return request(app.getHttpServer())
          .put(URL + "/5e01c779d893e6938c118879/5de3e0a388e99a666e8ee8ad")
          .send()
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(201)
          .end((err, { body }) => {
            expect(body.products).toEqual([
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
              }
            ]);
            return done();
          });
      });

      it("should respond with an exception when order id is not correct ObjectId", () => {
        return request(app.getHttpServer())
          .put(URL + "/abc/5de3e0a388e99a666e8ee8ad")
          .send()
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(400)
          .expect({
            statusCode: 400,
            error: "Bad Request",
            message: "Requested id is not ObjectId."
          });
      });

      it("should respond with an exception when order id doesn't exists", () => {
        return request(app.getHttpServer())
          .put(URL + "/5e2d9e9b3613deeb0056f905/5de3e0a388e99a666e8ee8ad")
          .send()
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(404)
          .expect({
            statusCode: 404,
            error: "Not Found",
            message:
              "Order with requested id 5e2d9e9b3613deeb0056f905 doesn't exists"
          });
      });

      it("should respond with an exception when product id is not correct ObjectId", () => {
        return request(app.getHttpServer())
          .put(URL + "/5e01c779d893e6938c118879/abc")
          .send()
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(400)
          .expect({
            statusCode: 400,
            error: "Bad Request",
            message: "Requested id is not ObjectId."
          });
      });

      it("should respond with and exception when product id doesn't exists", () => {
        return request(app.getHttpServer())
          .put(URL + "/5e01c779d893e6938c118879/5e2d9d218dfc7e3b5456fc3f")
          .send()
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(404)
          .expect({
            statusCode: 404,
            error: "Not Found",
            message: "There is no product exists with requested id."
          });
      });
    });

    describe("/commerce/:orderId/:productId (DELETE)", () => {
      it("should be possible to remove just one product", done => {
        return request(app.getHttpServer())
          .delete(URL + "/5e01c779d893e6938c118879/5de3e0a388e99a666e8ee8ad")
          .send()
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(201)
          .end((err, { body }) => {
            expect(body.products).toEqual([
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
              }
            ]);
            return done();
          });
      });

      it("should respond with an exception when order id is not correct ObjectId", () => {
        return request(app.getHttpServer())
          .delete(URL + "/abc/5de3e0a388e99a666e8ee8ad")
          .send()
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(400)
          .expect({
            statusCode: 400,
            error: "Bad Request",
            message: "Requested id is not ObjectId."
          });
      });

      it("should respond with an exception when order id doesn't exists", () => {
        return request(app.getHttpServer())
          .delete(URL + "/5e2d9e9b3613deeb0056f905/5de3e0a388e99a666e8ee8ad")
          .send()
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(404)
          .expect({
            statusCode: 404,
            error: "Not Found",
            message:
              "Order with requested id 5e2d9e9b3613deeb0056f905 doesn't exists"
          });
      });

      it("should respond with an exception when product id is not correct ObjectId", () => {
        return request(app.getHttpServer())
          .delete(URL + "/5e01c779d893e6938c118879/abc")
          .send()
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(400)
          .expect({
            statusCode: 400,
            error: "Bad Request",
            message: "Requested id is not ObjectId."
          });
      });

      it("should respond with and exception when product id doesn't exists", () => {
        return request(app.getHttpServer())
          .delete(URL + "/5e01c779d893e6938c118879/5e2d9d218dfc7e3b5456fc3f")
          .send()
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(404)
          .expect({
            statusCode: 404,
            error: "Not Found",
            message: "There is no product exists with requested id."
          });
      });
    });
  });

  describe("access rights - own", () => {
    let auth: AuthSignInResponseDto;

    beforeEach(async () => {
      auth = await request(app.getHttpServer())
        .post("/auth")
        .send(
          new AuthSignInRequestDto({
            email: "tonda@zakaznik.cz",
            password: "12345"
          })
        )
        .then(res => res.body);
    });

    describe("/commerce/order (GET)", () => {
      it("should be possible to get all own orders", async () => {
        return await request(app.getHttpServer())
          .get("/commerce/order?skip=0")
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(200)
          .expect([
            {
              "createdAt": "Sun Dec 29 2019 11:28:46 GMT+0100 (CET)",
              "id": "5e03379ad2e5526d3d8eb277",
              "process": "paid",
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
                }
              ],
              "user": {
                "email": "tonda@zakaznik.cz",
                "forname": "Tonda",
                "id": "5e021cc4b0d0a6bd5f64b67c",
                "l10n": [],
"roles": [
                  "5e021e7c909b5abd8afb0ba5"
                ],
                "surname": "Zakaznik"
              }
            }
          ]);
      });
    });

    describe("/commerce/order/:id (GET)", () => {
      it("should not be possible to get not own by id", async () => {
        return await request(app.getHttpServer())
          .get("/commerce/order/5e01c779d893e6938c118879")
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(404)
          .expect({
            statusCode: 404,
            error: "Not Found",
            message:
              "Order with userId of 5e021cc4b0d0a6bd5f64b67c and id of 5e01c779d893e6938c118879 doesn't exist."
          });
      });

      it("should be possible to get own by id", async () => {
        return await request(app.getHttpServer())
          .get("/commerce/order/5e03379ad2e5526d3d8eb277")
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(200)
          .expect({
            "createdAt": "Sun Dec 29 2019 11:28:46 GMT+0100 (CET)",
            "id": "5e03379ad2e5526d3d8eb277",
            "process": "paid",
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
                "description": "This is mock description EN",
                "id": "5de3e0a388e99a666e8ee8ab",
                "images": [{
                  "alt": "This is alt of image",
                  "src": "https://picsum.photos/200/300"
                }],
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
              }
            ],
            "user": {
              "email": "tonda@zakaznik.cz",
              "forname": "Tonda",
              "id": "5e021cc4b0d0a6bd5f64b67c",
              "l10n": [],
"roles": ["5e021e7c909b5abd8afb0ba5"],
              "surname": "Zakaznik"
            }
          });
      });
    });

    describe("/commerce/order (POST)", () => {
      let createOrderRequestDto: CreateOrderRequest;

      beforeEach(() => {
        const Mock = Reflect.getMetadata(MOCK_TOKEN, CreateOrderRequest);
        createOrderRequestDto = new Mock();
      });

      it("should be possible to create own order", done => {
        return request(app.getHttpServer())
          .post(URL)
          .send({
            products: ["5de3e0a388e99a666e8ee8ad"]
          })
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(201)
          .end((err, { body }) => {
            expect(body.user).toEqual({
              "email": "tonda@zakaznik.cz",
              "forname": "Tonda",
              "id": "5e021cc4b0d0a6bd5f64b67c",
              "l10n": [],
"roles": [
                "5e021e7c909b5abd8afb0ba5"
              ],
              "surname": "Zakaznik"
            });
            expect(body.products).toEqual([
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
              }
            ]);
            return done();
          });
      });
    });

    describe("/commerce/order/:id (DELETE)", () => {
      it("should not be possible to delete own order", () => {
        return request(app.getHttpServer())
          .delete(`/commerce/order/5e01c779d893e6938c118879`)
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(403)
          .expect({
            statusCode: 403,
            error: "Forbidden",
            message: "Forbidden resource"
          });
      });
    });

    describe("/commerce/order/:id (PUT)", () => {
      // This is due to situation that when order is made it cannot be update by customer
      it("should not be possible to update own order", done => {
        return request(app.getHttpServer())
          .put(URL + "/5e01c779d893e6938c118879")
          .send({ products: ["5de3e0a388e99a666e8ee8ab"] })
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(403)
          .end((err, { body }) => {
            expect(body).toEqual({
              "statusCode": 403,
              "error": "Forbidden",
              "message": "Forbidden resource"
            });
            return done();
          });
      });
    });

    describe("/commerce/:orderId/:productId (DELETE)", () => {
      it("should not be possible to remove from own order just one product", () => {
        request(app.getHttpServer())
          .delete(URL + "/5e01c779d893e6938c118879/5de3e0a388e99a666e8ee8ad")
          .send()
          .set("Authorization", `Bearer ${auth.token}`)
          .expect(403)
          .expect({
            statusCode: 403,
            error: "Forbidden",
            message: "Forbidden resource"
          });
      });
    });
  });
});
