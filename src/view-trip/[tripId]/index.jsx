import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import {useParams} from 'react-router-dom'
import { db } from '../../components/service/firebaseConfig';
import { toast } from 'sonner';
import InfoSection from './components/InfoSection';
import Hotels from './components/Hotels';


function Viewtrip() {

    const {tripId} = useParams();
    const [trip,setTrip] =useState([]);

useEffect(()=>{
   tripId && GetTripData();
},[tripId])
/**
 * Used to get trip information from firebase
 */

    const GetTripData=async() =>{

        const docRef=doc(db,'AITrips',tripId);
        const docSnap = await getDoc(docRef);
        if(docSnap.exists()){
            console.log("Document:",docSnap.data());
            setTrip(docSnap.data());
        }
        else{
            console.log("No Such Document");
            toast('No Trip Found !');
        }
    }



  return (
    <div className='p-10 md:px-20 lg:px-44 xl:px-56'>
      {/* {Information Section} */}
      <InfoSection trip={trip}/>

      {/* {Recommended hotels} */}
      <Hotels trip={trip}/>


      {/* {Daily plan} */}



      {/* {footer} */}
    </div>
  )
}

export default Viewtrip;
