import React from 'react'

function Hotels({ trip }) {
    return (
        <div>
            <h2 className='font-bold text-xl mt-5'>Hotel Recommendation</h2>

            <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5'>

                {trip?.tripData?.travelPlan?.hotelOptions?.map((hotel, index) => (
                    <div className='hover:scale-105 transition-all cursor-pointer'>
                        <img src="/hotels.jpg" className='rounded-xl' />
                        <div className='my-3'>
                            <h2 className='font-medium'>{hotel?.hotelName}</h2>
                            {hotel['Hotel address'] && (
                                <h2 className='text-xs text-gray-500'>📌{hotel['Hotel address']}</h2>
                            )}

                            {hotel['price per night in USD'] && (
                                <h2 className='text-sm'>💰{hotel['price per night in USD']} per night </h2>
                            )}
                            <h2 className='text-sm'>⭐{hotel?.rating} </h2>

                        </div>
                    </div>
                ))}
            </div>

            
        </div>
    )
}

export default Hotels
