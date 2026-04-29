import React from 'react'
import { Button } from './ui/button';
import { ArrowLeft, ArrowRight } from 'lucide-react';

function Pagination({
    currentPage,
    totalPages,
    onPageChange
} : {
    currentPage: number,
    totalPages: number,
    onPageChange: (page: number) => void
}) {

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            onPageChange(currentPage - 1)
        }      
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            onPageChange(currentPage + 1)
        }
    };

    return (
        <div className='flex items-center justify-center gap-5 mt-10'>
            <Button
                variant="outline"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
            >
                <ArrowLeft />
            </Button>

            <p className='font-bold text-lg'> 
                Page {currentPage} of {totalPages}
            </p>
            
            <Button
                variant="default"
                onClick={handleNextPage}
                disabled={currentPage === totalPages}
            >
                <ArrowRight />
            </Button>
        </div>
    )
}

export default Pagination;