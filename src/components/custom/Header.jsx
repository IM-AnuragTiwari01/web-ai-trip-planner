import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { FcGoogle } from "react-icons/fc";
import axios from 'axios'



import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { googleLogout, useGoogleLogin } from '@react-oauth/google'
import { useNavigation } from 'react-router-dom'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"



function Header() {

  const user = JSON.parse(localStorage.getItem('user'))
    const [openDialog, setOpenDialog] = useState(false);
  

  useEffect(() => {
    console.log(user)
  }, [])

  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error)
  })

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
      window.location.reload();
    })
  }



  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-5'>
      <img src="/logo.svg" alt="error" className='w-50' />
      <div>
        {user ?
          <div className='flex items-center gap-3'>
            <a href='/create-trip'>
            <Button variant="outline"
             className='rounded-full hover:scale-105 transition-all hover:shadow-md cursor-pointer'>+ Create Trip</Button>

            </a>


            <a href='/my-trips'>
            <Button variant="outline"
             className='rounded-full hover:scale-105 transition-all hover:shadow-md cursor-pointer'>My Trip</Button>

            </a>
            <Popover>
              <PopoverTrigger><img src={user?.picture} className='h-[35px] w-[35px] rounded-full' alt="User" /></PopoverTrigger>
              <PopoverContent><h2 className='cursor-pointer hover:shadow-2xl' onClick={()=>{
                googleLogout();
                localStorage.clear();
                 window.location.reload();
              }}>Logout</h2></PopoverContent>
            </Popover>




          </div>
          :
          <Button onClick={()=>setOpenDialog(true)}>Sign In</Button>
        }
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
  )
}

export default Header
Header