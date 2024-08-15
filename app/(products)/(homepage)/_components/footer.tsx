"use client"
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';
import { FaFacebook, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    const router = useRouter();
    return (
        <footer className="bg-black text-white py-16 px-3 lg:px-14 w-full">

            <div className="flex flex-col md:flex-row md:justify-start  md:items-center w-full">
                <div className="mb-6 md:mb-0  border-r-2 border-y-2 py-20 pr-20 w-full">
                    <h2 className="text-4xl md:text-6xl font-bold mb-4">ARE YOU INTERESTED?</h2>
                    <button className="text-orange-500 hover:text-orange-700 text-lg md:text-xl" onClick={() => router.push("/shop")}>
                        Shopping Now &rarr;
                    </button>
                </div>
                <div className="flex flex-col items-start md:items-start border-y-2 py-[48px] pl-4 w-full">
                    <div className="mb-6">
                        <div className='flex items-start justify-center gap-x-2'>
                            <Image alt='lg' src="/logo.svg" width={30} height={30} />
                            <h3 className="text-2xl md:text-3xl font-bold mb-4">BarbShow</h3>
                        </div>

                        <ul className="space-y-2">
                            <li><a href="#" className="hover:text-gray-400">Shop</a></li>
                            <li><a href="#" className="hover:text-gray-400">About</a></li>
                            <li><a href="#" className="hover:text-gray-400">Blog</a></li>
                            <li><a href="#" className="hover:text-gray-400">Contact</a></li>
                        </ul>
                    </div>
                    <div className="flex space-x-4">

                        <FaFacebook className=' text-white size-8 ' />
                        <FaInstagram className=' text-white size-8 ' />

                    </div>
                </div>
            </div>

            <div className="text-center text-gray-500 mt-10">
                Copyright Sneaker Shoes Sales 2024 - All Rights Reserved
            </div>
        </footer>
    );
};

export default Footer;
