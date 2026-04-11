import React from 'react';

const OrderStatusBadge = ({ status }) => {
  const getBadgeClass = (s) => {
    switch (s) {
      case 'placed': return 'badge-placed';
      case 'preparing': return 'badge-preparing';
      case 'ready': return 'badge-ready';
      case 'delivered': return 'badge-delivered';
      case 'cancelled': return 'badge-cancelled';
      default: return '';
    }
  };

  const getLabel = (s) => {
    switch (s) {
      case 'placed': return 'ORDER PLACED';
      case 'preparing': return 'PREPARING';
      case 'ready': return 'READY FOR PICKUP';
      case 'delivered': return 'DELIVERED';
      case 'cancelled': return 'CANCELLED';
      default: return s.toUpperCase();
    }
  };

  return (
    <span className={`badge ${getBadgeClass(status)}`}>
      {getLabel(status)}
    </span>
  );
};

export default OrderStatusBadge;
