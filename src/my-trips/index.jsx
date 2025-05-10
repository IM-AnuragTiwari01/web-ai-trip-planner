import React, { useEffect, useState } from "react"; // ✅ Fixed: useEffect included
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../components/service/firebaseConfig";
import UserTripCardItem from "./components/UserTripCardItem";

function MyTrips() {
  const [userTrips, setUserTrips] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    GetUserTrips();
  }, []);

  const GetUserTrips = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
      navigate("/");
      return;
    }

    try {
      const q = query(collection(db, "AITrips"), where("userEmail", "==", user.email));
      const querySnapshot = await getDocs(q);
      const trips = querySnapshot.docs.map(doc => doc.data());
      setUserTrips(trips);
    } catch (error) {
      console.error("Error fetching user trips:", error);
    }
  };

  return (
    <div className="sm:px-10 md:px-32 lg:px-56 xl:px-72 px-5 mt-10">
      <h2 className="font-bold text-3xl">MyTrips</h2>
      <div className="mt-10 grid grid-cols-2 md:grid-cols-3 gap-5">
        {userTrips?.length>0?userTrips.map((trip, index) => (
          <UserTripCardItem key={index} trip={trip} />
        ))
    
    :[1,2,3,4,5,6].map((item,index)=>(
        <div key={index} className="h-[250px] w-full bg-slate-200 animate-pulse rounded-xl">
            
        </div>
    ))}
      </div>
    </div>
  );
}

export default MyTrips;
