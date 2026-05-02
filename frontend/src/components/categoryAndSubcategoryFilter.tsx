'use client'

import { Button } from './ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { JobCategoryOptions } from '../../constants/job_category_options';
import { JobStats } from '@/lib/interfaces/jobStats';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface Props {
    stats: JobStats;
}

function CategoryAndSubcategoryFilter({ stats }: Props) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const selectedCategory = searchParams.get('category');
    const selectedSubcategory = searchParams.get('subcategory');

    const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);
    
    const updateFilters = (cat: string | null, sub: string | null) => {
        const params = new URLSearchParams(searchParams.toString());
        
        if (cat) params.set('category', cat);
        else params.delete('category');
        
        if (sub) params.set('subcategory', sub);
        else params.delete('subcategory');
        
        params.set('page', '1');
        
        router.push(`?${params.toString()}`, { scroll: false });
    };

    return (
        <div>
            <Button 
                className='font-bold text-l mt-5'
                variant='outline'
                onClick={() => setIsCategoryFilterOpen(!isCategoryFilterOpen ? true : false)}
            >
                Categories
                {isCategoryFilterOpen ? (
                    <ChevronUp
                        size={20}
                    />
                ) : (
                    <ChevronDown
                        size={20}
                    />
                )}                 
            </Button>
            
            {/* Category */}
            {isCategoryFilterOpen && (
                <div className='grid lg:grid-cols-5 grid-cols-2 mt-5 gap-4'>
                    {JobCategoryOptions.map((cat) => {
                        
                        const IconComponent = cat.icon;
                        if (!IconComponent) return null;

                        const isCatActive = selectedCategory === cat.name;
                        const countCat = stats.categories[cat.name] || 0;

                        return (
                            <Button 
                                key={cat.id} 
                                variant="outline"
                                className={cn(
                                    "flex gap-2 h-8 rounded-full lg:text-xs text-[8px] font-medium transition-colors border",
                                    isCatActive 
                                        ? "bg-blue-100 text-blue-600 border-gray-300" 
                                        : "bg-white text-slate-600 border-slate-200 hover:border-gray-200"
                                )}
                                onClick={() => {
                                    const nextCat = isCatActive ? null : cat.name;
                                    updateFilters(nextCat, null);
                                }}
                            >
                                <IconComponent 
                                    size={20} 
                                    className={cn("text-slate-600", isCatActive ? "text-blue-600" : "")}
                                />
                                    <p className='whitespace-normal lg:text-[10px] text-[7px]'> {cat.name} </p>
                                    <p className='font-bold'> {countCat} </p>                   
                            </Button>
                        )
                    })}      
                </div>  
            )}
            
            {/* Subcategory */}
            {selectedCategory && (() => {

                const currentCat = JobCategoryOptions.find(c => c.name === selectedCategory);
                
                if (!currentCat?.subcategory || currentCat.subcategory.length === 0) {
                    return null;
                }

                return (
                    <div className="mt-6 animate-in fade-in slide-in-from-top-2">
                    <h3 className="text-sm font-semibold text-slate-600 mb-3">Narrow down your search</h3>
                    <div className="flex flex-wrap gap-2">
                        {JobCategoryOptions.find(c => c.name === selectedCategory)?.subcategory?.map((subcat) => {

                            const isSubActive = selectedSubcategory === subcat.name;

                            const IconComponent = subcat.icon;
                            if (!IconComponent) return null;
                            
                            const countSubCat = stats.subcategories[subcat.name] || 0;

                            return (
                                <Button
                                    key={subcat.id}
                                    variant='outline'
                                    onClick={() => updateFilters(selectedCategory, isSubActive ? null : subcat.name)}
                                    className={cn(
                                        "flex gap-1 px-3 py-1 rounded-full text-xs font-medium transition-colors border",
                                        isSubActive 
                                        ? "bg-blue-100 text-blue-600 border-gray-300" 
                                        : "bg-white text-slate-600 border-slate-200 hover:border-gray-200"
                                    )}
                                >   
                                    <IconComponent 
                                        size={20} 
                                        className={cn("text-slate-600", isSubActive ? "text-blue-600" : "")}
                                    />
                                    <p className='whitespace-normal lg:text-[10px] text-[7px]'>{subcat.name}</p>
                                    <p className='font-bold'> {countSubCat} </p>
                                </Button>
                            )
                            
                        })}    
                    </div>           
                </div>
                );
                
            })()}
        </div> 
    )
}

export default CategoryAndSubcategoryFilter;