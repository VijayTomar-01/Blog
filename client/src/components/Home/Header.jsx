import React, { useState } from 'react'
import { assets } from '../../assets/assets'

const Header = ({search, setSearch}) => {

  const handleSubmit = (e) => {
    e.preventDefault();
  }

  const handleClear = () => {
   setSearch('')
  }

  return (
    <div className='relative mx-8 mt-16'>
      <div className='text-center'>

        <div className='inline-flex border items-center justify-center gap-4 py-1 rounded-full border-primary/80 bg-primary/10 text-primary px-8 shadow shadow-primary/40 mb-12'>
          <p>Your Blogging Journey Starts Here</p>
          <img 
          src={assets.star_icon} alt="star_icon" />
        </div>

        <h1 className='font-bold text-3xl md:text-6xl sm:text-7xl mb-12 text-gray-700'>Where your <span className='text-primary'>words</span> find a <br /> <span className='border-b-2 border-primary'>home.</span></h1>

        <p className='max-w-3xl text-center mx-auto text-gray-500 font-light'>✨ “Here, your ideas have room to breathe. From quick notes to deep reflections, every post you create finds its place. This is more than just a platform — it’s a living archive of your thoughts, built to grow with you, one story at a time.”</p>

        <form 
        onSubmit={handleSubmit}
        className='flex items-center justify-center max-w-lg mx-auto border-gray-300 border px-4 py-2.5 mb-8 rounded-xl overflow-hidden mt-10'>
          <input 
          onChange={(e) => setSearch(e.target.value.trim())}
          value={search}
          className='w-full outline-none'
          type="text" placeholder='Search for Blogs' required/>
          <button
          type='submit' 
          className='border bg-primary/80 px-5 py-2 rounded-xl text-gray-200 cursor-pointer hover:bg-primary'
          >Search</button>
        </form>
      </div>

      <div className='text-center'>
        {(search) && (
          <button 
          onClick={handleClear}
          className='border px-3 py-2.5 mb-8 rounded-lg font-medium bg-primary/80 text-gray-200 cursor-pointer hover:bg-primary'>
            Clear Search
          </button>
        )}
      </div>
   
        <img
        className='absolute -top-50 opacity-50 -z-1' 
        src={assets.gradientBackground} alt="bg" />
    </div>
  )
}

export default Header