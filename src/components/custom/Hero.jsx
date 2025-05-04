import React from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
function Hero() {
  return (
    <div className='flex items-center flex-col mx-56 gap-9'>
      <h1
       className = 'font-extrabold text-[50px] text-center mt-16'
       ><span className='text-[#68a9dc]'>Your next adventure starts here</span><br />Effortless plans, unforgettable journeys</h1>
       <p className='text-xl text-gray-500 text-center'>Your personel trip planner and travel, creating custom itenaries tailored to your intrests and budget. </p>
       
       <Link to={'create-trip'}>
        <Button>Get Started It's Free</Button>
        </Link>
    </div>
  )
}

export default Hero
