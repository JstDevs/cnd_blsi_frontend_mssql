import React from 'react'

const NoRecord = () => {
  return (
    <div className='bg-white shadow-sm rounded-lg border border-neutral-200 py-12'>
      <div className='flex flex-col items-center justify-center gap-2'>
        <svg
          className='mx-auto h-12 w-12 text-neutral-400'
          fill='none'
          viewBox='0 0 24 24'
          stroke='currentColor'
          aria-hidden='true'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={1.5}
            d='M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'
          />
        </svg>
        <h3 className='text-lg font-medium text-neutral-400'>
          There is no record to display
        </h3>
      </div>
    </div>
  )
}

export default NoRecord
