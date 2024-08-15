"use client"
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React from 'react';

const WhyChooseUs = () => {

    const router = useRouter();
    return (
        <div className="py-16 px-3 lg:px-14 w-full">
            <div className="flex flex-col md:flex-row">
                <div className="w-full md:w-1/2 p-4">
                    <div className="relative bg-gray-200 h-64 md:h-full mb-4 flex items-center justify-center w-full">
                        <Image src='/w1.png' alt='w1' fill />
                    </div>
                </div>
                <div className="w-full md:w-1/2 p-4 flex flex-col justify-center ">
                    <h2 className="text-2xl md:text-4xl font-semibold mb-4">Why Choose Us?</h2>
                    <p className=" md:text-base mb-6 text-[#666565]">
                        The LuxeState Difference. Our Products Are Crafted To Order In Small Batches And Shipped Directly To You. Theres Never Unsold Inventory, No Middlemen Or High Markups To Cover Costs.
                    </p>
                    <button onClick={() => router.push("/shop")} className="bg-transparent text-orange-500 border border-orange-500 rounded-full w-2/5 px-6 py-2 mb-4">
                        Shop Now
                    </button>
                    <div className="relative mt-20">
                        <div className="absolute -top-10 right-0 hidden md:block">
                            {/* Placeholder for the arrow image */}

                        </div>
                        <div className=" relative bg-gray-200 h-40 md:h-64 flex items-center justify-center">
                            <Image src='/w2.png' alt='w1' fill />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WhyChooseUs;
