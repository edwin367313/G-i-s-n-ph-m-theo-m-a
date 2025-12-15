const request = require('supertest');

const app = require('../../backend/src/app');

describe('Product API Tests', () => {
  let authToken;
  let adminToken;
  let testProductId;

  beforeAll(async () => {
    // Login as customer
    const customerRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'nguyenvanan@gmail.com',
        password: '123456'
      });
    authToken = customerRes.body.data.token;

    // Login as admin
    const adminRes = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'admin@sieuthiabc.vn',
        password: '123456'
      });
    adminToken = adminRes.body.data.token;
  });

  describe('GET /api/products', () => {
    it('should get all products', async () => {
      const res = await request(app)
        .get('/api/products')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('products');
      expect(Array.isArray(res.body.data.products)).toBe(true);
      expect(res.body.data).toHaveProperty('pagination');
    });

    it('should filter products by category', async () => {
      const res = await request(app)
        .get('/api/products?category_id=1')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.products.every(p => p.category_id === 1)).toBe(true);
    });

    it('should search products by name', async () => {
      const res = await request(app)
        .get('/api/products?search=gạo')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.products.length).toBeGreaterThan(0);
    });

    it('should paginate products', async () => {
      const res = await request(app)
        .get('/api/products?page=1&limit=10')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.pagination.page).toBe(1);
      expect(res.body.data.pagination.limit).toBe(10);
    });

    it('should sort products by price', async () => {
      const res = await request(app)
        .get('/api/products?sort=price&order=asc')
        .expect(200);

      expect(res.body.success).toBe(true);
      const prices = res.body.data.products.map(p => p.price);
      expect(prices).toEqual([...prices].sort((a, b) => a - b));
    });
  });

  describe('GET /api/products/:id', () => {
    it('should get product by id', async () => {
      const res = await request(app)
        .get('/api/products/1')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data).toHaveProperty('name');
      expect(res.body.data).toHaveProperty('price');
    });

    it('should return 404 for non-existent product', async () => {
      const res = await request(app)
        .get('/api/products/99999')
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('POST /api/products (Admin only)', () => {
    it('should create product as admin', async () => {
      const newProduct = {
        name: 'Test Product',
        description: 'Test description',
        price: 50000,
        discount_percent: 10,
        stock: 100,
        category_id: 1,
        unit: 'Kg',
        images: JSON.stringify(['https://example.com/image.jpg'])
      };

      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(newProduct)
        .expect(201);

      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe(newProduct.name);
      testProductId = res.body.data.id;
    });

    it('should fail to create product as customer', async () => {
      const newProduct = {
        name: 'Test Product 2',
        price: 50000,
        category_id: 1
      };

      const res = await request(app)
        .post('/api/products')
        .set('Authorization', `Bearer ${authToken}`)
        .send(newProduct)
        .expect(403);

      expect(res.body.success).toBe(false);
    });

    it('should fail without authentication', async () => {
      const res = await request(app)
        .post('/api/products')
        .send({ name: 'Test' })
        .expect(401);

      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/products/:id (Admin only)', () => {
    it('should update product as admin', async () => {
      const updates = {
        price: 60000,
        stock: 150
      };

      const res = await request(app)
        .put(`/api/products/${testProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updates)
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.price).toBe(updates.price);
      expect(res.body.data.stock).toBe(updates.stock);
    });

    it('should fail to update as customer', async () => {
      const res = await request(app)
        .put(`/api/products/${testProductId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ price: 70000 })
        .expect(403);

      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/products/:id (Admin only)', () => {
    it('should delete product as admin', async () => {
      const res = await request(app)
        .delete(`/api/products/${testProductId}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .expect(200);

      expect(res.body.success).toBe(true);
    });

    it('should return 404 for deleted product', async () => {
      const res = await request(app)
        .get(`/api/products/${testProductId}`)
        .expect(404);

      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/products/featured', () => {
    it('should get featured products', async () => {
      const res = await request(app)
        .get('/api/products/featured')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(Array.isArray(res.body.data)).toBe(true);
    });
  });

  describe('GET /api/products/on-sale', () => {
    it('should get products on sale', async () => {
      const res = await request(app)
        .get('/api/products/on-sale')
        .expect(200);

      expect(res.body.success).toBe(true);
      expect(res.body.data.every(p => p.discount_percent > 0)).toBe(true);
    });
  });
});
