export const isValidAmount = (amt: string) => {
  const numeric = Number(amt);
  return !Number.isNaN(numeric) && numeric > 0;
};