export interface EVCar {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  image: string;
  category: 'Sedan' | 'SUV' | 'Hatchback' | 'Crossover';
  specs: {
    range: number; // km
    battery: number; // kWh
    charging: string;
    topSpeed: number; // km/h
    acceleration: string; // 0-100 km/h
    seats: number;
    power: number; // hp
  };
  features: string[];
  description: string;
}

export interface UserPreferences {
  budget: string;
  carType: string;
  range: string;
  usage: string;
  features: string[];
  seating: string;
  charging: string;
  brand: string;
  performance: string;
  priority: string;
}
