import { jest } from '@jest/globals';
import Product from '../models/mongoose/product.model.js';
import productController from '../controllers/product.controller.js';
import { connectTestDB, closeTestDB, clearTestDB } from './setup.js';

// Helper to mock req/res like Express would provide
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

describe('Product Controller', () => {

  test('addProduct creates a product successfully', async () => {
    const req = {
      body: { name: 'Test Laptop', price: 50000, description: 'A great laptop for testing purposes' },
    };
    const res = mockRes();

    await productController.addProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        data: expect.objectContaining({ name: 'Test Laptop', price: 50000 }),
      })
    );

    const savedProduct = await Product.findOne({ name: 'Test Laptop' });
    expect(savedProduct).not.toBeNull();
  });

  test('getAllProducts returns all products sorted by newest first', async () => {
    await Product.create({ name: 'Old Product', price: 100, description: 'This is an old product' });
    await Product.create({ name: 'New Product', price: 200, description: 'This is a new product' });

    const req = {};
    const res = mockRes();

    await productController.getAllProducts(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const responseData = res.json.mock.calls[0][0].data;
    expect(responseData).toHaveLength(2);
    expect(responseData[0].name).toBe('New Product'); // newest first
  });

  test('getProductById returns 404 for non-existent product', async () => {
    const fakeId = '64a1f9c8e3f1a2b3c4d5e6f7'; // valid ObjectId format, doesn't exist
    const req = { params: { productId: fakeId } };
    const res = mockRes();

    await productController.getProductById(req, res);

    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false, message: 'Product not found' })
    );
  });

  test('updateProduct only updates provided fields', async () => {
    const product = await Product.create({ name: 'Original', price: 100, description: 'Original description here' });

    const req = {
      params: { productId: product._id.toString() },
      body: { price: 150 }, // only updating price
    };
    const res = mockRes();

    await productController.updateProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const updated = await Product.findById(product._id);
    expect(updated.price).toBe(150);
    expect(updated.name).toBe('Original'); // unchanged
  });

  test('deleteProduct removes the product from database', async () => {
    const product = await Product.create({ name: 'To Delete', price: 100, description: 'This will be deleted' });

    const req = { params: { productId: product._id.toString() } };
    const res = mockRes();

    await productController.deleteProduct(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    const deleted = await Product.findById(product._id);
    expect(deleted).toBeNull();
  });

});