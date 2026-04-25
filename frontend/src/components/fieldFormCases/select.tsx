import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { FieldConfig } from '@/lib/interfaces/fields';

function SelectCase({ 
    field, 
    base_id, 
    config 
} : { 
    field: any, 
    base_id: string, 
    config: FieldConfig<any> 
}) {
  return (
    <Select 
        onValueChange={field.onChange} 
        value={field.value}
    >
        <SelectTrigger 
            id={base_id} 
            className="rounded-lg"
        >
            <SelectValue placeholder={config.placeholder} />
        </SelectTrigger>
        <SelectContent className="rounded-lg">
            {config.options?.map((opt) => (
                <SelectItem 
                    key={opt.value} 
                    value={opt.value}
                >
                    {opt.value}
                </SelectItem>
            ))}
        </SelectContent>
    </Select>
  )
}

export default SelectCase;