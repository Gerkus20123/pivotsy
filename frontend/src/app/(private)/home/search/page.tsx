'use client'

import { Button } from '@/components/ui/button';
import { ArrowLeft, ArrowRight, ChevronUp, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react'
import axiosInstance from '@/lib/axios';
import { fetchFollowedJobIds, fetchJobs, fetchJobsCatSubCat } from '@/lib/api/fetching';
import { Job } from '@/lib/interfaces/job';
import JobCard from '@/components/job-card';
import { JobCategoryOptions } from '../../../../../constants/job_category_options';
import { cn } from '@/lib/utils';
import { JobStats } from '@/lib/interfaces/jobStats';

function SearchOffers() {

    const [jobs, setJobs] = useState<Job[]>([]);
    const [followedJobs, setFollowedJobs] = useState<number[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
    const [stats, setStats] = useState<JobStats>({
        categories: {},
        subcategories: {}
    });
    const [isCategoryFilterOpen, setIsCategoryFilterOpen] = useState(false);

    const handleFollowed = async (jobId: number) => {
        try {

            const response = await axiosInstance.post(`/jobs/${jobId}/follow`)

            setFollowedJobs(prev =>
                prev.includes(jobId)
                    ? prev.filter(id => id !== jobId)
                    : [...prev, jobId]
            );

            console.log(response.data.message); 
        } catch (error) {
            console.error("Błąd podczas obserwowania oferty:", error);
            alert("Musisz być zalogowany, aby obserwować oferty!");
        }
    };


    useEffect(() => {
        const loadData = async () => {
            try {
                const [jobsData, followedIds] = await Promise.all([
                    fetchJobs(selectedCategory, selectedSubcategory),
                    fetchFollowedJobIds()
                ]);
                setJobs(jobsData);
                setFollowedJobs(followedIds);
            } catch (error) {
                console.error("An error occured while loading the job data:", error);
                alert("An error occured while loaidng the job data.");
            }
        };

        loadData();
    }, [selectedCategory, selectedSubcategory])

    useEffect(() => {
        const loadStats = async () => {
            const statsData = await fetchJobsCatSubCat();
            setStats(statsData);
        };
        loadStats()
    }, [])

    return (
        <div className='min-h-screen'>
            {/* Page Title */}
            <h1 className="text-3xl font-bold mb-8">Offers</h1>
            
            <hr></hr>
            
            {/* Filtration by price */}
            <div>
                <h2 className='font-bold text-xl mt-10'>Filters</h2>

                {/* Filtration by category and subcategogy */}
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
                        <div className='grid lg:grid-cols-5 grid-cols-3 mt-5 gap-4'>
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
                                            "flex gap-2 h-8 rounded-full text-xs font-medium transition-colors border",
                                            isCatActive 
                                                ? "bg-blue-100 text-blue-600 border-gray-300" 
                                                : "bg-white text-slate-600 border-slate-200 hover:border-gray-200"
                                        )}
                                        onClick={() => {
                                            setSelectedCategory(isCatActive ? null : cat.name);
                                            setSelectedSubcategory(null);
                                        }}
                                    >
                                        <IconComponent 
                                            size={20} 
                                            className={cn("text-slate-600", isCatActive ? "text-blue-600" : "")}
                                        />
                                            <p className='whitespace-normal text-[10px]'> {cat.name} </p>
                                            <p className='font-bold'> {countCat} </p>                   
                                    </Button>
                                )
                            })}      
                        </div>  
                    )}
                    
                    {/* Subcategory */}
                    {selectedCategory && (
                        <div className="mt-6 animate-in fade-in slide-in-from-top-2">
                            <h3 className="text-sm font-semibold text-slate-600 mb-3">Narrow down your search:</h3>
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
                                            onClick={() => setSelectedSubcategory(isSubActive ? null : subcat.name)}
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
                                            <p className='whitespace-normal text-[10px]'>{subcat.name}</p>
                                            <p className='font-bold'> {countSubCat} </p>
                                        </Button>
                                    )
                                    
                                })}    
                            </div>           
                        </div>
                    )}

                </div>  
            </div>

            {/* Job Offers */}
            <JobCard 
                jobs={jobs} 
                followedJobs={followedJobs} 
                onFollow={handleFollowed}
            /> 

            {/* Pagination */}
            <div className='flex items-center justify-center gap-5 mt-10'>
                <Button
                    variant="outline"
                >
                    <ArrowLeft />
                </Button>
                <p className='font-bold text-lg'> Page 1</p>
                <Button
                    variant="default"
                >
                    <ArrowRight />
                </Button>
            </div>
        </div>
    )
}

export default SearchOffers;