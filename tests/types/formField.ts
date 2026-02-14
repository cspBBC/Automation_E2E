export type FieldType =
    | 'text'
    | 'number'
    | 'textarea'
    | 'dropdown'
    | 'multiDropdown'
    | 'radio'
    | 'checkbox'
    | 'date';

export interface FormField {
    type: FieldType;       // Type of input
    value: any;            // Value to fill (string, number, array for multi-select)
    optional?: boolean;    // True if this field may not exist in the DOM
}