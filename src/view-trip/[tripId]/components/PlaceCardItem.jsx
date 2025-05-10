import React, { useState, useEffect } from 'react'

function PlaceCardItem({ place }) {
  // Use state to track image URL and loading status
  const [imageUrl, setImageUrl] = useState('');
  const [imageLoaded, setImageLoaded] = useState(false);

  // Define Pexels API key
  const pexelsApiKey = import.meta.env.VITE_PEXEL_API_KEY; // Replace with your actual Pexels API key
  const pexelsApiUrl = 'https://api.pexels.com/v1/search';

  // Fetch image from Pexels API based on placeName
  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`${pexelsApiUrl}?query=${encodeURIComponent(place.placeName)}&per_page=1`, {
          headers: {
            Authorization: pexelsApiKey,
          },
        });

        const data = await response.json();
        
        if (data && data.photos && data.photos.length > 0) {
          setImageUrl(data.photos[0].src.medium); // You can use `original`, `large`, etc.
        } else {
          setImageUrl('/path/to/default/image.jpg'); // Fallback image
        }
      } catch (error) {
        console.error('Error fetching image from Pexels:', error);
        setImageUrl('/path/to/default/image.jpg'); // Fallback image
      }
    };

    fetchImage();
  }, [place.placeName]); // Trigger when placeName changes

  return (
    <a
      href={`https://www.openstreetmap.org/search?query=${encodeURIComponent(place?.placeName)}`}
      target='_blank'
      rel='noopener noreferrer'
      key={place?.placeName}
    >
      <div className='border rounded-xl p-3 mt-2 flex gap-5 hover:scale-105 transition-all hover:shadow-md cursor-pointer'>
        
        {/* Display a loading spinner or placeholder if the image is not loaded */}
        {!imageLoaded && (
          <div className="w-[130px] h-[130px] flex justify-center items-center bg-gray-200 rounded-xl">
            <span>Loading...</span>
          </div>
        )}

        {/* Image element */}
        <img
          alt={place.placeName}  // Alt text to show if the image doesn't load
          src={imageUrl}         // Dynamic image URL from Pexels API
          className='w-[130px] h-[130px] rounded-xl object-cover'
          onLoad={() => setImageLoaded(true)} // Mark image as loaded
          onError={(e) => {
            // In case the image URL fails to load, show a fallback image
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = '/path/to/default/image.jpg'; // Add a default image path here
          }}
          loading="lazy" // Lazy loading the image
        />
        
        <div>
          <h2 className='font-bold text-lg'>- {place.placeName}</h2>
          <p className='text-sm text-gray-400 mt-2'>- {place['placeDetails']}</p>
          <p className='text-sm text-orange-400 mt-2'>- {place['bestTimeToVisit']} is the best time to visit</p>
          <h2 className='font-bold text-blue-300 text-sm mt-2'>- Ticket pricing: {place['ticketPricing']}</h2>
        </div>
      </div>
    </a>
  )
}

export default PlaceCardItem;
