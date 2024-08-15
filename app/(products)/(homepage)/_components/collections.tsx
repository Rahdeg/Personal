"use client"
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const newCollection = [
    {
        id: 1,
        image: '/img1.png', // Update with the correct image path
        alt: 'Nike Beige Shoe',
    },
    {
        id: 2,
        image: '/img2.png', // Update with the correct image path
        alt: 'White Shoe with Red Star',
    },
];

const NewCollection = () => {

    const router = useRouter();
    return (
        <div className='py-16 px-3 lg:px-14 w-full'>
            <div className=' flex flex-col lg:flex-row  items-center justify-between gap-x-4 w-full'>
                <div className=' flex items-center justify-center w-full  '>
                    <div className=' flex flex-col w-full'>
                        <div className="flex items-end justify-between  w-full">
                            <h2 className="text-5xl font-semibold w-80">See Our New Collection</h2>
                            <div className="flex space-x-2">
                                <button className="w-8 h-8 bg-orange-100 text-orange-500 rounded-full flex items-center justify-center">&larr;</button>
                                <button className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center">&rarr;</button>
                            </div>
                        </div>

                        <div className="w-full h-72 relative rounded-lg my-10">
                            <Image src="/img1.png" alt="/img1" fill className=" object-cover  rounded-lg" />


                        </div>
                    </div>
                </div>
                <div className=' flex items-center justify-center w-full '>
                    <div className=' flex flex-col w-full items-start justify-end'>

                        <div className="w-full h-72 relative rounded-lg ">
                            <Image src="/img1.png" alt="/img1" fill className=" object-cover  rounded-lg" />


                        </div>

                        <div className="mt-4  ">
                            <p className="text-gray-700 text-base mb-4">
                                Discover our new collection now! Experience fresh styles and designs,<br /> perfect for updating your wardrobe with the latest trends.
                            </p>
                            <Button onClick={() => router.push('/shop')} className="py-2 px-4 bg-white text-orange-500 border border-orange-500 rounded-full hover:bg-orange-500 hover:text-white transition duration-300">
                                Buy Now
                            </Button>
                        </div>

                    </div>
                </div>

            </div>
        </div>

    );
};

export default NewCollection;
