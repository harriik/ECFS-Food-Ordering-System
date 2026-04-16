import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  menuItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'MenuItem',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1
  },
  priceAtOrder: {
    type: Number,
    required: true
  }
});

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  total: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['placed', 'preparing', 'ready', 'delivered', 'cancelled'],
    default: 'placed'
  },
  cancelledBy: {
    type: String,
    enum: ['user', 'admin']
  }
}, { timestamps: true });

orderSchema.methods.statusLabel = function() {
  const map = {
    'placed': 'Order Placed',
    'preparing': 'Preparing',
    'ready': 'Ready for Pickup/Delivery',
    'delivered': 'Delivered',
    'cancelled': 'Cancelled'
  };
  return map[this.status] || this.status;
};

const Order = mongoose.model('Order', orderSchema);

export default Order;
