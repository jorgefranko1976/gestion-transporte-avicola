
// Utility function to calculate age based on birth date
export const calculateAge = (birthDate: Date | undefined): string => {
  if (!birthDate) return '';
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return `${age} años`;
};
