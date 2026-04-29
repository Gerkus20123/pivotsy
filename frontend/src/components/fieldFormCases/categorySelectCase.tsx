import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Path } from 'react-hook-form';
import { ArrowLeft, Menu } from 'lucide-react';
import { CategoryOption, FieldConfig } from '@/lib/interfaces/fields';
import CustomScroll from '../scrollbar';
import { JobCategoryOptions } from '../../../constants/job_category_options';

function CategorySelectCase({
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
                        id={base_id}
                        type="button" 
                        className="w-full flex justify-between items-center p-2 border rounded-lg 
                                    hover:bg-gray-50 text-xs outline-none cursor-pointer"
                    />
                }
            >       
                    <div className='flex gap-2'>
                        {(() => {

                            const categoryConfig = JobCategoryOptions.find(c => c.name === (form.watch("category")));
                            const subcategoryConfig = categoryConfig?.subcategory?.find(s => s.name === (form.watch("category") && form.watch("subcategory")))

                            const IconToRender = subcategoryConfig?.icon ? (subcategoryConfig?.icon) : (categoryConfig?.icon);

                            return IconToRender ? (
                                <IconToRender 
                                    size={18} 
                                    className="text-gray-500" 
                                />
                            ) : null;
                        })()}
                        {form.watch("category") && form.watch("subcategory") 
                            ? `${form.watch("category")} > ${form.watch("subcategory")}`
                            : form.watch("category") || config.placeholder || "Select category..."
                        }   
                    </div>
                    
                <Menu size={15} />
            </SheetTrigger>

            <SheetContent side="top" className="rounded-xl lg:m-40 lg:p-10 m-20 p-10 mt-30">
                <div className="flex flex-col gap-4 p4 h-[50vh]">
                    <h3 className="text-lg font-bold">
                        {selectedCat ? `Subcategories of ${selectedCat.name}` : "Choose Category"}
                    </h3>

                    <CustomScroll 
                            className='w-full rounded-xl lg:max-h-[320px] xl:h-75 h-50'
                            childrenType='mr-10'
                        >
                        <div className="grid grid-cols-1 gap-2">
                            
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
                                                    form.setValue("category" as Path<any>, cat.name as any);
                                                    form.setValue("subcategory" as Path<any>, "" as any);
                                                    setIsSheetOpened(false);
                                                }
                                            }}
                                            className="flex justify-between items-center p-4 border 
                                            rounded-md hover:border-blue-500 hover:bg-blue-50 transition-colors cursor-pointer"
                                        >
                                            <div className='flex gap-2'>
                                                {(() => {

                                                    const categoryConfig = JobCategoryOptions.find(c => c.name === cat.name);

                                                    const IconToRender = categoryConfig?.icon;

                                                    return IconToRender ? (
                                                        <IconToRender 
                                                            size={18} 
                                                            className="text-gray-500" 
                                                        />
                                                    ) : null;
                                                })()}
                                                {cat.name}
                                            </div>
                                            
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
                                                    form.setValue("category" as Path<any>, selectedCat.name as any);
                                                    form.setValue("subcategory" as Path<any>, sub.name as any);
                                                    setIsSheetOpened(false);
                                                }}
                                                className={`p-4 border rounded-md cursor-pointer hover:border-blue-500 hover:bg-blue-50 text-left ${field.value?.includes(sub.name) ? 'border-blue-600 bg-blue-50' : ''}`}
                                            >   
                                                <div className='flex gap-2'>
                                                    {(() => {

                                                        const categoryConfig = JobCategoryOptions.find(c => c.name === selectedCat.name);
                                                        const subcategoryConfig = categoryConfig?.subcategory?.find(s => s.name === sub.name)

                                                        const IconToRender = subcategoryConfig?.icon;

                                                        return IconToRender ? (
                                                            <IconToRender 
                                                                size={18} 
                                                                className="text-gray-500" 
                                                            />
                                                        ) : null;
                                                    })()}
                                                    {sub.name}
                                                </div>
                                            </button>
                                        ))}
                                    </>
                                )}
                             
                        </div>
                    </CustomScroll>
                </div>
            </SheetContent>

        </Sheet>
    );
}

export default CategorySelectCase;