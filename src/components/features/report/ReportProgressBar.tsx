import React from 'react'
import { ReasonColorMapping } from '@/libs/ReasonColorMapping'

interface ReportProgressBarProps {
  reasonProportions: {
    reason: keyof typeof ReasonColorMapping
    proportion: number
    count: number
  }[]
  totalReports: number
}

export default function ReportProgressBar({
  reasonProportions,
  totalReports,
}: ReportProgressBarProps) {
  return (
    <div>
      {/* Progress Bar */}
      <div className='flex items-center gap-4 mb-4'>
        <div className='flex-1 h-4 rounded-lg overflow-hidden bg-gray-200'>
          <div className='flex h-full'>
            {reasonProportions.map((reason) => (
              <div
                key={reason.reason}
                style={{
                  width: `${reason.proportion}%`,
                  backgroundColor: ReasonColorMapping[reason.reason],
                }}
                title={`${reason.reason}: ${reason.proportion.toFixed(2)}% (${
                  reason.count
                } reports)`} // Tooltip includes count
              />
            ))}
          </div>
        </div>

        {/* Total Reports */}
        <div className='flex items-center gap-2'>
          <span className='text-sm font-medium'>Reports:</span>
          <span className='px-2 py-1 text-xs font-bold text-white bg-red-500 rounded-full'>
            {totalReports}
          </span>
        </div>
      </div>

      {/* Description Section */}
      <div className='mt-2'>
        <ul className='space-y-2'>
          {reasonProportions.map((reason) => (
            <li key={reason.reason} className='flex items-center gap-2'>
              <span
                className='w-4 h-4 rounded-full'
                style={{ backgroundColor: ReasonColorMapping[reason.reason] }}
                title={reason.reason}
              />
              <span className='text-sm text-gray-500'>
                {reason.reason}: {reason.proportion.toFixed(1)}% ({reason.count} report
                {reason.count > 1 ? 's' : ''})
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
