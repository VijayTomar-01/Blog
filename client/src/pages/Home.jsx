import React, { useState } from 'react'
import Navbar from '../components/Home/Navbar'
import Header from '../components/Home/Header'
import Newsletter from '../components/Home/Newsletter'
import Footer from '../components/Home/Footer'
import BlogList from '../components/Home/BlogList'
import { useBlogContext } from '../hooks/useBlogContext'

const Home = () => {

  const [search, setSearch] = useState('')
  const {blogs, loading} = useBlogContext()

  const filterBlogs = blogs.filter(blog => {
    const term = search.toLowerCase()
    return (
      blog.title?.toLowerCase().includes(term) || 
      blog.subTitle?.toLowerCase().includes(term) || 
      blog.category?.toLowerCase().includes(term)
    )
  })

  return (
    <>
    <Navbar/>
    <Header search={search} setSearch={setSearch}/>
    <BlogList filteredBlogs={filterBlogs} loading={loading}/>
    <Newsletter/>
    <Footer/>
    </>
  )
}

export default Home