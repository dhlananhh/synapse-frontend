import React from 'react'

interface LinkViewerProps {
  links: {
    url: string
    title: string
    description: string
    thumbnail: string | null
  }[]
}

export default function LinkViewer({ links }: LinkViewerProps) {
  return (
    <div className='space-y-4'>
      {links.map((link, index) => (
        <a
          key={index}
          href={link.url}
          target='_blank'
          rel='noopener noreferrer'
          className='block border border-gray-700 rounded-2xl overflow-hidden hover:shadow-md transition-shadow duration-200 bg-gray-900 h-32'
        >
          <div className='flex'>
            {/* Thumbnail */}
            {link.thumbnail && (
              <div className='flex-shrink-0 aspect-square'>
                <img
                  src={link.thumbnail}
                  alt={link.title}
                  className='w-32 h-32 object-cover border-r border-gray-700'
                />
              </div>
            )}

            {/* Metadata */}
            <div className='p-4 flex-1'>
              <h4 className='font-bold text-lg text-ưhite mb-2'>{link.title}</h4>
              <p className='text-sm text-ưhite'>{link.description}</p>
            </div>
          </div>
        </a>
      ))}
    </div>
  )
}
