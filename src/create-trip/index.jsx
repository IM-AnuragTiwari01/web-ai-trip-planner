// import React from 'react'
//import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import React, { useEffect, useState } from 'react';
import PlaceAutocomplete from '../components/ui/PlaceAutocomplete';
import { Input } from '../components/ui/input';
import { SelectBudgetOptions, SelectTravelesList } from '../constants/options';
import { Button} from '../components/ui/button';
import { GoogleGenerativeAI } from '@google/generative-ai'; 

import { toast, Toaster } from "sonner"
import { AI_PROMPT_TEMPLATE } from '../components/service/AIMODEL';
// import { chatSession } from '@google/generative-ai';

function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState([]);

  const handleInputChange = (name, value)=>{
    
    setFormData({
      ...formData,
      [name]:value
    })
  }

  useEffect(()=>{
    console.log(formData);
  },[formData])

  const OnGenerateTrip = async () => {
    if ((formData?.noOfDays > 5 && !formData?.location) || !formData?.budget || !formData?.traveller) {
      toast("Please fill in the details !");
      return;
    }
  
    const FINAL_PROMPT = AI_PROMPT_TEMPLATE
      .replace('{location}', formData?.location?.display_name)
      .replace('{totalDays}', formData?.noOfDays)
      .replace('{traveller}', formData?.traveller)
      .replace('{budget}', formData?.budget)
      .replace('{totalDays}', formData?.noOfDays);
  
    console.log(FINAL_PROMPT);
  
    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GEMINI_API_KEY);
 // Replace with your API key
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  
    const chat = model.startChat();
  
    const result = await chat.sendMessage(FINAL_PROMPT);
    const response = await result.response;
    const text = await response.text();
  
    console.log(text);
  };
  

  return (
    <div className='sm:px-10 md:px-32 lg:px-56 xl:px-10 px-5 mt-10 flex items-center flex-col'>
      <h2 className='font-bold text-3xl'>
        Specify your preferences to customize your journey
      </h2>
      <p className='mt-3 text-gray-500 text-xl'>
        Just provide some basic information, and our trip planner will generate a customized itinerary based on your preferences.
      </p>

      <div className="mt-15 w-full">
        <div>
          <h2 className='my-3 text-xl font-medium'>What's your destination of choice</h2>
          <PlaceAutocomplete
            place={place}
            onChange={(v) => {
              setPlace(v);
              handleInputChange('location',v)
            }}
          />
        </div>

        <div>
          <h2 className='my-3 text-xl font-medium'>How many days are you planning your trip</h2>
          <Input placeholder={"e.g. 3"} type="number" 
          onChange={(e)=> handleInputChange("noOfDays", e.target.value)}
          />
        </div>

        <div>
          <h2 className='my-3 text-xl font-medium'>What is your budget</h2>
          <div className='grid grid-cols-3 mt-5 gap-5'>
            {SelectBudgetOptions.map((item, index) => (
              <div key={index} 
              onClick={()=>handleInputChange('budget',item.title)}
              className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer
              ${formData?.budget == item.title && 'shadow-lg border-black'}
              
              
              `}>
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>


        <div>
          <h2 className='my-3 text-xl font-medium'>Who do you plan on travelling with on your next adventure?</h2>
          <div className='grid grid-cols-3 mt-5 gap-5'>
            {SelectTravelesList.map((item, index) => (
              <div key={index} 
              onClick={()=>handleInputChange('traveller',item.people)}
              className={`p-4 border rounded-lg hover:shadow-lg cursor-pointer
                ${formData?.traveller == item.people && 'shadow-lg border-black'}
                
                
                `}>
                <h2 className='text-4xl'>{item.icon}</h2>
                <h2 className='font-bold text-lg'>{item.title}</h2>
                <h2 className='text-sm text-gray-500'>{item.desc}</h2>
              </div>
            ))}
          </div>
        </div>
      </div>
            <div className='my-10 justify-end'>
            <Button onClick={OnGenerateTrip}>Generate Trip</Button>
            </div>
              

    </div>
  );
}

export default CreateTrip;
