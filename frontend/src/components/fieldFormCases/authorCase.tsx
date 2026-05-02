import { Author, FieldConfig } from '@/lib/interfaces/fields';
import { FieldLabel } from "@/components/ui/field"
import { Input } from '@base-ui/react';

function AuthorCase({
    field,
    base_id
} : {
    field: any,
    base_id: string
}) {

    const value = (field.value as Author) || {};
                
    // Helper for the field updates
    const updateAuthor = (key: keyof Author, val: string) => {
        field.onChange({
            ...value,
            [key]: val
        });
    };

    return (
        <div className="space-y-4 p-4 border rounded-xl bg-gray-50/50">
            {/* Name and Surname */}
            <div className="space-y-2">
                <FieldLabel 
                    className="text-xs text-muted-foreground font-bold"
                    htmlFor={base_id}
                >
                    Name And Surname
                </FieldLabel>
                <div className='mx-2'>
                    <Input
                        id={base_id}
                        placeholder="eg. John Smith"
                        value={value.name || ""}
                        onChange={(e) => updateAuthor('name', e.target.value)}
                        className="bg-white w-full"
                    /> 
                </div>
                
            </div>

            {/* Phone */}
            <div className="space-y-2">
                <FieldLabel 
                    className="text-xs text-muted-foreground font-bold"
                    htmlFor={`${base_id}-phone_number`}
                >
                    Phone Number
                </FieldLabel>
                <div className='mx-2'>
                    <Input
                        id={`${base_id}-phone_number`}
                        type="tel"
                        placeholder="e.g. +48 000 000 000"
                        value={value.phone_number || ""}
                        onChange={(e) => updateAuthor('phone_number', e.target.value)}
                        className="bg-white w-full"
                    /> 
                </div>
                
            </div>

            {/* Firm Name */}
            <div className="space-y-2">
                <FieldLabel 
                    className="text-xs text-muted-foreground font-bold"
                    htmlFor={`${base_id}-company_name`}
                >
                    Firm Name (Optional)
                </FieldLabel>
                <div className='mx-2'>
                    <Input
                        id={`${base_id}-company_name`}
                        placeholder="Name of your firm"
                        value={value.company_name || ""}
                        onChange={(e) => updateAuthor('company_name', e.target.value)}
                        className="bg-white w-full box-border"
                    />  
                </div>
                
            </div>
        </div>
    )
}

export default AuthorCase;