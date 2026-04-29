'use client'

import React from 'react'

import {
    Field,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"

import { Input } from '@/components/ui/input';
import { Controller, ControllerRenderProps, FieldValues, Path } from 'react-hook-form';
import { FieldConfig, FieldFormProps } from '@/lib/interfaces/fields'
import SelectCase from './fieldFormCases/select'
import CategorySelectCase from './fieldFormCases/categorySelectCase';
import CurrencySelectCase from './fieldFormCases/currencySelectCase';
import TextArea from './fieldFormCases/textarea';
import AuthorCase from './fieldFormCases/authorCase';
import CheckboxCase from './fieldFormCases/checkboxCase';
import ImageUploadCase from './fieldFormCases/imageUploaderCase';

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
    | 'author'
    | 'image_uploader';;

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
                   <SelectCase 
                        field={field} 
                        base_id={baseId} 
                        config={config}
                   /> 
                );
                
            case 'textarea':
                return (
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
                    <CheckboxCase 
                        field={field}
                        config={config}
                        getFieldId={getFieldId}
                    />
                );
            
            case 'category_selector': 
                return (
                    <CategorySelectCase 
                        field={field} 
                        base_id={baseId} 
                        config={config} 
                        form={form}
                    />
                );

            case 'currency_selector':
                return (
                    <CurrencySelectCase 
                        field={field} 
                        base_id={baseId} 
                        form={form} 
                        config={config}
                    />
            );

            case 'author':
                return (
                    <AuthorCase 
                        field={field}
                    />
                );
            
            case 'image_uploader':
                return (
                    <ImageUploadCase 
                        field={field}
                        config={config}
                    />
                )

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