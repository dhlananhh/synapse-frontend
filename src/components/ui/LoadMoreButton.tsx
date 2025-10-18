import React from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from './button'

export function LoadMoreButton({ loading, onClick }: { loading: boolean; onClick: () => void }) {
  return (
    <div className='flex justify-center border-t pt-3'>
      <Button variant='outline' onClick={onClick} disabled={loading}>
        {loading && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
        Load more
      </Button>
    </div>
  )
}
