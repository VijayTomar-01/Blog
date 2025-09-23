import React from 'react'
import { assets, footer_data } from '../../assets/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {

  const navigate = useNavigate()

  return (
    <div className='px-6 xl:px-32 lg:px-24 md:px-18 bg-primary/3 mt-10'>
      <div className='flex flex-col md:flex-row items-start justify-between gap-10 py-10 border-b border-gray-500/30'>

      <div>
        <img
        onClick={() => navigate('/')}
        className='w-28 m-auto rounded-full border border-primary/80 shadow-md shadow-primary/60' 
        src={assets.logo} alt="logo" />
        <p className='max-w-[410px] mt-4 text-center font-light text-sm'>"Thanks for visiting! Stay updated with the latest articles, tips, and insights. Follow along as we explore ideas, share knowledge, and celebrate creativity. Happy reading!"</p>
      </div>

      <div className='flex flex-wrap justify-between w-full md:w-[45%]'>
        {footer_data.map((section, index) => (
          <div key={index}>
            <p className='font-medium mb-3'>{section.title}</p>
            <ul className='space-y-1 text-sm'>
              {section.links.map((link, i) => (
                <li key={i}>
                  <a className='hover:underline text-gray-500' href="#">{link}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      </div>
    </div>
  )
}

export default Footer