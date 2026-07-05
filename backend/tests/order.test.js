import { jest } from '@jest/globals';
import Product from '../models/mongoose/product.model.js';
import Order from '../models/mongoose/order.model.js';
import orderController from '../controllers/order.controller.js';
import { connectTestDB, closeTestDB, clearTestDB } from './setup.js';

const mockRes = () => {
  const res = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

beforeAll(async () => {
  await connectTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

describe('Order Controller - Total Calculation', () => {

  test('createOrder correctly totals unique products', async () => {
    const p1 = await Product.create({ name: 'Item A', price: 100, description: 'First test item here' });
    const p2 = await Product.create({ name: 'Item B', price: 200, description: 'Second test item here' });

    const req = {
      body: { productIds: [p1._id.toString(), p2._id.toString()] },
      user: { id: 1 },
    };
    const res = mockRes();

    await orderController.createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    const order = res.json.mock.calls[0][0].data;
    expect(order.totalAmount).toBe(300); // 100 + 200
  });

  test('createOrder correctly doubles total when same product ordered twice', async () => {
    const p1 = await Product.create({ name: 'Repeated Item', price: 150, description: 'This item repeats twice' });

    const req = {
      body: { productIds: [p1._id.toString(), p1._id.toString()] }, // same product twice
      user: { id: 1 },
    };
    const res = mockRes();

    await orderController.createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    const order = res.json.mock.calls[0][0].data;
    expect(order.totalAmount).toBe(300); // 150 x 2, NOT 150 (deduped)
  });

  test('createOrder returns 404 if a product does not exist', async () => {
    const fakeId = '64a1f9c8e3f1a2b3c4d5e6f7';

    const req = {
      body: { productIds: [fakeId] },
      user: { id: 1 },
    };
    const res = mockRes();

    await orderController.createOrder(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
  });

  test('getOrderById blocks access to another user\'s order', async () => {
    const p1 = await Product.create({ name: 'Owned Item', price: 100, description: 'Belongs to user 1 only' });
    const order = await Order.create({ userId: 1, productIds: [p1._id], totalAmount: 100 });

    const req = {
      params: { orderId: order._id.toString() },
      user: { id: 2 }, // different user trying to access
    };
    const res = mockRes();

    await orderController.getOrderById(req, res);

    expect(res.status).toHaveBeenCalledWith(403);
  });

});