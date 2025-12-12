import React, { useState } from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'

interface ReasonDetailsAccordionProps {
  reasonDetails: string[]
}

export default function ReasonDetailsAccordion({ reasonDetails }: ReasonDetailsAccordionProps) {
  const itemsPerPage = 10 // Number of items per page
  const totalPages = Math.ceil(reasonDetails.length / itemsPerPage) // Calculate total pages
  const [currentPage, setCurrentPage] = useState(1) // Track the current page

  // Get the current page's items
  const paginatedItems = reasonDetails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <Accordion type='single' collapsible>
      <AccordionItem value='reason-details'>
        <AccordionTrigger className='text-sm font-medium'>Reason Details</AccordionTrigger>
        <AccordionContent>
          <ul className='list-disc pl-5 space-y-2'>
            {paginatedItems.map((detail, index) => (
              <li key={index} className='text-sm text-gray-500'>
                {detail}
              </li>
            ))}
          </ul>

          {/* Pagination Controls */}
          <div className='flex justify-between items-center mt-4'>
            <Button
              variant='secondary'
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              Previous
            </Button>
            <span className='text-sm text-gray-500'>
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant='secondary'
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              Next
            </Button>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}
