import React from 'react'
import { Button } from '../../../components/ui/button'
import { IoIosSend } from "react-icons/io";
function InfoSection({trip}) {
  return (
    <div>
        <img src='/placeholder.jpg' className='h-[340px] w-full object-cover rounded'></img>
    
    <div className='flex justify-between items-center'>
    <div className='my-5 flex flex-col gap-2'>
        <h2 className='fonst-bold text-2xl'>{trip?.userSelection?.location?.display_name}</h2>

        <div className='flex gap-5'>

                <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500  text-xs md:text-md'>📅{trip.userSelection?.noOfDays} Days</h2>
                <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500  text-xs md:text-md'>💲{trip.userSelection?.budget} budget</h2>
                <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500  text-xs md:text-md'>🥂No. Of Traveller : {trip.userSelection?.traveller}</h2>
        </div>
    </div>
    <Button> <IoIosSend/></Button>
    </div>
    </div>
  )
}

export default InfoSection
