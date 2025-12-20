const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

// REPLACE WITH YOUR CONNECTION STRING
const MONGO_URI = process.env.MONGO_URI || "mongodb+srv://admin:password123@cluster0.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error(err));

const products = [
  // === VEGETABLES (Reverted to Unsplash where they worked, Fixed Broken ones) ===
  {
    name: "Fresh Spinach",
    category: "vegetables",
    price: 2.5,
    description: "Organic, farm-fresh spinach leaves rich in iron.",
    image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=300&q=80",
    stock: 50
  },
  {
    name: "Red Tomatoes",
    category: "vegetables",
    price: 1.2,
    description: "Juicy, ripe red tomatoes perfect for salads and cooking.",
    image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=300&q=80",
    stock: 100
  },
  {
    name: "Crisp Carrots",
    category: "vegetables",
    price: 1.8,
    description: "Crunchy orange carrots, sweet and perfect for snacking.",
    image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?auto=format&fit=crop&w=300&q=80",
    stock: 80
  },
  {
    name: "Green Broccoli", // <--- REVERTED TO WORKING UNSPLASH LINK
    category: "vegetables",
    price: 3.0,
    description: "Fresh green broccoli heads, full of vitamins.",
    image: "https://images.unsplash.com/photo-1459411621453-7b03977f4bfc?auto=format&fit=crop&w=300&q=80",
    stock: 40
  },
  {
    name: "Bell Peppers (Mix)", // <--- FIXED (Pexels)
    category: "vegetables",
    price: 2.2,
    description: "A colorful mix of red, yellow, and green bell peppers.",
    image: "https://freshby4roots.com/cdn/shop/files/Locally-grown-mixed-bell-peppers-4roots.webp?v=1724081569",
    stock: 60
  },
  {
    name: "Organic Potatoes",
    category: "vegetables",
    price: 1.0,
    description: "Earthy, versatile potatoes grown without pesticides.",
    image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655?auto=format&fit=crop&w=300&q=80",
    stock: 150
  },
  {
    name: "Red Onions",
    category: "vegetables",
    price: 1.5,
    description: "Sharp and flavorful red onions, essential for every kitchen.",
    image: "https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=300&q=80",
    stock: 120
  },
  {
    name: "Cucumber",
    category: "vegetables",
    price: 1.1,
    description: "Cool and refreshing cucumbers, great for salads.",
    image: "https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?auto=format&fit=crop&w=300&q=80",
    stock: 70
  },
  {
    name: "Eggplant (Brinjal)", // <--- FIXED (Pexels)
    category: "vegetables",
    price: 2.0,
    description: "Glossy purple eggplants, perfect for roasting or curries.",
    image: "https://images.pexels.com/photos/321551/pexels-photo-321551.jpeg?auto=compress&cs=tinysrgb&w=400",
    stock: 45
  },
  {
    name: "Cauliflower",
    category: "vegetables",
    price: 2.8,
    description: "Fresh white cauliflower heads.",
    image: "https://images.unsplash.com/photo-1568584711075-3d021a7c3ca3?auto=format&fit=crop&w=300&q=80",
    stock: 35
  },

  // === RAW POWDERS (Using High-Stability Pexels Links) ===
  {
    name: "Turmeric Powder", // <--- FIXED
    category: "powders",
    price: 4.5,
    description: "Pure organic turmeric with high curcumin content.",
    image: "https://images.pexels.com/photos/1340116/pexels-photo-1340116.jpeg?auto=compress&cs=tinysrgb&w=400",
    stock: 100
  },
  {
    name: "Chilli Powder", // <--- FIXED
    category: "powders",
    price: 5.0,
    description: "Spicy red chilli powder made from dried chillies.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdwJLNEjaZ7ub46CLiAcbVUwkfos6qmRgW2Q&s",
    stock: 90
  },
  {
    name: "Coriander Powder", // <--- FIXED
    category: "powders",
    price: 3.5,
    description: "Aromatic coriander powder, essential for curry bases.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRVY9V7p4IV12IHFr_RdaEKjT_SKElqctKBWg&s",
    stock: 85
  },
  {
    name: "Cumin Powder", // <--- FIXED (Using generic spice bowl to ensure load)
    category: "powders",
    price: 4.0,
    description: "Ground cumin seeds with a warm, earthy flavor.",
    image: "https://i.ebayimg.com/images/g/aTgAAOSwvtxdO5bs/s-l1200.jpg",
    stock: 80
  },
  {
    name: "Garam Masala", // <--- FIXED
    category: "powders",
    price: 6.0,
    description: "A premium blend of aromatic spices for authentic taste.",
    image: "https://twosleevers.com/wp-content/uploads/2013/08/Garam-Masala-1-500x500.jpg",
    stock: 60
  },
  {
    name: "Black Pepper Powder", // <--- FIXED
    category: "powders",
    price: 7.5,
    description: "Sharp and spicy crushed black pepper.",
    image: "https://i.ebayimg.com/images/g/BgcAAOSw8XpjkLMf/s-l1200.jpg",
    stock: 50
  },
  {
    name: "Ginger Powder", // <--- FIXED
    category: "powders",
    price: 4.8,
    description: "Dried ginger powder, great for tea and cooking.",
    image: "https://i.ebayimg.com/images/g/NboAAOSwDRhhDphh/s-l1200.jpg",
    stock: 55
  },
  {
    name: "Cinnamon Powder", // <--- FIXED
    category: "powders",
    price: 8.0,
    description: "Sweet and woody cinnamon powder for baking and cooking.",
    image: "https://bi.imgix.net/2024/08/Ground-Cinnamon.jpg?fm=pjpg&s=b8a64c901afb0873b3748799ca74d241",
    stock: 40
  }
];

const seedDB = async () => {
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('✅ Database Seeded with Hybrid Stable Links!');
  mongoose.connection.close();
};

seedDB();