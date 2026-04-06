// Myanmar NRC Constants
// Complete NRC data with all regions and townships

export const MYANMAR_NRC_DATA = {
  "1": { name: "Kachin State", townships: ["ကတန", "ခဖန", "ဆလန", "ဆပန", "တနန", "နမန", "ပတန", "ဖကန", "မကန", "မခန", "မနန", "မမန", "မညန", "ယကန", "ဟပန"] },
  "2": { name: "Kayah State", townships: ["ကဃန", "ဃရန", "ဒမန", "ဖသန", "ဖရန", "မသန", "ယတန", "လကန"] },
  "3": { name: "Kayin State", townships: ["ကဆန", "ကကန", "ကရန", "ဖအန", "ဘအန", "မဝန", "သတန", "ယရန"] },
  "4": { name: "Chin State", townships: ["ကပန", "တဇန", "တတန", "ထတန", "ပလန", "မတန", "မပန", "ဟခန", "ယကန"] },
  "5": { name: "Sagaing Region", townships: ["ကနန", "ကလန", "ခဥန", "ကလေး", "ခတန", "ငဇန", "စကန", "ဆလန", "တမန", "တဆန", "ထလန", "နယန", "ပလန", "ဖလန", "မကန", "မရန", "မမန", "ယမန", "ရဘန", "သကန", "ဟမန", "အတန"] },
  "6": { name: "Tanintharyi Region", townships: ["ကသန", "ဃယန", "တသန", "ထဝန", "ပလန", "မမန", "မရန", "ရလန", "လလန", "အသန"] },
  "7": { name: "Bago Region", townships: ["ကကန", "ကတန", "ကပန", "ခတန", "ငပန", "စကန", "ညလန", "တငန", "ထတန", "နတန", "ပခန", "ပတန", "ပမန", "ဖမန", "မလန", "မညန", "ရတန", "ရကန", "လတန", "ဝမန", "သနန", "အဖန"] },
  "8": { name: "Magway Region", townships: ["ကမန", "ခမန", "ငဖန", "စကန", "စတန", "ဆဖြန", "ဆပန", "တတန", "ထလန", "နမန", "ပကန", "ပမန", "ဖလန", "မကန", "မထန", "မတန", "ယနန", "ရစန", "လတန", "သရန"] },
  "9": { name: "Mandalay Region", townships: ["ကပန", "ကဆန", "ခမန", "စကန", "ညဥန", "တတန", "တကန", "ထကန", "နထန", "ပကန", "ပဘန", "ပမန", "ပသန", "မထန", "မကန", "မရန", "မလန", "ရမန", "ဝတန", "သကန", "အမရ", "အပန"] },
  "10": { name: "Mon State", townships: ["ကမရ", "ခဆန", "ဃဇန", "ဇရန", "သထန", "သဖြန", "ပဏန", "မဒန", "မလန", "ယမန"] },
  "11": { name: "Rakhine State", townships: ["ကတန", "ကျပန", "ဂဝန", "စတန", "တကန", "သတန", "နရန", "ပဏန", "ပတန", "မအန", "မတန", "မပန", "ရသန", "စပန"] },
  "12": { name: "Yangon Region", townships: ["ကကတ", "ကတတ", "ကမန", "ကမရ", "ကောက်", "ခယန", "စကန", "ဆကန", "တကန", "တမန", "တတန", "ဒဂန", "ဒဂဆ", "ဒဂတ", "ဒဂယ", "ဒပုံ", "ပဘတ", "ပဇတ", "ဗဟန", "ဗတထ", "မကန", "မရက", "ရကန", "လမန", "လသယ", "လှက", "သကတ", "သဃက", "သလန", "အလန", "ဥကတ"] },
  "13": { name: "Shan State", townships: ["ကတန", "ကလန", "ခလန", "ဃတန", "စဆန", "ဆလန", "တကန", "တယန", "နခန", "နတန", "နစန", "နပန", "နဆန", "ပကန", "ပတန", "ပလန", "ဖခန", "မကန", "မခန", "မတန", "မတန", "မပန", "မရန", "မဆန", "မယန", "ယကန", "ယစန", "ယရန", "လခန", "လရန", "လလန", "ဟပန", "ဟရန", "အတန"] },
  "14": { name: "Ayeyarwady Region", townships: ["ကကန", "ကပန", "ကလန", "ကမန", "ငပတ", "စလန", "ဇလန", "ညတန", "တတန", "ဓနန", "နပတ", "ပတန", "ဖပန", "ဘကလ", "မအန", "မမန", "မြန", "ယကန", "လပတ", "ဝခမ", "သပန", "အဂပ", "အမန"] }
};

// Region Numbers (1-14) in Burmese numerals
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

// Get townships for a specific region
export function getTownshipsByRegion(region: string): { value: string; label: string }[] {
  const data = MYANMAR_NRC_DATA[region];
  if (!data) return [];
  
  return data.townships.map(township => ({
    value: township,
    label: township
  }));
}

// Get region name
export function getRegionName(region: string): string {
  return MYANMAR_NRC_DATA[region]?.name || '';
}

// Format NRC number from parts
export function formatNRC(parts: { region: string; township: string; type: string; serial: string }): string {
  return `${parts.region}/${parts.township}(${parts.type})${parts.serial}`;
}

// Parse NRC number string to parts
export function parseNRC(nrc: string): { region: string; township: string; type: string; serial: string } | null {
  const match = nrc.match(/^(\d+)\/([\u1000-\u100A]+)\(([NAP])\)(\d{6})$/);
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