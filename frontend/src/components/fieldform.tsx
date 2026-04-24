'use client'

import React from 'react'

import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"

import { Input } from '@/components/ui/input';
import { Controller, FieldValues, Path } from 'react-hook-form';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet'
import { ArrowLeft, Menu } from 'lucide-react'
import { CategoryOption, FieldConfig, FieldFormProps, CurrencyOption } from '@/lib/interfaces/fields'
import { Button } from './ui/button'

export type FieldTypes = 
    | 'text' 
    | 'password' 
    | 'email' 
    | 'select' 
    | 'checkbox'
    | 'search' 
    | 'number'
    | 'textarea'
    | 'url'
    | 'category_selector'
    | 'currency_selector'
    | 'author';

function FieldForm<T extends FieldValues>(
    { 
        onSubmit, 
        form, 
        formId, 
        fieldsConfig 
    }: FieldFormProps<T>
) {

    // Helper for field id generation
    const getFieldId = (name: string, suffix?: string) => 
        `${formId}-${name}${suffix ? `-${suffix}` : ''}`;

    const renderInput = (config: FieldConfig<T>, field: any, fieldState: any) => {
        const baseId = getFieldId(config.name as string);

        switch (config.type) {

            case 'select':
                return (
                    <Select 
                        onValueChange={field.onChange} 
                        value={field.value}
                    >
                        <SelectTrigger 
                            id={baseId} 
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
                );
    
            case 'textarea':
                return (
                    <textarea
                        {...field}
                        id={baseId}
                        placeholder={config.placeholder}
                        className="flex min-h-[120px] w-full rounded-lg border border-input bg-background 
                        px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none 
                        focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    />
                );
    
            case 'number':
                return (
                    <Input
                        {...field}
                        type="number"
                        onChange={(e) => {
                            const val = e.target.value;
                            field.onChange(val === "" ? "" : Number(val));
                          }}
                        id={baseId}
                        value={Number.isNaN(field.value) ? "" : field.value}
                        placeholder={config.placeholder}
                        className="rounded-lg"
                    />
                );

            case 'checkbox':
                return (
                    <div className="flex flex-col gap-3 mt-2">
                        {config.options?.map((opt) => {

                            // Sprawdzamy czy wartość jest w tablicy (dla wielu zaznaczeń)
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
                );
            
            case 'category_selector': {

                const [selectedCat, setSelectedCat] = React.useState<CategoryOption | null>(null);
                const [isSheetOpened, setIsSheetOpened] = React.useState(false);
            
                return (
                    <Sheet 
                        open={isSheetOpened}
                        onOpenChange={(open) => { 
                            setIsSheetOpened(open);
                            if (!open) setSelectedCat(null); 
                        }}      
                    >
                        <SheetTrigger
                            render={
                                <button 
                                    id={baseId}
                                    type="button" 
                                    className="w-full flex justify-between items-center p-2 border rounded-lg 
                                                hover:bg-gray-50 text-sm outline-none cursor-pointer"
                                />
                            }
                        >
                            <span>{field.value || config.placeholder || "Select category..."}</span>
                            <Menu size={18} />
                        </SheetTrigger>
                        <SheetContent side="top" className="rounded-xl lg:m-40 lg:p-10 m-20 p-10 mt-30">
                            <div className="flex flex-col gap-4 p4 h-[50vh]">
                                <h3 className="text-lg font-bold">
                                    {selectedCat ? `Subcategories of ${selectedCat.name}` : "Choose Category"}
                                </h3>
            
                                <div className="grid grid-cols-1 gap-2 overflow-y-auto">
                                    {!selectedCat ? (
                                        // 1. Categories
                                        config.categories?.map((cat) => (
                                            <button
                                                key={cat.id}
                                                type="button"
                                                onClick={() => {
                                                    if (cat.subcategory && cat.subcategory.length > 0) {
                                                        setSelectedCat(cat);
                                                    } else {
                                                        form.setValue("category" as Path<T>, cat.name as any);
                                                        form.setValue("subcategory" as Path<T>, "" as any);
                                                        setIsSheetOpened(false);
                                                    }
                                                }}
                                                className="flex justify-between items-center p-4 border 
                                                rounded-md hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                                            >
                                                {cat.name}
                                                {cat.subcategory && <span className="text-gray-400">→</span>}
                                            </button>
                                        ))
                                    ) : (
                                        // 2. Subcategories
                                        <>
                                            <Button 
                                                onClick={() => setSelectedCat(null)}
                                                variant='ghost'
                                                className="text-md text-blue-600 mb-5 cursor-pointer flex gap-1 justify-start max-w-[200px] "
                                            >   
                                                <ArrowLeft size={20}/>
                                                <p>Return to categories</p>
                                            </Button>
                                            {selectedCat.subcategory?.map((sub) => (
                                                <button
                                                    key={sub.id}
                                                    type="button"
                                                    onClick={() => {
                                                        form.setValue("category" as Path<T>, selectedCat.name as any);
                                                        form.setValue("subcategory" as Path<T>, sub.name as any);
                                                        setIsSheetOpened(false);
                                                    }}
                                                    className={`p-4 border rounded-md cursor-pointer hover:border-blue-500 hover:bg-blue-50 text-left ${field.value?.includes(sub.name) ? 'border-blue-600 bg-blue-50' : ''}`}
                                                >
                                                    {sub.name}
                                                </button>
                                            ))}
                                        </>
                                    )}
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                );
            }

            case 'currency_selector': {
                
                const [selectedCurrency, setSelectedCurrency] = React.useState<CurrencyOption | null>(null);

                return (
                <Sheet onOpenChange={(open) => { if (!open) setSelectedCurrency(null); }}>
                    <SheetTrigger
                        render={
                            <button 
                                id={baseId}
                                type="button" 
                                className="w-full flex justify-between items-center p-2 border rounded-lg hover:bg-gray-50 text-sm outline-none cursor-pointer"
                            />
                        }
                    >
                        <span>{field.value || config.placeholder || "Select currency..."}</span>
                        <Menu size={18} />
                    </SheetTrigger>
                    <SheetContent side="top" className="rounded-xl lg:m-40 lg:p-10 m-20 p-10 mt-30">
                        <div className="flex flex-col gap-4 p-4 overflow-y-auto h-[50vh]">

                            <h3 className="text-lg font-bold">
                                 Choose Currency
                            </h3>

                            <div className="grid grid-cols-1 gap-2">
                                {config.currency?.map((cur) => (
                                    <button
                                        key={cur.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedCurrency(cur);
                                            field.onChange(cur.name);
                                        }}
                                        className="flex justify-between items-center p-4 border 
                                        rounded-md hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                                    >
                                        {cur.name}
                                    </button>
                                ))}
                            </div>

                        </div>
                    </SheetContent>
                </Sheet>
                );
            }

            case 'author': {

                const value = field.value || {};
                
                // Helper for the field updates
                const updateAuthor = (key: string, val: string) => {
                    field.onChange({
                        ...value,
                        [key]: val
                    });
                };
            
                return (
                    <div className="space-y-4 p-4 border rounded-xl bg-gray-50/50">
                        {/* Name and Surname */}
                        <div className="space-y-2">
                            <FieldLabel className="text-xs text-muted-foreground font-bold">Name And Surname</FieldLabel>
                            <Input
                                placeholder="eg. John Smith"
                                value={value.name || ""}
                                onChange={(e) => updateAuthor('name', e.target.value)}
                                className="bg-white"
                            />
                        </div>
            
                        {/* Phone */}
                        <div className="space-y-2">
                            <FieldLabel className="text-xs text-muted-foreground font-bold">Phonenumber</FieldLabel>
                            <Input
                                type="tel"
                                placeholder="e.g. +48 000 000 000"
                                value={value.phone_number || ""}
                                onChange={(e) => updateAuthor('phone_number', e.target.value)}
                                className="bg-white"
                            />
                        </div>
            
                        {/* Firm Name */}
                        <div className="space-y-2">
                            <FieldLabel className="text-xs text-muted-foreground font-bold">Firm Name (Optional)</FieldLabel>
                            <Input
                                placeholder="Name of your firm"
                                value={value.company_name || ""}
                                onChange={(e) => updateAuthor('company_name', e.target.value)}
                                className="bg-white"
                            />
                        </div>
                    </div>
                );
            }

            default:
                return (
                    <Input
                        {...field}
                        type={config.type}
                        id={baseId}
                        placeholder={config.placeholder}
                        autoComplete={config.autoComplete || "off"}
                        className="rounded-lg"
                    />
                );
        }
    };

    return (
        <form 
            id={formId}
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex flex-col items-center justify-center'
        >
            <FieldGroup>
                {fieldsConfig.map((config) => (
                    <Controller
                        key={config.name as string}
                        name={config.name}
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel 
                                    htmlFor={`${formId}-${config.name as string}`}
                                    className='font-bold'
                                >
                                    {config.label}
                                </FieldLabel>
                                
                                {renderInput(config, field, fieldState)}
                                
                            </Field>
                        )}
                    />
                ))}
            </FieldGroup>
        </form>
    )
}

export default FieldForm;