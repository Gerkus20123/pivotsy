import { FieldConfig } from '@/lib/interfaces/fields';
import { Checkbox } from '../ui/checkbox';
import { FieldLabel } from '../ui/field';

function CheckboxCase({
    config,
    field,
    getFieldId
} : {
    config: FieldConfig<any>,
    field: any,
    getFieldId: any
}) {
    return (
        <div className="flex flex-col gap-3 mt-2">
            {config.options?.map((opt) => {

                // Checking wether the value is in the table (for multiple checked options)
                const isChecked = Array.isArray(field.value) 
                    ? field.value.includes(opt.value) 
                    : field.value === opt.value;
                
                const checkboxId = getFieldId(config.name as string, opt.value);
                
                return (
                    <div key={opt.value} className="flex items-center gap-2">
                        <Checkbox
                            id={checkboxId}
                            checked={isChecked}
                            onCheckedChange={(checked) => {
                                if (Array.isArray(field.value)) {
                                    const newValue = checked
                                        ? [...field.value, opt.value]
                                        : field.value.filter((v: string) => v !== opt.value);
                                    field.onChange(newValue);
                                } else {
                                    field.onChange(checked ? opt.value : "");
                                }
                            }}
                        />
                        <FieldLabel
                            htmlFor={checkboxId}
                            className="font-normal cursor-pointer"
                        >
                            {opt.value}
                        </FieldLabel>
                    </div>
                );
            })}
        </div>
    )
}

export default CheckboxCase;