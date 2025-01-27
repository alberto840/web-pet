export interface CountryInfo {
    id: number;
    name: string;
    primaryLanguage: string;
    mainCities: string[];
    phoneCode: string;
  }
  
  export const countries: CountryInfo[] = [
    {
      id: 1,
      name: 'Bolivia',
      primaryLanguage: 'Español',
      mainCities: ['La Paz', 'Santa Cruz', 'Cochabamba'],
      phoneCode: '+591',
    },
    {
      id: 2,
      name: 'United States',
      primaryLanguage: 'English',
      mainCities: ['New York', 'Los Angeles', 'Chicago'],
      phoneCode: '+1',
    },
    {
      id: 3,
      name: 'Brazil',
      primaryLanguage: 'Português',
      mainCities: ['São Paulo', 'Rio de Janeiro', 'Brasília'],
      phoneCode: '+55',
    },
    {
      id: 4,
      name: 'France',
      primaryLanguage: 'Français',
      mainCities: ['Paris', 'Lyon', 'Marseille'],
      phoneCode: '+33',
    },
    {
      id: 5,
      name: 'Japan',
      primaryLanguage: '日本語 (Japanese)',
      mainCities: ['Tokyo', 'Osaka', 'Kyoto'],
      phoneCode: '+81',
    },
    {
      id: 6,
      name: 'India',
      primaryLanguage: 'हिन्दी (Hindi)',
      mainCities: ['Mumbai', 'Delhi', 'Bangalore'],
      phoneCode: '+91',
    },
    {
      id: 7,
      name: 'Mexico',
      primaryLanguage: 'Español',
      mainCities: ['Ciudad de México', 'Guadalajara', 'Monterrey'],
      phoneCode: '+52',
    },
    {
      id: 8,
      name: 'Canada',
      primaryLanguage: 'English, Français',
      mainCities: ['Toronto', 'Vancouver', 'Montreal'],
      phoneCode: '+1',
    },
    {
      id: 9,
      name: 'Australia',
      primaryLanguage: 'English',
      mainCities: ['Sydney', 'Melbourne', 'Brisbane'],
      phoneCode: '+61',
    },
    {
      id: 10,
      name: 'Germany',
      primaryLanguage: 'Deutsch',
      mainCities: ['Berlin', 'Munich', 'Hamburg'],
      phoneCode: '+49',
    },
  ];
  