'use client'

import { Button } from './ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation'

function Pagination({
    currentPage,
    totalPages,
} : {
    currentPage: number,
    totalPages: number,
}) {

    const router = useRouter();
    const searchParams = useSearchParams();

    const handlePageChange = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set('page', page.toString());
        router.push(`?${params.toString()}`);
    };

    return (
        <div className='flex items-center justify-center gap-5 mt-10'>
            <Button
                variant="outline"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
            >
                <ArrowLeft />
            </Button>

            <p className='font-bold text-lg'> 
                Page {currentPage} of {totalPages}
            </p>
            
            <Button
                variant="default"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
            >
                <ArrowRight />
            </Button>
        </div>
    )
}

export default Pagination;