import dayjs from "dayjs";

/**
 * Formats a numeric value into a standard Brazilian currency string (pt-BR).
 *
 * @param value - The numerical amount to format (number or string representation).
 * @param currency - The ISO 4217 currency code (defaults to 'BRL').
 * @returns Formatted currency string (e.g., "R$ 1.234,56").
 */
export const formatCurrency = (
  value: number | string,
  currency: string = "BRL",
): string => {
  const numericValue = typeof value === "string" ? parseFloat(value) : value;

  if (
    numericValue === null ||
    numericValue === undefined ||
    isNaN(numericValue) ||
    !isFinite(numericValue)
  ) {
    return currency === "BRL" ? "R$ 0,00" : `${currency} 0,00`;
  }

  try {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(numericValue);
  } catch {
    // Fallback manual formatting in case Intl.NumberFormat encounters an unsupported currency code or environment error
    const [integerPart, decimalPart] = Math.abs(numericValue)
      .toFixed(2)
      .split(".");
    const formattedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    const formattedNumber = `${numericValue < 0 ? "-" : ""}${formattedInteger},${decimalPart}`;
    const symbol = currency === "BRL" ? "R$" : currency;

    return `${symbol} ${formattedNumber}`;
  }
};

/**
 * Formats a date string into a standard display date (MM/DD/YYYY).
 *
 * @param value - The date string to format.
 * @returns Formatted date string or "Not provided" if invalid or missing.
 */
export const formatSubscriptionDateTime = (value?: string): string => {
  const trimmed = value?.trim();
  if (!trimmed) return "Não fornecido";
  const parsedDate = dayjs(trimmed);
  return parsedDate.isValid()
    ? parsedDate.format("MM/DD/YYYY")
    : "Não fornecido";
};

/**
 * Capitalizes the first letter of a status string.
 *
 * @param value - The status string to format.
 * @returns Capitalized status label or "Não fornecido" if missing.
 */
export const formatStatusLabel = (value?: string): string => {
  const trimmed = value?.trim();
  if (!trimmed) return "Não fornecido";
  return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

export default {
  formatSubscriptionDateTime,
  formatStatusLabel,
  formatCurrency,
};
