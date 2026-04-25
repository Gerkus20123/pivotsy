import { CurrencyOption, FieldConfig } from '@/lib/interfaces/fields';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import React from 'react'
import { Menu } from 'lucide-react';
import { Path } from 'react-hook-form';

function CurrencySelectCase({
    field, 
    base_id, 
    config,
    form
} : { 
    field: any, 
    base_id: string, 
    config: FieldConfig<any>,
    form: any 
}) {

    const [selectedCurrency, setSelectedCurrency] = React.useState<CurrencyOption | null>(null);
    const [isSheetOpened, setIsSheetOpened] = React.useState(false);

    return (
        <Sheet
            open={isSheetOpened} 
            onOpenChange={(open) => { 
                setIsSheetOpened(open);
                if (!open) setSelectedCurrency(null); 
            }}
        >
            <SheetTrigger
                render={
                    <button 
                        id={base_id}
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
                                    form.setValue("currency" as Path<any>, cur.name as any);
                                    setIsSheetOpened(false)
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

export default CurrencySelectCase;