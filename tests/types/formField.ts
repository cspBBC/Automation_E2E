export type FieldType =
  | 'text'
  | 'number'
  | 'textarea'
  | 'dropdown'
  | 'multiDropdown'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'facilityModal'
  | 'weeklyAvailability'; // for full-week selection

// Interface for each day's availability in weeklyAvailability
export interface WeekDayAvailability {
  from: string;       // e.g., "09:00"
  to: string;         // e.g., "17:00"
  unavailable: boolean;
}

// Main form field interface
export interface FormField {
  type: FieldType;
  value:
    | string
    | number
    | string[]                     // for multiDropdown or subValues
    | Record<string, WeekDayAvailability>; // for weeklyAvailability
  optional?: boolean;
  subValues?: string[];           // for facilityModal or multiDropdown
}