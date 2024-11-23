import React from 'react'

const Header = () => {
  return (
    <div className='flex justify-between items-center w-full lg:px-16 md:px-10 sm:px-8 px-4 py-2 shadow-lg'>
        <div className='flex items-center gap-2'>
            <img src="logo.png" alt="logo" className='h-20 w-28'/>
            <p className='text-xl font-bold'>pic<span className='text-orange text-2xl'>2</span>plate</p>
        </div>
        <div className='flex items-center gap-6'>
            <a href="#home" className='font-medium hover:text-orange hover:scale-110'>Home</a>
            <a href="#about" className='font-medium hover:text-orange hover:scale-110'>About</a>
        </div>
    </div>
  )
}

export default Header