// Myanmar NRC Constants
// Region Numbers (1-14)
export const NRC_REGIONS = [
  { value: '1', label: '၁' },
  { value: '2', label: '၂' },
  { value: '3', label: '၃' },
  { value: '4', label: '၄' },
  { value: '5', label: '၅' },
  { value: '6', label: '၆' },
  { value: '7', label: '၇' },
  { value: '8', label: '၈' },
  { value: '9', label: '၉' },
  { value: '10', label: '၁၀' },
  { value: '11', label: '၁၁' },
  { value: '12', label: '၁၂' },
  { value: '13', label: '၁၃' },
  { value: '14', label: '၁၄' },
] as const;

// NRC Types
export const NRC_TYPES = [
  { value: 'N', label: '(N)', description: 'Naing' },
  { value: 'A', label: '(A)', description: 'Ahon' },
  { value: 'P', label: '(P)', description: 'Pyn' },
] as const;

// Township Abbreviations by Region
export const NRC_TOWNSHIPS: Record<string, { value: string; label: string }[]> = {
  '1': [
    { value: 'MMA', label: 'MMA' },
    { value: 'MMD', label: 'MMD' },
    { value: 'KNS', label: 'KNS' },
    { value: 'KNT', label: 'KNT' },
    { value: 'TKN', label: 'TKN' },
  ],
  '2': [
    { value: 'BMG', label: 'BMG' },
    { value: 'BNT', label: 'BNT' },
    { value: 'PTH', label: 'PTH' },
    { value: 'MDY', label: 'MDY' },
    { value: 'YMT', label: 'YMT' },
  ],
  '3': [
    { value: 'KYA', label: 'KYA' },
    { value: 'KYT', label: 'KYT' },
    { value: 'TPI', label: 'TPI' },
    { value: 'TTL', label: 'TTL' },
  ],
  '4': [
    { value: 'MLK', label: 'MLK' },
    { value: 'KYT', label: 'KYT' },
    { value: 'THT', label: 'THT' },
    { value: 'SNP', label: 'SNP' },
  ],
  '5': [
    { value: 'PNN', label: 'PNN' },
    { value: 'PNT', label: 'PNT' },
    { value: 'PPT', label: 'PPT' },
    { value: 'PKT', label: 'PKT' },
  ],
  '6': [
    { value: 'MDL', label: 'MDL' },
    { value: 'MNL', label: 'MNL' },
    { value: 'HAM', label: 'HAM' },
    { value: 'HSM', label: 'HSM' },
  ],
  '7': [
    { value: 'TSS', label: 'TSS' },
    { value: 'TSY', label: 'TSY' },
    { value: 'BHT', label: 'BHT' },
    { value: 'KPY', label: 'KPY' },
  ],
  '8': [
    { value: 'YGN', label: 'YGN' },
    { value: 'YGK', label: 'YGK' },
    { value: 'MLN', label: 'MLN' },
    { value: 'KTU', label: 'KTU' },
  ],
  '9': [
    { value: 'AYY', label: 'AYY' },
    { value: 'AYT', label: 'AYT' },
    { value: 'GNT', label: 'GNT' },
    { value: 'BGO', label: 'BGO' },
  ],
  '10': [
    { value: 'HGN', label: 'HGN' },
    { value: 'HGT', label: 'HGT' },
    { value: 'TKU', label: 'TKU' },
  ],
  '11': [
    { value: 'BKN', label: 'BKN' },
    { value: 'BKT', label: 'BKT' },
    { value: 'TDO', label: 'TDO' },
  ],
  '12': [
    { value: 'SNY', label: 'SNY' },
    { value: 'SNW', label: 'SNW' },
    { value: 'MKN', label: 'MKN' },
  ],
  '13': [
    { value: 'YAY', label: 'YAY' },
    { value: 'YAT', label: 'YAT' },
    { value: 'MAU', label: 'MAU' },
  ],
  '14': [
    { value: 'ACH', label: 'ACH' },
    { value: 'ACM', label: 'ACM' },
    { value: 'HPA', label: 'HPA' },
  ],
};

// Format NRC number from parts
export function formatNRC(parts: { region: string; township: string; type: string; serial: string }): string {
  return `${parts.region}/${parts.township}(${parts.type})${parts.serial}`;
}

// Parse NRC number string to parts
export function parseNRC(nrc: string): { region: string; township: string; type: string; serial: string } | null {
  const match = nrc.match(/^(\d+)\/([A-Z]+)\(([NAP])\)(\d{6})$/);
  if (!match) return null;
  
  return {
    region: match[1],
    township: match[2],
    type: match[3] as 'N' | 'A' | 'P',
    serial: match[4],
  };
}

// Categories for products
export const PRODUCT_CATEGORIES = [
  { value: 'electronics', label: 'Electronics', icon: '📱' },
  { value: 'vehicles', label: 'Vehicles', icon: '🚗' },
  { value: 'fashion', label: 'Fashion', icon: '👔' },
  { value: 'home', label: 'Home & Living', icon: '🏠' },
  { value: 'sports', label: 'Sports', icon: '⚽' },
  { value: 'books', label: 'Books', icon: '📚' },
  { value: 'beauty', label: 'Beauty', icon: '💄' },
  { value: 'toys', label: 'Toys & Games', icon: '🎮' },
  { value: 'other', label: 'Other', icon: '📦' },
] as const;