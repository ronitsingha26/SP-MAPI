const API_BASE = '/api';

export const applicationService = {
  // Fetch all applications by serviceType
  getApplicationsByType: async (type) => {
    try {
      const response = await fetch(`${API_BASE}/applications/${type}`);
      if (!response.ok) {
        throw new Error(`Error fetching ${type} applications`);
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return [];
    }
  },

  // Update application status
  updateStatus: async (id, status, remark = '') => {
    try {
      const response = await fetch(`${API_BASE}/applications/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, remark }),
      });
      if (!response.ok) {
        throw new Error('Error updating status');
      }
      return await response.json();
    } catch (error) {
      console.error(error);
      return null;
    }
  }
};
