import { FieldTypes } from "@/components/fieldform";
import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export interface CategoryOption {
    id: string;
    name: string;
    subcategory?: {
        id: string;
        name: string;
    }[];
};

export interface CurrencyOption {
    id: string,
    name: string
};

export interface SelectOption {
    label: string;
    value: string;
};

export interface FieldConfig<T extends FieldValues> {
    name: Path<T>;
    label: string;
    placeholder?: string;
    type: FieldTypes;
    options?: SelectOption[];
    autoComplete?: string;
    defaultChecked?: boolean;
    categories?: CategoryOption[];
    currency?: { id: string; name: string }[];
};

export interface FieldFormProps<T extends FieldValues> {
    onSubmit: (data: T) => void;
    form: UseFormReturn<T>;
    fieldsConfig: FieldConfig<T>[];
    formId: string;
};

export interface Author {
    name?: string;
    phone_number?: string;
    company_name?: string;
}