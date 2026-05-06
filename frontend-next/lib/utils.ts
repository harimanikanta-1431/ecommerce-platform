export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value);
}

export function getDiscountPercent(price: number, originalPrice?: number) {
  if (!originalPrice || originalPrice <= price) {
    return null;
  }

  return Math.round(((originalPrice - price) / originalPrice) * 100);
}

export function toNumber(value: string | string[] | undefined, fallback: number) {
  const raw = Array.isArray(value) ? value[0] : value;

  if (raw === undefined || raw.trim() === "") {
    return fallback;
  }

  const parsed = Number(raw);

  return Number.isFinite(parsed) ? parsed : fallback;
}
