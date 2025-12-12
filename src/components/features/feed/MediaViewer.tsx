import React, { useState } from 'react'
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react'

interface MediaViewerProps {
  media: { key: string; url: string }[] // Updated to match the FeedItem type
}

export default function MediaViewer({ media }: MediaViewerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : media.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex < media.length - 1 ? prevIndex + 1 : 0))
  }

  const openFullscreen = () => {
    setIsFullscreen(true)
  }

  const closeFullscreen = () => {
    setIsFullscreen(false)
  }

  // Determine media type by parsing the key
  const getMediaType = (key: string): 'image' | 'video' => {
    const folder = key.split('/')[3] // Extract the folder (images or videos)
    return folder === 'videos' ? 'video' : 'image'
  }

  return (
    <>
      {/* Main Media Viewer */}
      <div className='relative w-full h-96 bg-black rounded-lg overflow-hidden'>
        {getMediaType(media[currentIndex].key) === 'image' ? (
          <img
            src={media[currentIndex].url}
            alt={`Media ${currentIndex + 1}`}
            className='w-full h-full object-cover cursor-pointer'
            onClick={openFullscreen} // Open fullscreen on click
          />
        ) : (
          <video
            src={media[currentIndex].url}
            className='w-full h-full object-cover cursor-pointer'
            controls
            onClick={openFullscreen} // Open fullscreen on click
          />
        )}

        {/* Navigation Buttons */}
        {media.length > 1 && (
          <>
            <button
              onClick={handlePrevious}
              className='absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition'
            >
              <ChevronLeft className='h-6 w-6' />
            </button>
            <button
              onClick={handleNext}
              className='absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition'
            >
              <ChevronRight className='h-6 w-6' />
            </button>
          </>
        )}

        {/* Indicator */}
        <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2'>
          {media.map((_, index) => (
            <div
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === currentIndex ? 'bg-white' : 'bg-gray-500'
              }`}
            ></div>
          ))}
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={openFullscreen}
          className='absolute top-4 right-4 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition'
        >
          <Maximize2 className='h-5 w-5' />
        </button>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className='fixed inset-0 bg-black/90 flex items-center justify-center z-50'>
          {getMediaType(media[currentIndex].key) === 'image' ? (
            <img
              src={media[currentIndex].url}
              alt={`Media ${currentIndex + 1}`}
              className='max-w-full max-h-full object-contain'
            />
          ) : (
            <video
              src={media[currentIndex].url}
              className='max-w-full max-h-full object-contain'
              controls
            />
          )}

          {/* Navigation Buttons */}
          {media.length > 1 && (
            <>
              <button
                onClick={handlePrevious}
                className='absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition'
              >
                <ChevronLeft className='h-6 w-6' />
              </button>
              <button
                onClick={handleNext}
                className='absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-800 text-white rounded-full p-2 hover:bg-gray-700 transition'
              >
                <ChevronRight className='h-6 w-6' />
              </button>
            </>
          )}

          {/* Close Button */}
          <button
            onClick={closeFullscreen}
            className='absolute top-4 right-4 text-white hover:text-gray-300'
          >
            <X className='h-6 w-6' />
          </button>
        </div>
      )}
    </>
  )
}
