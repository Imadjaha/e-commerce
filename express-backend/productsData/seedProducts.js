import dotenv from "dotenv";
import mongoose from "mongoose";
import Product from "../models/Product.js"; // Adjust path if needed

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

await Product.insertMany([
  {
    productName: "iPhone 14",
    description: `Experience the future of smartphones with the iPhone 14 Pro. Powered by the A16 Bionic chip, it delivers lightning-fast performance, incredible efficiency, and advanced computational photography. Featuring a stunning Super Retina XDR display with ProMotion, the iPhone 14 Pro introduces the Dynamic Island — a new way to interact with your device. With a powerful triple-camera system and cinematic mode in 4K, it’s built for creators, gamers, and professionals alike.

    Highlights:

    • 6.1-inch Super Retina XDR display with ProMotion  
    • A16 Bionic chip for unmatched speed and power  
    • 48MP main camera with ProRAW & Night Mode  
    • Dynamic Island and Always-On Display  
    • All-day battery life and MagSafe support  
    • Super Fast Charging`,
    price: 999,
    category: "Phones",
    images: [
      "./images/iphone-14/1.png",
      "./images/iphone-14/2.png",
      "./images/iphone-14/3.png",
      "./images/iphone-14/4.png",
    ],
  },
  {
    productName: "MacBook Pro",
    description: `Power, performance, and portability — reimagined. The 14-inch MacBook Pro with the M2 Pro chip is designed for professionals who demand the best. With a Liquid Retina XDR display, blazing-fast SSD, and an incredible 18-hour battery life, it's built for video editors, developers, and creatives on the move. Seamless integration with macOS and an enhanced thermal design make this a true pro-level machine.

Highlights:

 • Apple M2 Pro chip with up to 12-core CPU & 19-core GPU

 • 14.2-inch Liquid Retina XDR display

 • 16GB unified memory, 512GB SSD (configurable)

 • ProMotion & True Tone technologies

 • Up to 18 hours of battery life`,
    price: 1999,
    category: "Laptops",
    images: [
      "./images/macbook-pro-m2/1.png",
      "./images/macbook-pro-m2/2.png",
      "./images/macbook-pro-m2/3.png",
      "./images/macbook-pro-m2/4.png",
    ],
  },
  {
    productName: "AirPods Pro",
    description: `Redefining personal audio, the 2nd generation AirPods Pro offers next-level noise cancellation, Adaptive Transparency, and spatial audio that surrounds you in rich, immersive sound. Designed for all-day comfort, they feature a redesigned case with Precision Finding and MagSafe charging. Whether you're working, traveling, or relaxing, AirPods Pro deliver studio-quality sound in a compact, wireless form.

Highlights:

 • Active Noise Cancellation & Adaptive Transparency

 • Personalized Spatial Audio with dynamic head tracking

 • Up to 6 hours of listening time (30 hours with case)

 • MagSafe charging case with built-in speaker

 • Touch control for volume and media control`,
    price: 249,
    category: "Headphones",
    images: [
      "./images/airpods-pro/1.png",
      "./images/airpods-pro/2.png",
      "./images/airpods-pro/3.png",
      "./images/airpods-pro/4.png",
    ],
  },
]);

console.log("📦 Products seeded!");
process.exit();
