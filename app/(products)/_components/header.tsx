import React from 'react';
import Logo from './logo';
import Navigation from './navigation';
import Profile from './profile';

const Header = () => {
    return (
        <div className='fixed top-0 left-0 w-full bg-white shadow-md z-50'>
            <div className='flex py-5 border-b-2 w-full'>
                <div className='px-3 lg:px-14 flex items-center justify-between w-full'>
                    <div className='hidden lg:flex'>
                        <Logo />
                    </div>
                    <Navigation />
                    <Profile />
                </div>
            </div>
        </div>
    );
}

export default Header;
