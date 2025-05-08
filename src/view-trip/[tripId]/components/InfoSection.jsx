import React, { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { IoIosSend } from "react-icons/io";

function InfoSection({ trip }) {
  const [imageUrl, setImageUrl] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);

  // Define Pexels API key and URL
  const pexelsApiKey = import.meta.env.VITE_PEXEL_API_KEY; // Replace with your actual Pexels API key
  const pexelsApiUrl = 'https://api.pexels.com/v1/search';

  // Fetch image based on location name
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`${pexelsApiUrl}?query=${encodeURIComponent(trip?.userSelection?.location?.display_name)}&per_page=1`, {
          headers: {
            Authorization: pexelsApiKey,
          },
        });

        const data = await response.json();
        if (data && data.photos && data.photos.length > 0) {
          setImageUrl(data.photos[0].src.medium); // Use medium size image
        } else {
          setImageUrl('/path/to/default/image.jpg'); // Fallback to a default image if no results
        }
      } catch (error) {
        console.error('Error fetching image from Pexels:', error);
        setImageUrl('/path/to/default/image.jpg'); // Fallback image
      }
    };

    fetchImage();
  }, [trip?.userSelection?.location?.display_name]); // Run whenever the location name changes

  return (
    <div>
      {/* Image fetched from Pexels or fallback image */}
      <img
        src={imageUrl || '/placeholder.jpg'} // Use fetched image or fallback
        className='h-[340px] w-full object-cover rounded'
        alt={trip?.userSelection?.location?.display_name}
        onLoad={() => setImageLoaded(true)} // Set image as loaded
        onError={() => setImageUrl('/path/to/default/image.jpg')} // In case of an error, use fallback image
      />

      <div className='flex justify-between items-center'>
        <div className='my-5 flex flex-col gap-2'>
          <h2 className='font-bold text-2xl'>{trip?.userSelection?.location?.display_name}</h2>

          <div className='flex gap-5'>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
              📅{trip?.userSelection?.noOfDays} Days
            </h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
              💲{trip?.userSelection?.budget} budget
            </h2>
            <h2 className='p-1 px-3 bg-gray-200 rounded-full text-gray-500 text-xs md:text-md'>
              🧳 No. of Travelers: {trip?.userSelection?.traveller}
            </h2>
          </div>
        </div>

        <Button>
          <IoIosSend />
        </Button>
      </div>
    </div>
  );
}

export default InfoSection;
