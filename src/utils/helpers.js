// Utility helpers

export const formatCurrency = (amount) => {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
  if (amount >= 100000)   return `₹${(amount / 100000).toFixed(1)} L`;
  if (amount >= 1000)     return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
};

export const formatDate = (dateStr) => {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const formatArea = (sqft) => {
  if (sqft >= 43560) return `${(sqft / 43560).toFixed(2)} Acres`;
  if (sqft >= 4356)  return `${(sqft / 4356).toFixed(2)} Katha`;
  return `${sqft.toLocaleString()} sq.ft`;
};

export const statusColor = (status) => {
  const map = {
    available:   'badge-green',
    active:      'badge-green',
    confirmed:   'badge-green',
    completed:   'badge-green',
    success:     'badge-green',
    paid:        'badge-green',
    pending:     'badge-yellow',
    in_progress: 'badge-blue',
    assigned:    'badge-blue',
    booked:      'badge-yellow',
    created:     'badge-yellow',
    cancelled:   'badge-red',
    blocked:     'badge-red',
    failed:      'badge-red',
    sold:        'badge-grey',
    inactive:    'badge-grey',
    refunded:    'badge-grey',
  };
  return map[status] || 'badge-grey';
};

export const statusLabel = (status) => {
  const map = {
    available:   'Available',
    active:      'Active',
    confirmed:   'Confirmed',
    completed:   'Completed',
    success:     'Success',
    paid:        'Paid',
    pending:     'Pending',
    in_progress: 'In Progress',
    assigned:    'Assigned',
    booked:      'Booked',
    created:     'Created',
    cancelled:   'Cancelled',
    blocked:     'Blocked',
    failed:      'Failed',
    sold:        'Sold',
    inactive:    'Inactive',
    refunded:    'Refunded',
    unpaid:      'Unpaid',
  };
  return map[status] || status;
};

export const plotTypeLabel = (type) => {
  const map = { residential: 'Residential', commercial: 'Commercial', agricultural: 'Agricultural' };
  return map[type] || type;
};

export const serviceTypeLabel = (type) => {
  const map = { maapi: 'Maapi (Measurement)', division: 'Division Survey', map: 'Map Preparation', boundary: 'Boundary Survey' };
  return map[type] || type;
};
