import express from 'express';
import MenuItem from '../models/MenuItem.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();


router.get('/', async (req, res) => {
  try {
    const { category, search, all } = req.query;
    
    let query = {};
    
    if (all !== 'true') {
      query.available = true;
    }

    if (category && category !== 'all') {
      query.category = category;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    const items = await MenuItem.find(query);
    res.json(items);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch menu' });
  }
});

router.post('/', protect, admin, async (req, res) => {
  try {
    const { name, price, description, category, imageUrl, available } = req.body;

    const newItem = new MenuItem({
      name,
      price,
      description,
      category,
      imageUrl,
      available
    });

    const createdItem = await newItem.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(400).json({ message: 'Invalid menu item data' });
  }
});

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { name, price, description, category, imageUrl, available } = req.body;

    const item = await MenuItem.findById(req.params.id);

    if (item) {
      item.name = name || item.name;
      item.price = price ?? item.price;
      item.description = description || item.description;
      item.category = category || item.category;
      item.imageUrl = imageUrl || item.imageUrl;
      item.available = available ?? item.available;

      const updatedItem = await item.save();
      res.json(updatedItem);
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(400).json({ message: 'Update failed' });
  }
});

router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);
    
    if (item) {
      res.json({ message: 'Menu item removed' });
    } else {
      res.status(404).json({ message: 'Menu item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
