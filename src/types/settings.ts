export type CurrencyCode = 'USD' | 'EUR' | 'GBP' | 'JPY' | 'CAD' | 'AUD' | 'INR';

export type TempUnit = 'celsius' | 'fahrenheit';

export type ThemeMode = 'light' | 'dark' | 'system';

export type TravelStyle = 'budget' | 'balanced' | 'luxury' | 'adventure' | 'cultural';

export interface UserPreferences {
  currency: CurrencyCode;
  tempUnit: TempUnit;
  theme: ThemeMode;
  defaultTravelers: number;
  travelStyle: TravelStyle;
}
