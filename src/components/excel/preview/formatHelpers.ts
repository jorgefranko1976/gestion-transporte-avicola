
// Helper function to format column names for display
export const formatColumnName = (name: string): string => {
  // Convert camelCase to Title Case with spaces
  const formatted = name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
  
  return formatted;
};

// Helper function to format cell values
export const formatCellValue = (value: any): string => {
  if (value === null || value === undefined) return '';
  if (typeof value === 'number') return value.toString();
  return value;
};
