export function generateSKU(productName: string, color: string, size: string): string {
  const productCode = productName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);

  const colorCode = color.toUpperCase().slice(0, 2);
  const sizeCode = size.toUpperCase();

  return `${productCode}-${colorCode}-${sizeCode}`;
}

export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
