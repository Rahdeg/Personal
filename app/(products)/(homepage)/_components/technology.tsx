import Image from 'next/image';
import React from 'react';

const Technology = () => {
    return (
        <div className=" py-16 px-3 lg:px-14 w-full">
            <h2 className="text-center text-2xl font-semibold mb-10 text-[#666565]">TECHNOLOGY</h2>
            <h3 className="text-center text-xl lg:text-5xl lg:tracking-widest font-bold mb-10">Details Down To Sneaker Level</h3>
            <div className="flex flex-col lg:flex-row gap-y-2  w-full justify-center lg:space-x-8">
                <div className="w-full lg:w-1/3  text-center">
                    <div className="relative bg-gray-200  h-96  w-full mb-4 flex items-center justify-center">
                        {/* Placeholder for the image */}
                        <Image src="/t1.png" alt='t1' fill />
                    </div>
                    {/* <p className="text-lg font-medium">Padded Heel For Comfort And Grip</p> */}
                </div>
                <div className="w-full lg:w-1/3 text-center">
                    <div className="relative bg-gray-200 w-full  h-96  mb-4 flex items-center justify-center">
                        {/* Placeholder for the image */}
                        <Image src="/t2.png" alt='t1' fill />
                    </div>
                    {/* <p className="text-lg font-medium">
                        The Outsole Cutout Pattern, Inspired By The Atoms Logo, Helps Reduce The Shoes Weight
                    </p> */}
                </div>
                <div className="w-full lg:w-1/3 text-center">
                    <div className="relative bg-gray-200  h-96  w-full mb-4 flex items-center justify-center">
                        {/* Placeholder for the image */}
                        <Image src="/t3.png" alt='t1' fill />
                    </div>
                    {/* <p className="text-lg font-medium">Square Eyelets Keep Your Flat Laces Neat And Stylish</p> */}
                </div>
            </div>
        </div>
    );
};

export default Technology;
