import React from 'react'
import Link from 'next/link'
import MaxWidthWrapper from './wrapper/MaxwidthWrapper'

const Footer = () => {
  return (
    <footer className='bg-white h-20 relative'>
      <MaxWidthWrapper>
        <div className='border-t border-gray-400' />
        <div className='h-full flex flex-col md:flex-row md:justify-between justify-center items-center'>
          <div className="text-center md:text-left pb-2 md:pb-0">
            <p className='text-sm text-muted-foreground'>
              &copy; {new Date().getFullYear()} NutriWell. All rights reserved.
            </p>
          </div>
          <div className='flex justify-center items-center'>
            <div className='flex space-x-8'>
              <Link
                href="#"
                className='text-sm text-muted-foreground hover:text-gray-600'>
                Terms
              </Link>
              <Link
                href="#"
                className='text-sm text-muted-foreground hover:text-gray-600'>
                Privacy Policy
              </Link>
              <Link
                href="#"
                className='text-sm text-muted-foreground hover:text-gray-600'>
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </footer>
  )
}

export default Footer


