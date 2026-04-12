import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import dotenv from 'dotenv';

dotenv.config();
const connectionString = `${process.env.DATABASE_URL}`;

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

const ALL_PRODUCTS = [
  { id: 1, title: 'Abbey Road', artist: 'The Beatles', price: 29.99, imgUrl: 'https://placehold.co/600x600/ffffff/000000?text=Abbey+Road', category: 'vinyl', stock: 5 },
  { id: 2, title: 'Dark Side of the Moon', artist: 'Pink Floyd', price: 34.99, imgUrl: 'https://placehold.co/600x600/ffffff/000000?text=Dark+Side', category: 'vinyl', stock: 10 },
  { id: 3, title: 'Midnights', artist: 'Taylor Swift', price: 38.50, imgUrl: 'https://placehold.co/600x600/ffffff/000000?text=Midnights', category: 'vinyl', stock: 3 },
  { id: 4, title: 'Swimming', artist: 'Mac Miller', price: 35.00, imgUrl: 'https://placehold.co/600x600/ffffff/000000?text=Swimming', category: 'vinyl', stock: 8 },
  { id: 5, title: 'Blue Train', artist: 'John Coltrane', price: 28.00, imgUrl: 'https://placehold.co/600x600/ffffff/000000?text=Coltrane', category: 'vinyl', stock: 0 },
  { id: 6, title: 'Kind of Blue', artist: 'Miles Davis', price: 31.00, imgUrl: 'https://placehold.co/600x600/ffffff/000000?text=Miles', category: 'vinyl', stock: 12 },
  { id: 201, title: 'After Hours', artist: 'The Weeknd', price: 15.99, imgUrl: 'https://placehold.co/600x600/ffffff/000000?text=After+Hours', category: 'cd', stock: 7 },
  { id: 202, title: 'Future Nostalgia', artist: 'Dua Lipa', price: 14.50, imgUrl: 'https://placehold.co/600x600/ffffff/000000?text=Dua+Lipa', category: 'cd', stock: 4 },
  { id: 203, title: 'Sour', artist: 'Olivia Rodrigo', price: 13.99, imgUrl: 'https://placehold.co/600x600/ffffff/000000?text=Sour', category: 'cd', stock: 0 },
  { id: 204, title: 'Random Access Memories', artist: 'Daft Punk', price: 16.00, imgUrl: 'https://placehold.co/600x600/ffffff/000000?text=Daft+Punk', category: 'cd', stock: 9 },
  { id: 101, title: 'Classic Logo T-Shirt', artist: 'Record Store Exclusive', price: 25.00, imgUrl: 'https://placehold.co/600x600/ffffff/000000?text=T-Shirt', category: 'merch', stock: 15 },
  { id: 102, title: 'Cotton Tote Bag', artist: 'Eco-friendly', price: 15.00, imgUrl: 'https://placehold.co/600x600/ffffff/000000?text=Tote+Bag', category: 'merch', stock: 20 },
  { id: 103, title: 'Vinyl Cleaning Kit', artist: 'Premium Care', price: 20.00, imgUrl: 'https://placehold.co/600x600/ffffff/000000?text=Cleaning+Kit', category: 'merch', stock: 0 },
  { id: 104, title: 'Slipmat Set', artist: 'Turntable Essentials', price: 18.00, imgUrl: 'https://placehold.co/600x600/ffffff/000000?text=Slipmat', category: 'merch', stock: 10 },
  { id: 105, title: 'Logo Enamel Pin', artist: 'Accessories', price: 8.00, imgUrl: 'https://placehold.co/600x600/ffffff/000000?text=Pin', category: 'merch', stock: 25 },
  { id: 106, title: 'Record Display Frame', artist: 'Home Decor', price: 45.00, imgUrl: 'https://placehold.co/600x600/ffffff/000000?text=Frame', category: 'merch', stock: 3 },
];

async function main() {
  console.log('Start seeding...');
  await prisma.product.deleteMany(); // Clear existing
  for (const product of ALL_PRODUCTS) {
    await prisma.product.create({
      data: product,
    });
  }
  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
