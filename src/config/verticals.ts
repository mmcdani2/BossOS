// src/config/verticals.ts

export const VERTICALS = [
  "HVAC",
  "Spray Foam Insulation",
  "Plumbing",
  "Electrical",
  "Roofing",
  "Landscaping / Lawn Care",
  "Pest Control",
  "Garage Doors",
  "House Cleaning",
  "Pool Service"
] as const;

export type Vertical = typeof VERTICALS[number];
