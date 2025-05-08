import React, { useState, useEffect } from 'react';

function Hotels({ trip }) {
  const [hotelImages, setHotelImages] = useState({});

  // Define Pexels API key and URL
  const pexelsApiKey = import.meta.env.VITE_PEXEL_API_KEY; // Replace with your actual Pexels API key
  const pexelsApiUrl = 'https://api.pexels.com/v1/search';

  // Function to fetch hotel image from Pexels API
  const fetchHotelImage = async (hotelName) => {
    try {
      const response = await fetch(`${pexelsApiUrl}?query=${encodeURIComponent(hotelName)}&per_page=1`, {
        headers: {
          Authorization: pexelsApiKey,
        },
      });

      const data = await response.json();
      if (data && data.photos && data.photos.length > 0) {
        // Set the first image URL from the search results
        setHotelImages((prevImages) => ({
          ...prevImages,
          [hotelName]: data.photos[0].src.medium, // Store images by hotel name
        }));
      } else {
        // Fallback image if no image is found
        setHotelImages((prevImages) => ({
          ...prevImages,
          [hotelName]: '/path/to/default/image.jpg', // Default image
        }));
      }
    } catch (error) {
      console.error('Error fetching image from Pexels:', error);
      setHotelImages((prevImages) => ({
        ...prevImages,
        [hotelName]: '/path/to/default/image.jpg', // Default image in case of error
      }));
    }
  };

  useEffect(() => {
    // Fetch images for all hotels when component mounts or trip changes
    trip?.tripData?.travelPlan?.hotelOptions?.forEach((hotel) => {
      fetchHotelImage(hotel?.hotelName);
    });
  }, [trip]);

  return (
    <div>
      <h2 className='font-bold text-xl mt-5'>Hotel Recommendation</h2>

      <div className='grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5'>
        {trip?.tripData?.travelPlan?.hotelOptions?.map((hotel) => (
          <a
            href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(hotel?.hotelAddress)}`}
            target='_blank'
            rel='noopener noreferrer'
            key={`${hotel?.hotelName}-${hotel?.hotelAddress}`}
          >
            <div className='hover:scale-105 transition-all cursor-pointer'>
              <img
                src={hotelImages[hotel?.hotelName] || '/path/to/default/image.jpg'}
                alt={hotel?.hotelName}
                className='rounded-xl w-full h-[180px] object-cover'
              />
              <div className='my-3'>
                <h2 className='font-medium'>{hotel?.hotelName}</h2>
                {hotel['hotelAddress'] && (
                  <h2 className='text-xs text-gray-500'>📌 {hotel['hotelAddress']}</h2>
                )}
                {hotel['pricePerNightInUSD'] && (
                  <h2 className='text-sm'>💰 {hotel['pricePerNightInUSD']} per night</h2>
                )}
                <h2 className='text-sm'>⭐ {hotel?.rating}</h2>
              </div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default Hotels;
