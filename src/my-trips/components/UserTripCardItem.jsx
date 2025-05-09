import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function UserTripCardItem({ trip }) {
  const [destinationImage, setDestinationImage] = useState(null);

  // Define Pexels API key and URL
  const pexelsApiKey = import.meta.env.VITE_PEXEL_API_KEY; // Ensure your Pexels API key is available in your environment variables
  const pexelsApiUrl = 'https://api.pexels.com/v1/search';

  // Fetch image for the destination
  const fetchDestinationImage = async (destination) => {
    try {
      const response = await fetch(`${pexelsApiUrl}?query=${encodeURIComponent(destination)}&per_page=1`, {
        headers: {
          Authorization: pexelsApiKey,
        },
      });
      const data = await response.json();
      if (data && data.photos && data.photos.length > 0) {
        // Set the first image URL from the search results
        setDestinationImage(data.photos[0].src.medium);
      } else {
        setDestinationImage('/path/to/default/image.jpg'); // Fallback image if no result
      }
    } catch (error) {
      console.error('Error fetching destination image:', error);
      setDestinationImage('/path/to/default/image.jpg'); // Fallback image in case of error
    }
  };

  useEffect(() => {
    if (trip?.userSelection?.location?.display_name) {
      fetchDestinationImage(trip.userSelection.location.display_name);
    }
  }, [trip]);

  return (
    <Link to={`/view-trip/${trip.id}`}>
      <div className='hover:scale-105 transition-all '> 
        <img
          src={destinationImage || '/path/to/default/image.jpg'}
          className='object-cover rounded-xl w-full h-48'
          alt={trip?.userSelection?.location?.display_name}
        />
        <div>
          <h2 className='font-bold text-lg'>
            - {trip?.userSelection?.location?.display_name}
          </h2>
          <h2 className='text-sm text-gray-500'>
            {trip?.userSelection.noOfDays} Days trip with {trip?.userSelection?.budget} Budget
          </h2>
        </div>
      </div>
    </Link>
  );
}

export default UserTripCardItem;
