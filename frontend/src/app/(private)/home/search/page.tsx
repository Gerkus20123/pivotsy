import { fetchJobs, fetchJobsCatSubCat } from '@/lib/api/fetching';
import JobCard from '@/components/job-card';
import Pagination from '@/components/pagination';
import CategoryAndSubcategoryFilter from '@/components/categoryAndSubcategoryFilter';

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

async function SearchOffers({ searchParams }: PageProps) {
    
    const sParams = await searchParams;
    const currentPage = Number(sParams.page) || 1;
    const selectedCategory = (sParams.category as string) || undefined;
    const selectedSubcategory = (sParams.subcategory as string) || undefined;
    const [jobsResponse, stats] = await Promise.all([
        fetchJobs(selectedCategory, selectedSubcategory, currentPage),
        fetchJobsCatSubCat()
    ]);

    return (
        <div className='min-h-screen'>
            {/* Page Title */}
            <h1 className="text-3xl font-bold mb-8">Offers</h1>
            
            <hr></hr>
            
            {/* Filtration by price */}
            <div>
                <h2 className='font-bold text-xl mt-10'>Filters</h2>

                {/* Filtration by category and subcategogy */}
                <CategoryAndSubcategoryFilter 
                    stats={stats} 
                />
            </div>

            {/* Job Offers */}
            <JobCard 
                jobs={jobsResponse.items}
            /> 

            {/* Pagination */}
            <Pagination 
                currentPage={currentPage}
                totalPages={jobsResponse.pages}
            />
            
        </div>
    )
}

export default SearchOffers;