interface ResourceTypeSelectorProps {
  resourceTypes: { label: string; value: string }[]
  selectedType: string
  onTypeChange: (type: string) => void
}

export function ResourceTypeSelector({
  resourceTypes,
  selectedType,
  onTypeChange,
}: ResourceTypeSelectorProps) {
  return (
    <div className='flex mb-6 items-center'>
      {resourceTypes.map((rt, idx) =>
        selectedType === rt.value ? (
          <button
            key={rt.value}
            className='px-4 py-2 rounded-full font-medium bg-primary/20 text-white shadow border-2 border-primary transition'
            style={{
              boxShadow: '0 2px 8px rgba(99,102,241,0.15)',
              marginRight: idx !== resourceTypes.length - 1 ? '4rem' : undefined, // Add more space between items
            }}
            disabled
          >
            {rt.label}
          </button>
        ) : (
          <span
            key={rt.value}
            className='cursor-pointer text-foreground hover:text-primary font-medium transition'
            style={{
              marginRight: idx !== resourceTypes.length - 1 ? '4rem' : undefined, // Add more space between items
            }}
            onClick={() => onTypeChange(rt.value)}
          >
            {rt.label}
          </span>
        )
      )}
    </div>
  )
}
