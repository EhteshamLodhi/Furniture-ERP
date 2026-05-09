/**
 * Utility & formatting functions for The Ledger ERP
 */

/**
 * Format number as PKR currency
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format compact currency for KPI cards (PKR 142K)
 */
export function formatCompactCurrency(amount: number): string {
  const sign = amount < 0 ? '-' : '';
  const absoluteAmount = Math.abs(amount);
  if (Math.abs(amount) >= 1_000_000) {
    return `${sign}PKR ${(absoluteAmount / 1_000_000).toFixed(1)}M`;
  }
  if (Math.abs(amount) >= 1_000) {
    return `${sign}PKR ${(absoluteAmount / 1_000).toFixed(0)}K`;
  }
  return formatCurrency(amount);
}

/**
 * Format a date as "Oct 14, 2023"
 */
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Format relative date "2 days ago", "in 3 days", etc.
 */
export function formatRelativeDate(dateStr: string): string {
  const now = new Date();
  const date = new Date(dateStr);
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  if (diffDays === -1) return 'Yesterday';
  if (diffDays > 0) return `in ${diffDays} days`;
  return `${Math.abs(diffDays)} days ago`;
}

/**
 * Get days until/past a due date
 */
export function getDaysDifference(dateStr: string): number {
  const now = new Date();
  const date = new Date(dateStr);
  return Math.round((date.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

/**
 * Format percentage with + sign for positive
 */
export function formatPercentage(value: number): string {
  const sign = value >= 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}

/**
 * Generate initials from a name ("Grand Oak" → "GO")
 */
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

/**
 * Generate a display-friendly order number
 */
export function generateOrderNumber(): string {
  const prefix = 'ORD';
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
  return `${prefix}-${date}-${random}`;
}

/**
 * Generate a display-friendly invoice number
 */
export function generateInvoiceNumber(): string {
  const prefix = 'INV';
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
  return `${prefix}-${year}-${random}`;
}

/**
 * Class name conditional utility (like clsx)
 */
export function cn(...classes: (string | boolean | undefined | null)[]): string {
  return classes.filter(Boolean).join(' ');
}
