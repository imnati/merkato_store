require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("../models/Product");
const connectDB = require("./db");

const products = [
  { name: "AcousticMax Pro ANC Wireless Headphones", nameAm: "አኮስቲክማክስ ፕሮ ሽቦ አልባ የጆሮ ማዳመጫ", nameAr: "سماعات أذن لاسلكية أكوستيك ماكس برو", brand: "AlphaSonic Labs", category: "Electronics", price: 25.0, discountPrice: null, sku: "MK-EL-HDP-092", images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=800&q=80", "🎵", "🔋"], stock: 50, status: "In Stock", isFeatured: true },
  { name: "M2 Ultra Pro Laptop 16-inch", nameAm: "ኤም2 አልትራ ፕሮ ላፕቶፕ 16-ኢንች", nameAr: "كمبيوتر محمول إم 2 أولترا برو 16 بوصة", brand: "Compute Core", category: "Electronics", price: 1250.0, discountPrice: null, sku: "MK-EL-LAP-402", images: ["https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&w=800&q=80", "🖥️", "🎛️"], stock: 8, status: "Low Stock", isFeatured: false },
  { name: "Classic Denim Lightweight Casual Jacket", nameAm: "ክላሲክ ዴኒም ቀላል ክብደት ጃኬት", nameAr: "جاكيت جينز كلاسيكي خفيف الوزن", brand: "VogueFit", category: "Fashion & clothing", price: 150.0, discountPrice: 120.0, sku: "MK-FA-JKT-103", images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=80", "👕", "👔"], stock: 30, status: "In Stock", isFeatured: true },
  { name: "Urban Streetwear Slim-Fit Cargo Pants", nameAm: "የከተማ ዘመናዊ ስሊም-ፊት ካርጎ ሱሪ", nameAr: "بنطال كارغو ضيق عصري", brand: "VogueFit", category: "Fashion & clothing", price: 95.0, discountPrice: 79.0, sku: "MK-FA-PNT-106", images: ["https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=800&q=80", "👟", "🎒"], stock: 40, status: "In Stock", isFeatured: true },
  { name: "Organic Arabica Coffee Beans (1KG Bag)", nameAm: "ኦርጋኒክ የአረቢካ ቡና ፍሬ (1 ኪሎ)", nameAr: "حبوب بن عربية عضوية (حقيبة 1 كجم)", brand: "HararGold", category: "Groceries", price: 12.5, discountPrice: null, sku: "MK-GR-COF-881", images: ["https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=800&q=80", "🌱", "📦"], stock: 100, status: "In Stock", isFeatured: true },
  { name: "Premium Cold-Pressed Extra Virgin Olive Oil", nameAm: "ፕሪሚየም የወይራ ዘይት (Cold-Pressed)", nameAr: "زيت زيتون بكر ممتاز معصور على البارد", brand: "Mediterranean", category: "Groceries", price: 18.5, discountPrice: null, sku: "MK-GR-OIL-887", images: ["https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80", "🥗", "🍯"], stock: 75, status: "In Stock", isFeatured: false },
  { name: "Hydrating Hyaluronic Acid Facial Serum", nameAm: "የፊት እርጥበት መጠበቂያ ሴረም (Serum)", nameAr: "سيروم الهيالورونيك لترطيب الوجه", brand: "GlowGlow", category: "Beauty products", price: 45.0, discountPrice: 38.0, sku: "MK-BT-SER-505", images: ["https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=800&q=80", "💧", "🧪"], stock: 0, status: "Out of Stock", isFeatured: true },
  { name: "Rejuvenating Vitamin C Brightening Cream", nameAm: "ቪታሚን ሲ የፊት ማሳመሪያ ክሬም", nameAr: "كريم تفتيح البشرة بفيتامين سي", brand: "GlowGlow", category: "Beauty products", price: 55.0, discountPrice: 49.0, sku: "MK-BT-CRM-508", images: ["https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=800&q=80", "✨", "☀️"], stock: 60, status: "In Stock", isFeatured: true },
  { name: "UltraClean Robotic Vacuum & Mop Console", nameAm: "አልትራክሊን ሮቦቲክ የቤት ማጽጃ ማሽን", nameAr: "مكنسة وممسحة روبوتية ألترا كلين", brand: "HomeBot", category: "Household items", price: 899.0, discountPrice: 749.0, sku: "MK-HH-VAC-909", images: ["https://images.unsplash.com/photo-1558002038-1055907df827?auto=format&fit=crop&w=800&q=80", "🤖", "🏠"], stock: 20, status: "In Stock", isFeatured: true },
  { name: "Ergonomic Memory Foam Orthopedic Pillow", nameAm: "ኤርጎኖሚክ የአንገትና ትራስ ማስታገሻ ትራስ", nameAr: "وسادة طبية ميموري فوم مريحة", brand: "RestEasy", category: "Household items", price: 8.3333333333, discountPrice: null, sku: "MK-HH-PIL-910", images: ["https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=800&q=80", "💤", "☁️"], stock: 45, status: "In Stock", isFeatured: false },
  { name: "Titanium Sports Smartwatch v4", nameAm: "ቲታኒየም የስፖርት ስማርት ሰዓት v4", nameAr: "ساعة ذكية رياضية من التيتانيوم الإصدار 4", brand: "ChronoTech", category: "Accessories", price: 16.6666666667, discountPrice: null, sku: "MK-AC-WTC-711", images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=800&q=80", "🏃", "💓"], stock: 12, status: "Low Stock", isFeatured: true },
  { name: "Classic Polarized Aviator Sunglasses", nameAm: "ክላሲክ ፖላራይዝድ የፀሐይ መነጽር", nameAr: "نظارات شمسية طيار كلاسيكية مستقطبة", brand: "VogueFit", category: "Accessories", price: 6.6666666667, discountPrice: null, sku: "MK-AC-SUN-712", images: ["https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=800&q=80", "☀️", "🏖️"], stock: 35, status: "In Stock", isFeatured: true },
];

const seed = async () => {
  await connectDB();
  await Product.deleteMany();
  await Product.insertMany(products);
  console.log("12 products seeded successfully");
  process.exit();
};

seed();
