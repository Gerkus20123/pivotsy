'use client'

import React from 'react'

import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"

import { Checkbox } from "@/components/ui/checkbox"
import { Input } from '@/components/ui/input';
import { Controller, ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { Author, FieldConfig, FieldFormProps } from '@/lib/interfaces/fields'
import SelectCase from './fieldFormCases/select'
import CategorySelectCase from './fieldFormCases/categorySelectCase';
import CurrencySelectCase from './fieldFormCases/currencySelectCase';
import TextArea from './fieldFormCases/textarea';

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

    const renderInput = (
        config: FieldConfig<T>, 
        field: ControllerRenderProps<T, Path<T>>, 
        fieldState: any
    ) => {
        const baseId = getFieldId(config.name as string);

        switch (config.type) {

            case 'select':
                return (
                   <SelectCase field={field} base_id={baseId} config={config}/> 
                );
                
            case 'textarea':
                return (
                    // <textarea
                    //     {...field}
                    //     id={baseId}
                    //     placeholder={config.placeholder}
                    //     className="flex min-h-[120px] w-full rounded-lg border border-input bg-background 
                    //     px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none 
                    //     focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                    // />
                    <TextArea 
                        value={field.value || ""} 
                        onChange={(val: string) => field.onChange(val)} 
                        field={field} 
                        config={config} 
                        base_id={baseId} 
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
            
            case 'category_selector': 
                return (<CategorySelectCase field={field} base_id={baseId} config={config} form={form}/>);

            case 'currency_selector':
                return (<CurrencySelectCase field={field} base_id={baseId} form={form} config={config}/>);

            case 'author': {

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