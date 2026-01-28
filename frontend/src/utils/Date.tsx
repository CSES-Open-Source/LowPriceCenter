export function formatDateMMDDYY(isoString: string) {
  const date = new Date(isoString);

  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // months are 0-indexed
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2); // last 2 digits

  return `${month}/${day}/${year}`;
}
