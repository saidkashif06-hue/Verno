import React from 'react'
import Hero from '../components/Hero'
import MarqueeBrands from '../components/MarqueBrands'
import NewArrivals from '../components/NewArrivals'
import CategoryShowcase from '../components/Category'
import AboutUs from '../components/AboutUs'
import BestSellers from '../components/BestSellers'
import Testimonials from '../components/Testimonials'
import FAQ from '../components/Faq'

const Home = () => {
  return (
    <div>
      <Hero/>
      <MarqueeBrands/>
      <NewArrivals/>
       <AboutUs/>
      <CategoryShowcase/>
     <BestSellers/>
     <Testimonials/>
     <FAQ/>
    </div>
  )
}

export default Home
