import React, { useEffect, useState } from 'react'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogHeader } from "@/components/ui/dialog"

function Header() {
  const [openDialog, setOpenDialog] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  // Dummy login function (can be replaced with actual auth or removed entirely)
  const handleDummyLogin = () => {
    const dummyUser = {
      name: 'Guest User',
      picture: '/avatar-placeholder.png',
    };
    localStorage.setItem('user', JSON.stringify(dummyUser));
    setUser(dummyUser);
    setOpenDialog(false);
  };

  const handleLogout = () => {
    localStorage.clear();
    setUser(null);
  };

  return (
    <div className='p-3 shadow-sm flex justify-between items-center px-5'>
      <img src="/logo.svg" alt="Logo" className='w-50' />
      <div>
        {user ? (
          <div className='flex items-center gap-3'>
            <Link to={'/create-trip'}>
              <Button variant="outline" className='rounded-full hover:scale-105 transition-all hover:shadow-md cursor-pointer'>+ Create Trip</Button>
            </Link>
            <Link to={'/my-trips'}>
              <Button variant="outline" className='rounded-full hover:scale-105 transition-all hover:shadow-md cursor-pointer'>My Trip</Button>
            </Link>
            <Popover>
              <PopoverTrigger>
                <img src={user?.picture} className='h-[35px] w-[35px] rounded-full' alt="User" />
              </PopoverTrigger>
              <PopoverContent>
                <h2 className='cursor-pointer hover:shadow-2xl' onClick={handleLogout}>Logout</h2>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setOpenDialog(true)}>Sign In</Button>
        )}
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" />
              <h2 className='font-bold text-lg mt-7'>Sign In</h2>
              <p>Currently, login is disabled. Click below to continue as guest.</p>
              <Button onClick={handleDummyLogin} className='mt-5 w-full flex gap-4 items-center'>
                Continue as Guest
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Header;
