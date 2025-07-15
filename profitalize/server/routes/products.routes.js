import { Router } from 'express';
import prisma from '../database/Prisma.js';

const prodRouter = Router();

// GET /api/v1/products - Retrieve all products
prodRouter.get('/', async (req, res) => {
  try {
    const products = await prisma.products.findMany({
      include: {
        category: true, // Include related category data
      },
    });
    res.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/v1/products/:id - Retrieve a single product
prodRouter.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const product = await prisma.products.findUnique({
      where: { product_id: parseInt(id) },
      include: {
        category: true,
      },
    });
    if (!product) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default prodRouter;