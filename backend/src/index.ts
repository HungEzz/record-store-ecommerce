import express, { Request, Response } from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// GET all products
app.get('/api/products', async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const filter = category ? { category: String(category) } : {};
    const products = await prisma.product.findMany({ where: filter });
    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// GET product by id
app.get('/api/products/:id', async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      res.status(404).json({ message: 'Product not found' });
      return;
    }
    res.json(product);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// POST checkout
app.post('/api/orders/checkout', async (req: Request, res: Response) => {
  const { customerEmail, customerPhone, shippingAddr, items } = req.body;

  if (!items || !items.length) {
    res.status(400).json({ message: 'Cart is empty' });
    return;
  }

  try {
    // Start Transaction
    const order = await prisma.$transaction(async (tx) => {
      let totalAmount = 0;
      const orderItemsData = [];

      for (const item of items) {
        // Fetch product with lock for update if needed, but Prisma will just do simple select here
        const product = await tx.product.findUnique({
          where: { id: item.id }
        });

        if (!product) {
          throw new Error(`Product ID ${item.id} not found`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Not enough stock for ${product.title}`);
        }

        // Deduct stock
        await tx.product.update({
          where: { id: product.id },
          data: { stock: { decrement: item.quantity } }
        });

        totalAmount += product.price * item.quantity;
        orderItemsData.push({
          productId: product.id,
          quantity: item.quantity,
          priceAtTime: product.price
        });
      }

      // Create order
      return await tx.order.create({
        data: {
          customerEmail,
          customerPhone,
          shippingAddr,
          totalAmount,
          status: 'PENDING',
          orderItems: {
            create: orderItemsData
          }
        },
        include: {
          orderItems: true
        }
      });
    });

    res.status(201).json({ message: 'Order created successfully', order });
  } catch (error: any) {
    console.error(error);
    res.status(400).json({ message: error.message || 'Checkout failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
