import React from 'react'

const Newsletter = () => {

  const handleSubSubmit = (e) => {
    e.preventDefault();
  }

  return (
    <div className='flex flex-col items-center justify-center'>

      <h1 className='text-2xl lg:text-3xl md:text-4xl sm:text-5xl font-medium text-gray-800'>Never Miss a Blog!</h1>

      <p className='text-2xl md:text-lg sm:text-2xl sm:p-12 mt-3 font-light pb-8 text-gray-500'>Subscribe to get the latest Blog, new Tech, and exclusive news</p>

      <form 
      onSubmit={handleSubSubmit}
      className='border border-gray-300 mb-8 rounded-lg'>
        <input
        className='w-lg px-3 py-2.5 outline-none' 
        type="email" placeholder='Enter your Email' required/>
        <button
        className='px-5 py-2.5 rounded bg-primary/80 rounded-l-none text-gray-200 cursor-pointer hover:bg-primary ' 
        type='submit'>
          Subscribe
        </button>
      </form>
    </div>
  )
}

export default Newsletter