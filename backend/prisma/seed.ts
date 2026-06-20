import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ─── Create Admin User ──────────────────────────────────
  const adminPassword = await bcrypt.hash('Admin@123456', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@textileshop.com' },
    update: {},
    create: {
      email: 'admin@textileshop.com',
      passwordHash: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      phone: '+94771234567',
      role: UserRole.ADMIN,
    },
  });
  console.log(`✅ Admin user created: ${admin.email}`);

  // ─── Create Test Customer ───────────────────────────────
  const customerPassword = await bcrypt.hash('Customer@123456', 12);
  const customer = await prisma.user.upsert({
    where: { email: 'customer@example.com' },
    update: {},
    create: {
      email: 'customer@example.com',
      passwordHash: customerPassword,
      firstName: 'John',
      lastName: 'Doe',
      phone: '+94779876543',
      role: UserRole.CUSTOMER,
    },
  });
  console.log(`✅ Customer user created: ${customer.email}`);

  // ─── Create Categories ──────────────────────────────────
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'cotton-fabrics' },
      update: {},
      create: {
        name: 'Cotton Fabrics',
        slug: 'cotton-fabrics',
        description: 'Premium quality cotton fabrics for all occasions',
        imageUrl: '/images/categories/cotton.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'silk-fabrics' },
      update: {},
      create: {
        name: 'Silk Fabrics',
        slug: 'silk-fabrics',
        description: 'Luxurious silk fabrics with elegant patterns',
        imageUrl: '/images/categories/silk.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'linen-fabrics' },
      update: {},
      create: {
        name: 'Linen Fabrics',
        slug: 'linen-fabrics',
        description: 'Breathable linen fabrics perfect for warm weather',
        imageUrl: '/images/categories/linen.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'polyester-blends' },
      update: {},
      create: {
        name: 'Polyester Blends',
        slug: 'polyester-blends',
        description: 'Durable polyester blend fabrics for everyday use',
        imageUrl: '/images/categories/polyester.jpg',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'denim' },
      update: {},
      create: {
        name: 'Denim',
        slug: 'denim',
        description: 'High-quality denim fabrics in various weights',
        imageUrl: '/images/categories/denim.jpg',
      },
    }),
  ]);
  console.log(`✅ ${categories.length} categories created`);

  // ─── Create Products ────────────────────────────────────
  const products = [
    {
      name: 'Premium Egyptian Cotton',
      slug: 'premium-egyptian-cotton',
      description: 'Ultra-soft 100% Egyptian cotton fabric. 60-inch width, ideal for premium shirts and bedding. Features a luxurious 400 thread count with a silky smooth finish.',
      price: 24.99,
      compareAtPrice: 34.99,
      stockQuantity: 150,
      sku: 'CTN-EGY-001',
      images: ['/images/products/egyptian-cotton-1.jpg', '/images/products/egyptian-cotton-2.jpg'],
      attributes: { color: 'White', fabricType: 'Cotton', gsm: 150, width: '60 inch', pattern: 'Plain' },
      categoryId: categories[0].id,
    },
    {
      name: 'Organic Cotton Voile',
      slug: 'organic-cotton-voile',
      description: 'Lightweight organic cotton voile. GOTS certified, perfect for summer dresses and curtains. Sheer and breathable with a beautiful drape.',
      price: 18.50,
      compareAtPrice: 25.00,
      stockQuantity: 200,
      sku: 'CTN-ORG-002',
      images: ['/images/products/organic-voile-1.jpg'],
      attributes: { color: 'Natural', fabricType: 'Cotton', gsm: 80, width: '54 inch', pattern: 'Plain' },
      categoryId: categories[0].id,
    },
    {
      name: 'Mulberry Silk Charmeuse',
      slug: 'mulberry-silk-charmeuse',
      description: 'Grade 6A mulberry silk charmeuse. Luxurious drape with a stunning sheen. Perfect for evening wear, blouses, and luxury accessories.',
      price: 89.99,
      compareAtPrice: 120.00,
      stockQuantity: 50,
      sku: 'SLK-MUL-001',
      images: ['/images/products/silk-charmeuse-1.jpg', '/images/products/silk-charmeuse-2.jpg'],
      attributes: { color: 'Champagne', fabricType: 'Silk', gsm: 120, width: '45 inch', pattern: 'Plain' },
      categoryId: categories[1].id,
    },
    {
      name: 'Dupioni Silk',
      slug: 'dupioni-silk',
      description: 'Rich dupioni silk with characteristic slubbed texture. Creates structured garments with a luxurious appearance. Ideal for formal wear and home décor.',
      price: 65.00,
      stockQuantity: 75,
      sku: 'SLK-DUP-002',
      images: ['/images/products/dupioni-silk-1.jpg'],
      attributes: { color: 'Royal Blue', fabricType: 'Silk', gsm: 95, width: '54 inch', pattern: 'Textured' },
      categoryId: categories[1].id,
    },
    {
      name: 'Belgian Linen',
      slug: 'belgian-linen',
      description: 'Premium Belgian linen fabric. Pre-washed for softness with natural texture. Perfect for suits, trousers, and upholstery.',
      price: 42.00,
      compareAtPrice: 55.00,
      stockQuantity: 120,
      sku: 'LIN-BEL-001',
      images: ['/images/products/belgian-linen-1.jpg', '/images/products/belgian-linen-2.jpg'],
      attributes: { color: 'Oatmeal', fabricType: 'Linen', gsm: 180, width: '58 inch', pattern: 'Plain' },
      categoryId: categories[2].id,
    },
    {
      name: 'Irish Linen Blend',
      slug: 'irish-linen-blend',
      description: 'Classic Irish linen blend (85% linen, 15% cotton). Offers the crispness of linen with added softness. Wrinkle-resistant finish.',
      price: 38.00,
      stockQuantity: 90,
      sku: 'LIN-IRS-002',
      images: ['/images/products/irish-linen-1.jpg'],
      attributes: { color: 'Sky Blue', fabricType: 'Linen Blend', gsm: 160, width: '56 inch', pattern: 'Plain' },
      categoryId: categories[2].id,
    },
    {
      name: 'Performance Poly-Cotton',
      slug: 'performance-poly-cotton',
      description: 'Technical poly-cotton blend with moisture-wicking properties. Wrinkle-free and colorfast. Great for uniforms and workwear.',
      price: 15.99,
      compareAtPrice: 22.00,
      stockQuantity: 300,
      sku: 'PLY-PCT-001',
      images: ['/images/products/poly-cotton-1.jpg'],
      attributes: { color: 'Navy', fabricType: 'Polyester/Cotton', gsm: 200, width: '60 inch', pattern: 'Twill' },
      categoryId: categories[3].id,
    },
    {
      name: 'Stretch Poly Crepe',
      slug: 'stretch-poly-crepe',
      description: 'Versatile stretch polyester crepe. 4-way stretch with excellent recovery. Ideal for dresses, skirts, and professional attire.',
      price: 19.50,
      stockQuantity: 180,
      sku: 'PLY-CRP-002',
      images: ['/images/products/poly-crepe-1.jpg'],
      attributes: { color: 'Black', fabricType: 'Polyester', gsm: 140, width: '58 inch', pattern: 'Crepe' },
      categoryId: categories[3].id,
    },
    {
      name: 'Selvedge Raw Denim',
      slug: 'selvedge-raw-denim',
      description: 'Japanese selvedge raw denim, 14oz weight. Unwashed with beautiful fading potential. Premium quality for jeans and jackets.',
      price: 35.00,
      compareAtPrice: 48.00,
      stockQuantity: 100,
      sku: 'DNM-SEL-001',
      images: ['/images/products/selvedge-denim-1.jpg', '/images/products/selvedge-denim-2.jpg'],
      attributes: { color: 'Indigo', fabricType: 'Denim', gsm: 400, width: '34 inch', pattern: 'Twill' },
      categoryId: categories[4].id,
    },
    {
      name: 'Stretch Denim',
      slug: 'stretch-denim',
      description: 'Comfortable stretch denim with 2% elastane. Soft hand feel with modern stretch. Perfect for jeans, skirts, and casual wear.',
      price: 22.00,
      stockQuantity: 250,
      sku: 'DNM-STR-002',
      images: ['/images/products/stretch-denim-1.jpg'],
      attributes: { color: 'Medium Wash', fabricType: 'Denim', gsm: 320, width: '58 inch', pattern: 'Twill' },
      categoryId: categories[4].id,
    },
    {
      name: 'Chambray Cotton',
      slug: 'chambray-cotton',
      description: 'Lightweight chambray cotton with a beautiful cross-weave. Versatile fabric suitable for shirts, dresses, and light jackets.',
      price: 16.99,
      compareAtPrice: 24.00,
      stockQuantity: 175,
      sku: 'CTN-CHM-003',
      images: ['/images/products/chambray-1.jpg'],
      attributes: { color: 'Light Blue', fabricType: 'Cotton', gsm: 130, width: '56 inch', pattern: 'Chambray' },
      categoryId: categories[0].id,
    },
    {
      name: 'Velvet Polyester',
      slug: 'velvet-polyester',
      description: 'Luxurious crushed velvet in rich color. Perfect for upholstery, evening wear, and decorative pillows. Soft to touch with beautiful light play.',
      price: 28.50,
      compareAtPrice: 38.00,
      stockQuantity: 80,
      sku: 'PLY-VLV-003',
      images: ['/images/products/velvet-1.jpg'],
      attributes: { color: 'Emerald Green', fabricType: 'Polyester', gsm: 280, width: '54 inch', pattern: 'Velvet' },
      categoryId: categories[3].id,
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { sku: product.sku },
      update: {},
      create: product,
    });
  }
  console.log(`✅ ${products.length} products created`);

  console.log('');
  console.log('🎉 Database seeded successfully!');
  console.log('');
  console.log('📋 Test Credentials:');
  console.log('   Admin:    admin@textileshop.com / Admin@123456');
  console.log('   Customer: customer@example.com / Customer@123456');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
