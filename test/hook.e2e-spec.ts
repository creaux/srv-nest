import { MemoryDb } from "./memory-db";
import { Test, TestingModule } from "@nestjs/testing";
import { ConfigService } from "../src/config/config.service";
import * as request from "supertest";
import { DataMockEntities } from "@pyxismedia/lib-model";
import { useContainer } from "class-validator";
import { StripePaymentModule } from "../src/store/payment/stripe-payment/stripe-payment.module";
import { stripeToken } from "nestjs-stripe/lib/constants";

describe("StripeWebhookController (e2e)", () => {
  let app: any;
  let db: MemoryDb;
  let dbUri: string;
  const URL = "/store/hook";
  let stripeSignature: string;
  let validStripeSignature: string = 't=1492774577,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd,v0=6ffbb59b2300aae63f272406069a9788598b792a944a07aba816edb039989a38';

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
      imports: [StripePaymentModule]
    })
      .overrideProvider(ConfigService)
      .useValue({
        get() {
          return dbUri;
        }
      })
      .overrideProvider(stripeToken)
      .useValue({
        webhooks: {
          constructEvent(payload: string | Buffer, header: string | Buffer | Array<string>, secret: string) {
            if (typeof header === 'undefined') {
              throw new Error('Unable to extract timestamp and signatures from header');
            }

            if (header !== validStripeSignature) {
              throw new Error('No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe? https://github.com/stripe/stripe-node#webhook-signing');
            }

            return payload;
          }
        }
      })
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    useContainer(app, { fallbackOnErrors: true });
  });

  it('should response with Bad Request when signature is undefined', () => {
    return request(app.getHttpServer())
      .post(URL)
      .expect(400)
      .expect({
        "error": "Bad Request",
        "message": "STRIPE API ERROR: Unable to extract timestamp and signatures from header",
        "statusCode": 400
      });
  });

  it('should response with bad request when signature doesn\'t exists', () => {
    stripeSignature = 't=1492774577,v1=5257a869e7ecebeda32affa62cdca3fa51cad7e77a0e56ff536d0ce8e108d8bd,v0=6ffbb59b2300aae63f272406069a9788598b792a944a07aba816edb039989a39';
    return request(app.getHttpServer())
      .post(URL)
      .set('Stripe-Signature', stripeSignature)
      .expect(400)
      .expect({
        "error": "Bad Request",
        "message": "STRIPE API ERROR: No signatures found matching the expected signature for payload. Are you passing the raw request body you received from Stripe? https://github.com/stripe/stripe-node#webhook-signing",
        "statusCode": 400
      });
  });

  it('should response 201 when payment_intent.created has been sent', () => {
    stripeSignature = 'abc';
    return request(app.getHttpServer())
      .post(URL)
      .send({
        "id": "evt_1G9Cq6IawEQOfiMAwmJyGHJQ",
        "object": "event",
        "api_version": "2019-12-03",
        "created": 1581005065,
        "data": {
          "object": {
            "id": "pi_1G9Cq5IawEQOfiMAoyvssgdH",
            "object": "payment_intent",
            "amount": 2000,
            "amount_capturable": 0,
            "amount_received": 0,
            "application": null,
            "application_fee_amount": null,
            "canceled_at": null,
            "cancellation_reason": null,
            "capture_method": "automatic",
            "charges": {
              "object": "list",
              "data": [
                {
                  "id": "ch_1G9Cq6IawEQOfiMAKfq4fo0x",
                  "object": "charge",
                  "amount": 2000,
                  "amount_refunded": 0,
                  "application": null,
                  "application_fee": null,
                  "application_fee_amount": null,
                  "balance_transaction": "txn_1G9Cq6IawEQOfiMA7tYt1Ebm",
                  "billing_details": {
                    "address": {
                      "city": null,
                      "country": null,
                      "line1": null,
                      "line2": null,
                      "postal_code": null,
                      "state": null
                    },
                    "email": null,
                    "name": null,
                    "phone": null
                  },
                  "captured": true,
                  "created": 1581005066,
                  "currency": "usd",
                  "customer": null,
                  "description": "(created by Stripe CLI)",
                  "destination": null,
                  "dispute": null,
                  "disputed": false,
                  "failure_code": null,
                  "failure_message": null,
                  "fraud_details": {},
                  "invoice": null,
                  "livemode": false,
                  "metadata": {},
                  "on_behalf_of": null,
                  "order": null,
                  "outcome": {
                    "network_status": "approved_by_network",
                    "reason": null,
                    "risk_level": "normal",
                    "risk_score": 2,
                    "seller_message": "Payment complete.",
                    "type": "authorized"
                  },
                  "paid": true,
                  "payment_intent": "pi_1G9Cq5IawEQOfiMAoyvssgdH",
                  "payment_method": "pm_1G9Cq5IawEQOfiMA6KoOgSUG",
                  "payment_method_details": {
                    "card": {
                      "brand": "visa",
                      "checks": {
                        "address_line1_check": null,
                        "address_postal_code_check": null,
                        "cvc_check": null
                      },
                      "country": "US",
                      "exp_month": 2,
                      "exp_year": 2021,
                      "fingerprint": "eiwiunk6ewSam3FY",
                      "funding": "credit",
                      "installments": null,
                      "last4": "4242",
                      "network": "visa",
                      "three_d_secure": null,
                      "wallet": null
                    },
                    "type": "card"
                  },
                  "receipt_email": null,
                  "receipt_number": null,
                  "receipt_url": "https://pay.stripe.com/receipts/acct_1G5xezIawEQOfiMA/ch_1G9Cq6IawEQOfiMAKfq4fo0x/rcpt_Gga0Q77npdku7CY09NcpVh1L1sYSJrW",
                  "refunded": false,
                  "refunds": {
                    "object": "list",
                    "data": [],
                    "has_more": false,
                    "total_count": 0,
                    "url": "/v1/charges/ch_1G9Cq6IawEQOfiMAKfq4fo0x/refunds"
                  },
                  "review": null,
                  "shipping": {
                    "address": {
                      "city": "San Francisco",
                      "country": "US",
                      "line1": "510 Townsend St",
                      "line2": null,
                      "postal_code": "94103",
                      "state": "CA"
                    },
                    "carrier": null,
                    "name": "Jenny Rosen",
                    "phone": null,
                    "tracking_number": null
                  },
                  "source": null,
                  "source_transfer": null,
                  "statement_descriptor": null,
                  "statement_descriptor_suffix": null,
                  "status": "succeeded",
                  "transfer_data": null,
                  "transfer_group": null
                }
              ],
              "has_more": false,
              "total_count": 1,
              "url": "/v1/charges?payment_intent=pi_1G9Cq5IawEQOfiMAoyvssgdH"
            },
            "client_secret": "pi_1G9Cq5IawEQOfiMAoyvssgdH_secret_1D4DMzDPdUgljvS91YUYIwx5k",
            "confirmation_method": "automatic",
            "created": 1581005065,
            "currency": "usd",
            "customer": null,
            "description": "(created by Stripe CLI)",
            "invoice": null,
            "last_payment_error": null,
            "livemode": false,
            "metadata": {},
            "next_action": null,
            "on_behalf_of": null,
            "payment_method": null,
            "payment_method_options": {
              "card": {
                "installments": null,
                "request_three_d_secure": "automatic"
              }
            },
            "payment_method_types": [
              "card"
            ],
            "receipt_email": null,
            "review": null,
            "setup_future_usage": null,
            "shipping": {
              "address": {
                "city": "San Francisco",
                "country": "US",
                "line1": "510 Townsend St",
                "line2": null,
                "postal_code": "94103",
                "state": "CA"
              },
              "carrier": null,
              "name": "Jenny Rosen",
              "phone": null,
              "tracking_number": null
            },
            "source": null,
            "statement_descriptor": null,
            "statement_descriptor_suffix": null,
            "status": "requires_payment_method",
            "transfer_data": null,
            "transfer_group": null
          }
        },
        "livemode": false,
        "pending_webhooks": 1,
        "request": {
          "id": "req_KxSONIavQKQteq",
          "idempotency_key": null
        },
        "type": "payment_intent.created"
      })
      .set('Stripe-Signature', validStripeSignature)
      .expect(201)
      .expect({
        received: true
      });
  });

  it('should response 201 when payment_intent.succeeded has been sent', () => {
    return request(app.getHttpServer())
      .post(URL)
      .send({
        "id": "evt_1G9D8kIawEQOfiMA6ErTBLk5",
        "object": "event",
        "api_version": "2019-12-03",
        "created": 1581006221,
        "data": {
          "object": {
            "id": "pi_1G9D8iIawEQOfiMANXX8D9HR",
            "object": "payment_intent",
            "amount": 2000,
            "amount_capturable": 0,
            "amount_received": 2000,
            "application": null,
            "application_fee_amount": null,
            "canceled_at": null,
            "cancellation_reason": null,
            "capture_method": "automatic",
            "charges": {
              "object": "list",
              "data": [
                {
                  "id": "ch_1G9D8jIawEQOfiMAF3DxH6IO",
                  "object": "charge",
                  "amount": 2000,
                  "amount_refunded": 0,
                  "application": null,
                  "application_fee": null,
                  "application_fee_amount": null,
                  "balance_transaction": "txn_1G9D8jIawEQOfiMAqtgUQh3H",
                  "billing_details": {
                    "address": {
                      "city": null,
                      "country": null,
                      "line1": null,
                      "line2": null,
                      "postal_code": null,
                      "state": null
                    },
                    "email": null,
                    "name": null,
                    "phone": null
                  },
                  "captured": true,
                  "created": 1581006221,
                  "currency": "usd",
                  "customer": null,
                  "description": "(created by Stripe CLI)",
                  "destination": null,
                  "dispute": null,
                  "disputed": false,
                  "failure_code": null,
                  "failure_message": null,
                  "fraud_details": {},
                  "invoice": null,
                  "livemode": false,
                  "metadata": {},
                  "on_behalf_of": null,
                  "order": null,
                  "outcome": {
                    "network_status": "approved_by_network",
                    "reason": null,
                    "risk_level": "normal",
                    "risk_score": 38,
                    "seller_message": "Payment complete.",
                    "type": "authorized"
                  },
                  "paid": true,
                  "payment_intent": "pi_1G9D8iIawEQOfiMANXX8D9HR",
                  "payment_method": "pm_1G9D8iIawEQOfiMA1ftgySNo",
                  "payment_method_details": {
                    "card": {
                      "brand": "visa",
                      "checks": {
                        "address_line1_check": null,
                        "address_postal_code_check": null,
                        "cvc_check": null
                      },
                      "country": "US",
                      "exp_month": 2,
                      "exp_year": 2021,
                      "fingerprint": "eiwiunk6ewSam3FY",
                      "funding": "credit",
                      "installments": null,
                      "last4": "4242",
                      "network": "visa",
                      "three_d_secure": null,
                      "wallet": null
                    },
                    "type": "card"
                  },
                  "receipt_email": null,
                  "receipt_number": null,
                  "receipt_url": "https://pay.stripe.com/receipts/acct_1G5xezIawEQOfiMA/ch_1G9D8jIawEQOfiMAF3DxH6IO/rcpt_GgaJcYi7QcrJVe6VmSnJuszNRaAKqNn",
                  "refunded": false,
                  "refunds": {
                    "object": "list",
                    "data": [],
                    "has_more": false,
                    "total_count": 0,
                    "url": "/v1/charges/ch_1G9D8jIawEQOfiMAF3DxH6IO/refunds"
                  },
                  "review": null,
                  "shipping": {
                    "address": {
                      "city": "San Francisco",
                      "country": "US",
                      "line1": "510 Townsend St",
                      "line2": null,
                      "postal_code": "94103",
                      "state": "CA"
                    },
                    "carrier": null,
                    "name": "Jenny Rosen",
                    "phone": null,
                    "tracking_number": null
                  },
                  "source": null,
                  "source_transfer": null,
                  "statement_descriptor": null,
                  "statement_descriptor_suffix": null,
                  "status": "succeeded",
                  "transfer_data": null,
                  "transfer_group": null
                }
              ],
              "has_more": false,
              "total_count": 1,
              "url": "/v1/charges?payment_intent=pi_1G9D8iIawEQOfiMANXX8D9HR"
            },
            "client_secret": "pi_1G9D8iIawEQOfiMANXX8D9HR_secret_h5vwSrYDxJnd4EhLbyxmBUhF0",
            "confirmation_method": "automatic",
            "created": 1581006220,
            "currency": "usd",
            "customer": null,
            "description": "(created by Stripe CLI)",
            "invoice": null,
            "last_payment_error": null,
            "livemode": false,
            "metadata": {
              "order_id": "5e01c779d893e6938c118879"
            },
            "next_action": null,
            "on_behalf_of": null,
            "payment_method": "pm_1G9D8iIawEQOfiMA1ftgySNo",
            "payment_method_options": {
              "card": {
                "installments": null,
                "request_three_d_secure": "automatic"
              }
            },
            "payment_method_types": [
              "card"
            ],
            "receipt_email": null,
            "review": null,
            "setup_future_usage": null,
            "shipping": {
              "address": {
                "city": "San Francisco",
                "country": "US",
                "line1": "510 Townsend St",
                "line2": null,
                "postal_code": "94103",
                "state": "CA"
              },
              "carrier": null,
              "name": "Jenny Rosen",
              "phone": null,
              "tracking_number": null
            },
            "source": null,
            "statement_descriptor": null,
            "statement_descriptor_suffix": null,
            "status": "succeeded",
            "transfer_data": null,
            "transfer_group": null
          }
        },
        "livemode": false,
        "pending_webhooks": 1,
        "request": {
          "id": "req_pjWAsp6Waou3pE",
          "idempotency_key": null
        },
        "type": "payment_intent.succeeded"
      })
      .set('Stripe-Signature', validStripeSignature)
      .expect(201)
      .expect({
        received: true
      });
  });

  it('should response with NotFoundException when payment_intent.succeeded sent incorrect order_id', () => {
    return request(app.getHttpServer())
      .post(URL)
      .send({
        "id": "evt_1G9D8kIawEQOfiMA6ErTBLk5",
        "object": "event",
        "api_version": "2019-12-03",
        "created": 1581006221,
        "data": {
          "object": {
            "id": "pi_1G9D8iIawEQOfiMANXX8D9HR",
            "object": "payment_intent",
            "amount": 2000,
            "amount_capturable": 0,
            "amount_received": 2000,
            "application": null,
            "application_fee_amount": null,
            "canceled_at": null,
            "cancellation_reason": null,
            "capture_method": "automatic",
            "charges": {
              "object": "list",
              "data": [
                {
                  "id": "ch_1G9D8jIawEQOfiMAF3DxH6IO",
                  "object": "charge",
                  "amount": 2000,
                  "amount_refunded": 0,
                  "application": null,
                  "application_fee": null,
                  "application_fee_amount": null,
                  "balance_transaction": "txn_1G9D8jIawEQOfiMAqtgUQh3H",
                  "billing_details": {
                    "address": {
                      "city": null,
                      "country": null,
                      "line1": null,
                      "line2": null,
                      "postal_code": null,
                      "state": null
                    },
                    "email": null,
                    "name": null,
                    "phone": null
                  },
                  "captured": true,
                  "created": 1581006221,
                  "currency": "usd",
                  "customer": null,
                  "description": "(created by Stripe CLI)",
                  "destination": null,
                  "dispute": null,
                  "disputed": false,
                  "failure_code": null,
                  "failure_message": null,
                  "fraud_details": {},
                  "invoice": null,
                  "livemode": false,
                  "metadata": {},
                  "on_behalf_of": null,
                  "order": null,
                  "outcome": {
                    "network_status": "approved_by_network",
                    "reason": null,
                    "risk_level": "normal",
                    "risk_score": 38,
                    "seller_message": "Payment complete.",
                    "type": "authorized"
                  },
                  "paid": true,
                  "payment_intent": "pi_1G9D8iIawEQOfiMANXX8D9HR",
                  "payment_method": "pm_1G9D8iIawEQOfiMA1ftgySNo",
                  "payment_method_details": {
                    "card": {
                      "brand": "visa",
                      "checks": {
                        "address_line1_check": null,
                        "address_postal_code_check": null,
                        "cvc_check": null
                      },
                      "country": "US",
                      "exp_month": 2,
                      "exp_year": 2021,
                      "fingerprint": "eiwiunk6ewSam3FY",
                      "funding": "credit",
                      "installments": null,
                      "last4": "4242",
                      "network": "visa",
                      "three_d_secure": null,
                      "wallet": null
                    },
                    "type": "card"
                  },
                  "receipt_email": null,
                  "receipt_number": null,
                  "receipt_url": "https://pay.stripe.com/receipts/acct_1G5xezIawEQOfiMA/ch_1G9D8jIawEQOfiMAF3DxH6IO/rcpt_GgaJcYi7QcrJVe6VmSnJuszNRaAKqNn",
                  "refunded": false,
                  "refunds": {
                    "object": "list",
                    "data": [],
                    "has_more": false,
                    "total_count": 0,
                    "url": "/v1/charges/ch_1G9D8jIawEQOfiMAF3DxH6IO/refunds"
                  },
                  "review": null,
                  "shipping": {
                    "address": {
                      "city": "San Francisco",
                      "country": "US",
                      "line1": "510 Townsend St",
                      "line2": null,
                      "postal_code": "94103",
                      "state": "CA"
                    },
                    "carrier": null,
                    "name": "Jenny Rosen",
                    "phone": null,
                    "tracking_number": null
                  },
                  "source": null,
                  "source_transfer": null,
                  "statement_descriptor": null,
                  "statement_descriptor_suffix": null,
                  "status": "succeeded",
                  "transfer_data": null,
                  "transfer_group": null
                }
              ],
              "has_more": false,
              "total_count": 1,
              "url": "/v1/charges?payment_intent=pi_1G9D8iIawEQOfiMANXX8D9HR"
            },
            "client_secret": "pi_1G9D8iIawEQOfiMANXX8D9HR_secret_h5vwSrYDxJnd4EhLbyxmBUhF0",
            "confirmation_method": "automatic",
            "created": 1581006220,
            "currency": "usd",
            "customer": null,
            "description": "(created by Stripe CLI)",
            "invoice": null,
            "last_payment_error": null,
            "livemode": false,
            "metadata": {
              "order_id": "5e01c779d893e6938c118874"
            },
            "next_action": null,
            "on_behalf_of": null,
            "payment_method": "pm_1G9D8iIawEQOfiMA1ftgySNo",
            "payment_method_options": {
              "card": {
                "installments": null,
                "request_three_d_secure": "automatic"
              }
            },
            "payment_method_types": [
              "card"
            ],
            "receipt_email": null,
            "review": null,
            "setup_future_usage": null,
            "shipping": {
              "address": {
                "city": "San Francisco",
                "country": "US",
                "line1": "510 Townsend St",
                "line2": null,
                "postal_code": "94103",
                "state": "CA"
              },
              "carrier": null,
              "name": "Jenny Rosen",
              "phone": null,
              "tracking_number": null
            },
            "source": null,
            "statement_descriptor": null,
            "statement_descriptor_suffix": null,
            "status": "succeeded",
            "transfer_data": null,
            "transfer_group": null
          }
        },
        "livemode": false,
        "pending_webhooks": 1,
        "request": {
          "id": "req_pjWAsp6Waou3pE",
          "idempotency_key": null
        },
        "type": "payment_intent.succeeded"
      })
      .set('Stripe-Signature', validStripeSignature)
      .expect(404)
      .expect({
        "error": "Not Found",
        "message": "Order with requested id 5e01c779d893e6938c118874 doesn't exist.",
        "statusCode": 404
      });
  });
});
