// Formats a date string or timestamp to '1 January 2001' format
export function formatDate(dateInput) {
  if (!dateInput) return "Not Available";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Not Available";
  return (
    date.getDate() +
    " " +
    date.toLocaleString("default", { month: "long" }) +
    " " +
    date.getFullYear()
  );
}
