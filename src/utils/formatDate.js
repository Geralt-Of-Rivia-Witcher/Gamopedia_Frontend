// Format dates consistently on the server and in the browser.
export function formatDate(dateInput) {
  if (!dateInput) return "Not Available";
  const date = new Date(dateInput);
  if (isNaN(date.getTime())) return "Not Available";
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
