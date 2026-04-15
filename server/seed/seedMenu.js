import mongoose from 'mongoose';
import dotenv from 'dotenv';
import MenuItem from '../models/MenuItem.js';

dotenv.config();

const sampleItems = [
  {
    name: "Crispy Spring Rolls",
    price: 199,
    description: "Golden fried rolls stuffed with fresh vegetables and glass noodles, served with sweet chili sauce.",
    category: "starters",
    imageUrl: "https://images.unsplash.com/photo-1544025162-d760b29ce459?auto=format&fit=crop&q=80&w=600",
    available: true
  },
  {
    name: "Garlic Parmesan Wings",
    price: 299,
    description: "Six pieces of juicy chicken wings tossed in a rich garlic parmesan butter sauce.",
    category: "starters",
    imageUrl: "https://images.unsplash.com/photo-1563821033285-d7f0275811c7?auto=format&fit=crop&q=80&w=600",
    available: true
  },
  {
    name: "Loaded Nachos",
    price: 249,
    description: "Tortilla chips loaded with melted cheddar, jalapeños, black beans, and pico de gallo.",
    category: "starters",
    imageUrl: "https://images.unsplash.com/photo-1582169505937-b9992bd01ed9?auto=format&fit=crop&q=80&w=600",
    available: false // Sold out demo
  },
  
  {
    name: "Classic Cheeseburger",
    price: 399,
    description: "100% Angus beef patty topped with american cheese, lettuce, tomato, and our secret sauce on a brioche bun.",
    category: "mains",
    imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=600",
    available: true
  },
  {
    name: "Margherita Pizza",
    price: 449,
    description: "Authentic Neapolitan pizza with San Marzano tomato sauce, fresh mozzarella, and basil.",
    category: "mains",
    imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&q=80&w=600",
    available: true
  },
  {
    name: "Spicy Basil Noodles",
    price: 399,
    description: "Wok-tossed flat rice noodles with chili paste, thai basil, bell peppers, and chicken.",
    category: "mains",
    imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&q=80&w=600",
    available: true
  },
  {
    name: "Grilled Salmon Bowl",
    price: 499,
    description: "Perfectly grilled salmon fillet served over quinoa with roasted vegetables and lemon tahini dressing.",
    category: "mains",
    imageUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&q=80&w=600",
    available: true
  },

  {
    name: "Chocolate Lava Cake",
    price: 229,
    description: "Warm chocolate cake with a gooey molten center, dusted with powdered sugar.",
    category: "desserts",
    imageUrl: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?auto=format&fit=crop&q=80&w=600",
    available: true
  },
  {
    name: "New York Cheesecake",
    price: 249,
    description: "Classic creamy cheesecake with a graham cracker crust and berry compote.",
    category: "desserts",
    imageUrl: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&q=80&w=600",
    available: true
  },
  
  {
    name: "Mango Smoothie",
    price: 149,
    description: "Freshly blended ripe mangoes with a touch of honey and yogurt.",
    category: "drinks",
    imageUrl: "https://images.unsplash.com/photo-1546890975-7596e98cdbf1?auto=format&fit=crop&q=80&w=600",
    available: true
  },
  {
    name: "Iced Caramel Macchiato",
    price: 169,
    description: "Chilled espresso mixed with milk and vanilla syrup, topped with caramel drizzle.",
    category: "drinks",
    imageUrl: "https://images.unsplash.com/photo-1499961024600-ad094db32a66?auto=format&fit=crop&q=80&w=600",
    available: true
  },
  {
    name: "Fresh Lemonade",
    price: 99,
    description: "Classic thirst quencher made with freshly squeezed lemons.",
    category: "drinks",
    imageUrl: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&q=80&w=600",
    available: true
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('DB Connected for seeding...');
    
    await MenuItem.deleteMany();
    console.log('Old menu items cleared.');

    await MenuItem.insertMany(sampleItems);
    console.log('Database seeded with fresh menu items!');

    process.exit();
  } catch (err) {
    console.error('Failed to seed db:', err);
    process.exit(1);
  }
};

seedDB();
