require("dotenv").config({ path: require("path").resolve(__dirname, "../\.env") });
const mongoose = require("mongoose");
const Product = require("./models/Product");
const User = require("./models/User");

const seedProducts = async () => {
  const products = [
    {
      id: "p1",
      name: "AcousticMax Pro ANC Wireless Headphones",
      brand: "AlphaSonic Labs",
      category: "Electronics",
      price: 349.0,
      discountPrice: 289.0,
      sku: "MK-EL-HDP-092",
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=400&h=400&fit=crop&auto=format",
      ],
      status: "In Stock",
      stockQuantity: 50,
    },
    {
      id: "p2",
      name: "M2 Ultra Pro Laptop 16-inch",
      brand: "Compute Core",
      category: "Electronics",
      price: 4500.0,
      discountPrice: null,
      sku: "MK-EL-LAP-402",
      images: [
        "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=400&h=400&fit=crop&auto=format",
      ],
      status: "Low Stock",
      stockQuantity: 5,
    },
    {
      id: "p3",
      name: "Classic Denim Lightweight Casual Jacket",
      brand: "VogueFit",
      category: "Fashion & clothing",
      price: 150.0,
      discountPrice: 120.0,
      sku: "MK-FA-JKT-103",
      images: [
        "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=400&fit=crop&auto=format",
      ],
      status: "In Stock",
      stockQuantity: 30,
    },
    {
      id: "p6",
      name: "Urban Streetwear Slim-Fit Cargo Pants",
      brand: "VogueFit",
      category: "Fashion & clothing",
      price: 95.0,
      discountPrice: 79.0,
      sku: "MK-FA-PNT-106",
      images: [
        "https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop&auto=format",
      ],
      status: "In Stock",
      stockQuantity: 25,
    },
    {
      id: "p4",
      name: "Organic Arabica Coffee Beans (1KG Bag)",
      brand: "HararGold",
      category: "Groceries",
      price: 34.0,
      discountPrice: 29.5,
      sku: "MK-GR-COF-881",
      images: [
        "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400&h=400&fit=crop&auto=format",
      ],
      status: "In Stock",
      stockQuantity: 100,
    },
    {
      id: "p7",
      name: "Premium Cold-Pressed Extra Virgin Olive Oil",
      brand: "Mediterranean",
      category: "Groceries",
      price: 18.5,
      discountPrice: null,
      sku: "MK-GR-OIL-887",
      images: [
        "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop&auto=format",
      ],
      status: "In Stock",
      stockQuantity: 75,
    },
    {
      id: "p5",
      name: "Hydrating Hyaluronic Acid Facial Serum",
      brand: "GlowGlow",
      category: "Beauty products",
      price: 45.0,
      discountPrice: 38.0,
      sku: "MK-BT-SER-505",
      images: [
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7de?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1570194065650-d99fb4b38d7b?w=400&h=400&fit=crop&auto=format",
      ],
      status: "Out of Stock",
      stockQuantity: 0,
    },
    {
      id: "p8",
      name: "Rejuvenating Vitamin C Brightening Cream",
      brand: "GlowGlow",
      category: "Beauty products",
      price: 55.0,
      discountPrice: 49.0,
      sku: "MK-BT-CRM-508",
      images: [
        "https://images.unsplash.com/photo-1570194065650-d99fb4b38d7b?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1620916566398-39f1143ab7de?w=400&h=400&fit=crop&auto=format",
      ],
      status: "In Stock",
      stockQuantity: 40,
    },
    {
      id: "p9",
      name: "UltraClean Robotic Vacuum & Mop Console",
      brand: "HomeBot",
      category: "Household items",
      price: 899.0,
      discountPrice: 749.0,
      sku: "MK-HH-VAC-909",
      images: [
        "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1583847267264-b14dc137f53d?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400&h=400&fit=crop&auto=format",
      ],
      status: "In Stock",
      stockQuantity: 15,
    },
    {
      id: "p10",
      name: "Ergonomic Memory Foam Orthopedic Pillow",
      brand: "RestEasy",
      category: "Household items",
      price: 65.0,
      discountPrice: null,
      sku: "MK-HH-PIL-910",
      images: [
        "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1592789705501-f9ae4278a9c9?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=400&h=400&fit=crop&auto=format",
      ],
      status: "In Stock",
      stockQuantity: 60,
    },
    {
      id: "p11",
      name: "Titanium Sports Smartwatch v4",
      brand: "ChronoTech",
      category: "Accessories",
      price: 399.0,
      discountPrice: 345.0,
      sku: "MK-AC-WTC-711",
      images: [
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1546868871-af0de0ae72be?w=400&h=400&fit=crop&auto=format",
      ],
      status: "Low Stock",
      stockQuantity: 8,
    },
    {
      id: "p12",
      name: "Classic Polarized Aviator Sunglasses",
      brand: "VogueFit",
      category: "Accessories",
      price: 110.0,
      discountPrice: 85.0,
      sku: "MK-AC-SUN-712",
      images: [
        "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&h=400&fit=crop&auto=format",
        "https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&h=400&fit=crop&auto=format",
      ],
      status: "In Stock",
      stockQuantity: 45,
    },
  ];

  try {
    await Product.deleteMany({});
    await Product.insertMany(products);
    console.log("Products seeded successfully");
  } catch (error) {
    console.error("Error seeding products:", error);
  }
};

const seedAdmin = async () => {
  try {
    const adminExists = await User.findOne({ email: "admin@merkato.com" });
    if (!adminExists) {
      await User.create({
        name: "Admin User",
        email: "admin@merkato.com",
        password: "123456",
        role: "admin",
        addresses: ["Dubai Marina, UAE"],
      });
      console.log("Admin user created: admin@merkato.com / 123456");
    }
  } catch (error) {
    console.error("Error seeding admin:", error);
  }
};

const seed = async () => {
  await seedProducts();
  await seedAdmin();
  process.exit(0);
};

module.exports = { seed };

if (require.main === module) {
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => seed())
    .catch((err) => { console.error(err); process.exit(1); });
}
