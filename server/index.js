import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = 'bangla-to-let-secret-key';

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database setup
const db = new sqlite3.Database('./database.db');

// Initialize database tables
db.serialize(() => {
  // Users table
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'tenant',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  // Properties table
  db.run(`CREATE TABLE IF NOT EXISTS properties (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    location TEXT NOT NULL,
    area TEXT NOT NULL,
    price INTEGER NOT NULL,
    bedrooms INTEGER,
    bathrooms INTEGER,
    property_type TEXT NOT NULL,
    amenities TEXT,
    images TEXT,
    owner_id INTEGER,
    status TEXT DEFAULT 'available',
    featured BOOLEAN DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (owner_id) REFERENCES users (id)
  )`);

  // Inquiries table
  db.run(`CREATE TABLE IF NOT EXISTS inquiries (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    property_id INTEGER,
    user_id INTEGER,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    message TEXT,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (property_id) REFERENCES properties (id),
    FOREIGN KEY (user_id) REFERENCES users (id)
  )`);

  // Insert sample data
  const sampleProperties = [
    {
      title: "Modern 3BHK Apartment in Gulshan",
      description: "Spacious and well-furnished apartment with modern amenities",
      location: "Gulshan 2, Dhaka",
      area: "1200 sq ft",
      price: 45000,
      bedrooms: 3,
      bathrooms: 2,
      property_type: "Apartment",
      amenities: "AC, Parking, Security, Lift",
      images: "https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg",
      featured: 1
    },
    {
      title: "Spacious Family House in Dhanmondi",
      description: "Perfect family home with garden and parking space",
      location: "Dhanmondi 15, Dhaka",
      area: "1800 sq ft",
      price: 65000,
      bedrooms: 4,
      bathrooms: 3,
      property_type: "House",
      amenities: "Garden, Parking, Security",
      images: "https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg",
      featured: 1
    },
    {
      title: "Cozy 2BHK Flat in Uttara",
      description: "Comfortable flat in a quiet neighborhood",
      location: "Uttara Sector 7, Dhaka",
      area: "950 sq ft",
      price: 28000,
      bedrooms: 2,
      bathrooms: 2,
      property_type: "Flat",
      amenities: "AC, Parking, Security",
      images: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg",
      featured: 1
    }
  ];

  // Check if properties exist before inserting
  db.get("SELECT COUNT(*) as count FROM properties", (err, row) => {
    if (err) {
      console.error(err);
      return;
    }
    
    if (row.count === 0) {
      const stmt = db.prepare(`INSERT INTO properties 
        (title, description, location, area, price, bedrooms, bathrooms, property_type, amenities, images, featured) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
      
      sampleProperties.forEach(property => {
        stmt.run([
          property.title,
          property.description,
          property.location,
          property.area,
          property.price,
          property.bedrooms,
          property.bathrooms,
          property.property_type,
          property.amenities,
          property.images,
          property.featured
        ]);
      });
      
      stmt.finalize();
      console.log('Sample properties inserted');
    }
  });
});

// File upload configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// Routes

// Get all properties
app.get('/api/properties', (req, res) => {
  const { location, property_type, min_price, max_price, bedrooms } = req.query;
  
  let query = 'SELECT * FROM properties WHERE status = "available"';
  const params = [];

  if (location) {
    query += ' AND location LIKE ?';
    params.push(`%${location}%`);
  }
  
  if (property_type) {
    query += ' AND property_type = ?';
    params.push(property_type);
  }
  
  if (min_price) {
    query += ' AND price >= ?';
    params.push(min_price);
  }
  
  if (max_price) {
    query += ' AND price <= ?';
    params.push(max_price);
  }
  
  if (bedrooms) {
    query += ' AND bedrooms = ?';
    params.push(bedrooms);
  }

  query += ' ORDER BY featured DESC, created_at DESC';

  db.all(query, params, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get featured properties
app.get('/api/properties/featured', (req, res) => {
  db.all('SELECT * FROM properties WHERE featured = 1 AND status = "available" ORDER BY created_at DESC LIMIT 6', (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single property
app.get('/api/properties/:id', (req, res) => {
  const { id } = req.params;
  
  db.get('SELECT * FROM properties WHERE id = ?', [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Property not found' });
      return;
    }
    res.json(row);
  });
});

// User registration
app.post('/api/register', async (req, res) => {
  const { name, email, phone, password, role = 'tenant' } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    db.run(
      'INSERT INTO users (name, email, phone, password, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, phone, hashedPassword, role],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            res.status(400).json({ error: 'Email already exists' });
          } else {
            res.status(500).json({ error: err.message });
          }
          return;
        }
        
        const token = jwt.sign({ id: this.lastID, email, role }, JWT_SECRET);
        res.json({ 
          token, 
          user: { id: this.lastID, name, email, phone, role } 
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User login
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!user) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    try {
      const validPassword = await bcrypt.compare(password, user.password);
      if (!validPassword) {
        res.status(401).json({ error: 'Invalid credentials' });
        return;
      }

      const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
      res.json({ 
        token, 
        user: { 
          id: user.id, 
          name: user.name, 
          email: user.email, 
          phone: user.phone, 
          role: user.role 
        } 
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  });
});

// Submit inquiry
app.post('/api/inquiries', (req, res) => {
  const { property_id, name, email, phone, message } = req.body;

  db.run(
    'INSERT INTO inquiries (property_id, name, email, phone, message) VALUES (?, ?, ?, ?, ?)',
    [property_id, name, email, phone, message],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ 
        id: this.lastID, 
        message: 'Inquiry submitted successfully' 
      });
    }
  );
});

// Add new property (protected route)
app.post('/api/properties', authenticateToken, upload.array('images', 5), (req, res) => {
  const { title, description, location, area, price, bedrooms, bathrooms, property_type, amenities } = req.body;
  const images = req.files ? req.files.map(file => `/uploads/${file.filename}`).join(',') : '';

  db.run(
    `INSERT INTO properties 
    (title, description, location, area, price, bedrooms, bathrooms, property_type, amenities, images, owner_id) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [title, description, location, area, price, bedrooms, bathrooms, property_type, amenities, images, req.user.id],
    function(err) {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ 
        id: this.lastID, 
        message: 'Property added successfully' 
      });
    }
  );
});

// Contact form submission
app.post('/api/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;
  
  // In a real application, you would send an email here
  console.log('Contact form submission:', { name, email, phone, subject, message });
  
  res.json({ message: 'Message sent successfully' });
});

// Get property statistics
app.get('/api/stats', (req, res) => {
  const stats = {};
  
  db.get('SELECT COUNT(*) as total FROM properties', (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    stats.totalProperties = row.total;
    
    db.get('SELECT COUNT(*) as total FROM users WHERE role = "tenant"', (err, row) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      stats.totalTenants = row.total;
      
      db.get('SELECT COUNT(DISTINCT location) as total FROM properties', (err, row) => {
        if (err) {
          res.status(500).json({ error: err.message });
          return;
        }
        stats.totalLocations = row.total;
        
        res.json(stats);
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});