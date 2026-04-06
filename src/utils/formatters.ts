// Currency formatter for Myanmar Kyat
export function formatMMK(amount: number): string {
  return new Intl.NumberFormat('my-MM', {
    style: 'currency',
    currency: 'MMK',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Date formatter
export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('my-MM', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

// Relative time formatter (e.g., "2 hours ago")
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const target = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - target.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(date);
}

// Calculate 30% down payment
export function calculateDownPayment(amount: number): number {
  return Math.round(amount * 0.3 * 100) / 100;
}

// Generate product status badge color
export function getStatusColor(status: string): string {
  switch (status) {
    case 'open':
      return 'bg-green-500/20 text-green-400 border-green-500/30';
    case 'pending':
      return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    case 'sold':
      return 'bg-red-500/20 text-red-400 border-red-500/30';
    default:
      return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  }
}

// Truncate text with ellipsis
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - 3) + '...';
}

// Generate initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

// Validate NRC number format
export function isValidNRC(nrc: string): boolean {
  const regex = /^\d{1,2}\/[A-Z]{2,3}\([NAP]\)\d{6}$/;
  return regex.test(nrc);
}

// Validate phone number (Myanmar format)
export function isValidPhoneNumber(phone: string): boolean {
  // KPay/Wave formats: 09xxxxxxxxx, +959xxxxxxxxx
  const regex = /^(09|\+?959)\d{8,9}$/;
  return regex.test(phone);
}

// Format phone number
export function formatPhoneNumber(phone: string): string {
  // Remove all non-digits
  const digits = phone.replace(/\D/g, '');
  
  if (digits.startsWith('959')) {
    return `+${digits}`;
  }
  if (digits.startsWith('09')) {
    return digits;
  }
  return phone;
}