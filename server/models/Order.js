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
    enum: ['placed', 'preparing', 'ready', 'delivered'],
    default: 'placed'
  }
}, { timestamps: true });

// method to get status label
orderSchema.methods.statusLabel = function() {
  const map = {
    'placed': 'Order Placed',
    'preparing': 'Preparing',
    'ready': 'Ready for Pickup/Delivery',
    'delivered': 'Delivered'
  };
  return map[this.status] || this.status;
};

const Order = mongoose.model('Order', orderSchema);

export default Order;
