export const expenseFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "HKD",
});

export const savingsFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "HKD",
});

export function formatMonth(month: string) {
  return new Date(`${month}-01T00:00:00`).toLocaleDateString("en-US", {
    month: "short",
    year: "2-digit",
  });
}

export function formatDate(date: string) {
  const parsedDate = new Date(`${date}T00:00:00`);
  return Number.isNaN(parsedDate.getTime())
    ? date
    : parsedDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

export function todayString() {
  const date = new Date();
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60_000);
  return localDate.toISOString().slice(0, 10);
}
