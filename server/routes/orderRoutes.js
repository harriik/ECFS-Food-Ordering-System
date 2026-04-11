import express from 'express';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import { protect } from '../middleware/authMiddleware.js';
import { admin } from '../middleware/adminMiddleware.js';

const router = express.Router();

// POST /api/orders
// Place a new order
router.post('/', protect, async (req, res) => {
  try {
    const { items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    }

    // Verify items exist and are available, and calculate total securely on server
    let total = 0;
    const orderItems = [];

    for (let i = 0; i < items.length; i++) {
      const itemReq = items[i];
      const menuItemInfo = await MenuItem.findById(itemReq.menuItem);

      if (!menuItemInfo) {
        return res.status(404).json({ message: `Item not found: ${itemReq.menuItem}` });
      }

      if (!menuItemInfo.available) {
        return res.status(400).json({ message: `Item ${menuItemInfo.name} is currently sold out` });
      }

      total += menuItemInfo.price * itemReq.quantity;
      
      orderItems.push({
        menuItem: menuItemInfo._id,
        quantity: itemReq.quantity,
        priceAtOrder: menuItemInfo.price
      });
    }

    const order = new Order({
      userId: req.user._id,
      items: orderItems,
      total: Number(total.toFixed(2)) // to avoid weird float issues
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Error processing order' });
  }
});

// GET /api/orders/mine
// Get logged-in user's orders
router.get('/mine', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user._id })
      .populate('items.menuItem', 'name imageUrl')
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
});

// GET /api/orders/:id
// Get order by ID (owner or admin)
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId', 'name email')
      .populate('items.menuItem', 'name price imageUrl');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // restrict to admin or owner
    if (order.userId._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET /api/orders
// Get all orders (admin only)
router.get('/', protect, admin, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate('userId', 'name')
      .populate('items.menuItem', 'name')
      .sort({ createdAt: -1 });
      
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all orders' });
  }
});

// PATCH /api/orders/:id/status
// Update order status (admin only)
router.patch('/:id/status', protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    
    // Status progression rule
    const validStatuses = ['placed', 'preparing', 'ready', 'delivered'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status;
    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update order status' });
  }
});

export default router;
