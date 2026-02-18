export function formatDateMMDDYY(isoString: string) {
  const date = new Date(isoString);

  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // months are 0-indexed
  const day = date.getDate().toString().padStart(2, "0");
  const year = date.getFullYear().toString().slice(-2); // last 2 digits

  return `${month}/${day}/${year}`;
}

export function formatDateMMDDYYHHMM(isoString: string) {
  const MMDDYY = formatDateMMDDYY(isoString);
  const date = new Date(isoString);

  const XM = date.getHours() < 12 ? "AM" : "PM";
  const hour = (date.getHours() % 12 || 12).toString();
  const minute = date.getMinutes().toString().padStart(2, "0");
  return `${MMDDYY} ${hour}:${minute}${XM}`;
}

export const compareDate = (a: string, b: string) => {
  const dateA = new Date(a || 0).getTime();
  const dateB = new Date(b || 0).getTime();
  return dateB - dateA; // newest first
};
