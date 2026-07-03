// ── SP MAPI — localStorage Utility ──

/** Generate a unique Application ID with given prefix */
export function generateAppId(prefix = 'APP') {
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const rand = Math.floor(1000 + Math.random() * 9000);
  return `${prefix}-${dateStr}-${rand}`;
}

/** Save a new application to localStorage */
export function saveApplication(type, data) {
  const key = `spmapi_${type}_applications`;
  const existing = getApplicationsByType(type);
  existing.push({ ...data, createdAt: new Date().toISOString() });
  localStorage.setItem(key, JSON.stringify(existing));
}

/** Get all applications of a given type (mapi | bantwara | map) */
export function getApplicationsByType(type) {
  try {
    return JSON.parse(localStorage.getItem(`spmapi_${type}_applications`) || '[]');
  } catch { return []; }
}

/** Get all applications for a specific user across all types */
export function getApplicationsByUser(userId) {
  const mapi = getApplicationsByType('mapi').filter(a => a.userId === userId).map(a => ({ ...a, serviceType: 'mapi' }));
  const bantwara = getApplicationsByType('bantwara').filter(a => a.userId === userId).map(a => ({ ...a, serviceType: 'bantwara' }));
  const map = getApplicationsByType('map').filter(a => a.userId === userId).map(a => ({ ...a, serviceType: 'map' }));
  return [...mapi, ...bantwara, ...map].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/** Update status of an application */
export function updateApplicationStatus(type, appId, newStatus, remark = '') {
  const key = `spmapi_${type}_applications`;
  const apps = getApplicationsByType(type);
  const idx = apps.findIndex(a => a.appId === appId);
  if (idx === -1) return false;

  if (!apps[idx].statusHistory) apps[idx].statusHistory = [];
  apps[idx].statusHistory.push({
    status: apps[idx].status,
    date: apps[idx].updatedAt || apps[idx].createdAt,
    remark: apps[idx].remark || '',
  });
  apps[idx].status = newStatus;
  apps[idx].remark = remark;
  apps[idx].updatedAt = new Date().toISOString();

  localStorage.setItem(key, JSON.stringify(apps));
  return true;
}

/** Get all applications (admin use) */
export function getAllApplications(type) {
  return getApplicationsByType(type);
}

/** Get all service requests combined */
export function getAllServiceRequests() {
  const mapi = getApplicationsByType('mapi').map(a => ({ ...a, serviceType: 'mapi' }));
  const bantwara = getApplicationsByType('bantwara').map(a => ({ ...a, serviceType: 'bantwara' }));
  const map = getApplicationsByType('map').map(a => ({ ...a, serviceType: 'map' }));
  return [...mapi, ...bantwara, ...map].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
}

/** Status configs for each service type */
export const STATUS_CONFIG = {
  mapi: {
    submitted:   { label: 'Submitted',   color: 'badge-grey' },
    verification:{ label: 'Verification', color: 'badge-yellow' },
    processing:  { label: 'Processing',  color: 'badge-yellow' },
    approved:    { label: 'Approved',    color: 'badge-green' },
    rejected:    { label: 'Rejected',    color: 'badge-red' },
    completed:   { label: 'Completed',   color: 'badge-blue' },
  },
  bantwara: {
    submitted:   { label: 'Submitted',   color: 'badge-grey' },
    verification:{ label: 'Verification', color: 'badge-yellow' },
    processing:  { label: 'Processing',  color: 'badge-yellow' },
    approved:    { label: 'Approved',    color: 'badge-green' },
    rejected:    { label: 'Rejected',    color: 'badge-red' },
    completed:   { label: 'Completed',   color: 'badge-blue' },
  },
  map: {
    submitted:     { label: 'Submitted',      color: 'badge-grey' },
    verification:  { label: 'Verification',   color: 'badge-yellow' },
    map_preparation:{ label: 'Map Preparation', color: 'badge-yellow' },
    ready:         { label: 'Ready',          color: 'badge-green' },
    delivered:     { label: 'Delivered',      color: 'badge-green' },
    completed:     { label: 'Completed',      color: 'badge-blue' },
  },
};

export const STATUS_STEPS = {
  mapi: ['submitted', 'verification', 'processing', 'approved', 'completed'],
  bantwara: ['submitted', 'verification', 'processing', 'approved', 'completed'],
  map: ['submitted', 'verification', 'map_preparation', 'ready', 'delivered', 'completed'],
};

export function formatDisplayDate(isoStr) {
  if (!isoStr) return '—';
  return new Date(isoStr).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}
