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
  | 'dualListboxModal'      // multiple dual listboxes inside a modal
  | 'weeklyAvailability'    // for full-week selection
  | 'button';               // for buttons that trigger actions

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
    | string[]                                      // multiDropdown or subValues
    | Record<string, WeekDayAvailability>          // weeklyAvailability
    | {                                            // dualListboxModal
        sourceId: string;
        targetId: string;
        selectedValues: string[];
      }[];
  optional?: boolean;
  subValues?: string[];                            // facilityModal or multiDropdown
}
