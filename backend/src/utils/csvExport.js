/**
 * Converts an array of objects to a CSV string.
 * @param {Array<Object>} data 
 * @returns {string} CSV formatted string
 */
function jsonToCsv(data) {
  if (!data || !data.length) return '';

  const keys = Object.keys(data[0]);
  
  // Create header row
  const header = keys.map(key => `"${String(key).replace(/"/g, '""')}"`).join(',');
  
  // Create data rows
  const rows = data.map(row => {
    return keys.map(key => {
      let val = row[key];
      if (val === null || val === undefined) val = '';
      
      // Handle Date objects
      if (val instanceof Date) {
        val = val.toISOString();
      } else if (typeof val === 'object') {
        // Stringify nested objects/arrays
        val = JSON.stringify(val);
      }
      
      // Escape quotes and wrap in quotes
      return `"${String(val).replace(/"/g, '""')}"`;
    }).join(',');
  });
  
  return [header, ...rows].join('\n');
}

module.exports = { jsonToCsv };
