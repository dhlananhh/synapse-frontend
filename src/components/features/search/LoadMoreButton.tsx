interface LoadMoreButtonProps {
  loading: boolean
  onClick: () => void
}

export function LoadMoreButton({ loading, onClick }: LoadMoreButtonProps) {
  return (
    <div className='flex justify-center mt-4'>
      <button
        onClick={onClick}
        disabled={loading}
        className='px-4 py-2 rounded-lg bg-primary text-white font-medium shadow hover:bg-primary/90 transition'
      >
        {loading ? 'Loading...' : 'Load More'}
      </button>
    </div>
  )
}
