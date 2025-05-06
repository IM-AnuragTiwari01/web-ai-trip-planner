// import React from 'react'
//import GooglePlacesAutocomplete from 'react-google-places-autocomplete'
import React, { useEffect, useState } from 'react';
import PlaceAutocomplete from '../components/ui/PlaceAutocomplete';
import { Input } from '../components/ui/input';
import { SelectBudgetOptions, SelectTravelesList } from '../constants/options';
import { Button } from '../components/ui/button';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FcGoogle } from "react-icons/fc";
import { doc, setDoc } from "firebase/firestore";
import { toast, Toaster } from "sonner"
import { AI_PROMPT_TEMPLATE } from '../components/service/AIMODEL';
import { db } from '../components/service/firebaseConfig'
import axios from 'axios'
import { AiOutlineLoading3Quarters } from "react-icons/ai";


import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useGoogleLogin } from '@react-oauth/google';


function CreateTrip() {
  const [place, setPlace] = useState();
  const [formData, setFormData] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(false)



  const handleInputChange = (name, value) => {

    setFormData({
      ...formData,
      [name]: value
    })
  }

  useEffect(() => {
    console.log(formData);
  }, [formData])

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  })


  const OnGenerateTrip = async () => {



    const user = localStorage.getItem('user');

    if (!user) {
      setOpenDialog(true)
      return;
    }


    if ((formData?.noOfDays > 5 && !formData?.location) || !formData?.budget || !formData?.traveller) {
      toast("Please fill in the details !");
      return;
    }
    setLoading(true);
    const FINAL_PROMPT = AI_PROMPT_TEMPLATE
      .replace('{location}', formData?.location?.display_name)
      .replace('{totalDays}', formData?.noOfDays)
      .replace('{traveller}', formData?.traveller)
      .replace('{budget}', formData?.budget)
      .replace('{totalDays}', formData?.noOfDays);

    // console.log(FINAL_PROMPT);

    const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_GEMINI_API_KEY);
    // Replace with your API key
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const chat = model.startChat();

    const result = await chat.sendMessage(FINAL_PROMPT);
    const response = await result.response;
    const text = await response.text();

    console.log(text);

    setLoading(false);
    SaveAiTrip(result?.response?.text())

  };

  const SaveAiTrip = async (TripData) => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const docId = Date.now().toString();
  
    try {
      // Log the raw TripData to inspect it
      console.log('Raw TripData:', TripData);
  
      // Clean the response by removing any markdown or unwanted characters
      let cleanData = TripData;
  
      // Remove markdown formatting if present (e.g., ```json and the closing ```
      cleanData = cleanData.replace(/```json\s*/g, ''); // Removes the "```json" part
      cleanData = cleanData.replace(/```/g, ''); // Removes the closing "```"
  
      // Try parsing the cleaned data
      const parsedData = JSON.parse(cleanData);
  
      // If parsing is successful, save it to Firestore
      await setDoc(doc(db, "AITrips", docId), {
        userSelection: formData,
        tripData: parsedData,  // Save the parsed data
        userEmail: user?.email,
        id: docId
      });
  
      console.log('Saved trip data:', parsedData);
  
    } catch (error) {
      // Handle errors during parsing or saving
      console.error('Error parsing TripData:', error);
      toast('Failed to save trip data. Please try again later.');
    }
  
    setLoading(false);
  };
  



  const GetUserProfile = (tokenInfo) => {
    axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`, {
      headers: {
        Authorization: `Bearer ${tokenInfo?.access_token}`,
        Accept: 'Application/json'
      }
    }).then((resp) => {
      console.log(resp);
      localStorage.setItem('user', JSON.stringify(resp.data));
      setOpenDialog(false);
      OnGenerateTrip();
    })
  }


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
              handleInputChange('location', v)
            }}
          />
        </div>

        <div>
          <h2 className='my-3 text-xl font-medium'>How many days are you planning your trip</h2>
          <Input placeholder={"e.g. 3"} type="number"
            onChange={(e) => handleInputChange("noOfDays", e.target.value)}
          />
        </div>

        <div>
          <h2 className='my-3 text-xl font-medium'>What is your budget</h2>
          <div className='grid grid-cols-3 mt-5 gap-5'>
            {SelectBudgetOptions.map((item, index) => (
              <div key={index}
                onClick={() => handleInputChange('budget', item.title)}
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
                onClick={() => handleInputChange('traveller', item.people)}
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
        <Button

          disabled={loading}

          onClick={OnGenerateTrip}>
          {loading ?
            <AiOutlineLoading3Quarters className='h-7 w-7 animate-spin' /> : 'Generate Trip '
          }

          Generate Trip</Button>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>


        <DialogContent>
          <DialogHeader>

            <DialogDescription>
              <img src="/logo.svg" />
              <h2 className='font-bold text-lg mt-7'>Sign In with Google</h2>
              <p>Sign in to the app with Google authentication securely</p>
              <Button

                onClick={login}
                className='mt-5 w-full flex gap-4 items-center'>

                <FcGoogle className='h-7 w-7' />
                Sign In With Google

              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>






    </div>



  );
}

export default CreateTrip;
