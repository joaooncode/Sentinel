/**
 * Formats a numeric value into a standard Brazilian currency string (pt-BR).
 *
 * @param value - The numerical amount to format (number or string representation).
 * @param currency - The ISO 4217 currency code (defaults to 'BRL').
 * @returns Formatted currency string (e.g., "R$ 1.234,56").
 */
export function formatCurrency(
  value: number | string,
  currency: string = "BRL",
): string {
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
}

export default formatCurrency;
