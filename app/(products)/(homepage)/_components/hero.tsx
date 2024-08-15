"use client"
import { Button } from '@/components/ui/button'
import React from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'


const Hero = () => {

    const router = useRouter();



    return (
        <div className=' py-16 px-3 lg:px-14 w-full'>
            <div className=' w-full flex flex-col lg:flex-row items-center justify-between '>
                <div className=' flex flex-col items-start justify-center w-full ' >
                    <p className="text-4xl md:text-8xl font-bold flex items-center">
                        BarbSh
                        <span className="lg:text-3xl text-xl px-8 lg:py-7 py-3 rounded-full lg:px-16 border-[10px] border-[#ED5221]"></span>
                        w
                    </p>
                    <p className='text-4xl md:text-8xl font-bold py-2 tracking-wider'>Collections!</p>

                    <div className=' flex items-start justify-between'>
                        <p className=' max-w-80 text-[#666565]'>
                            Discover our stylish and comfortable shoes, perfectly for every occasion and need.
                        </p>

                        <Button className=' rounded-3xl bg-[#ED5221] text-white' onClick={() => router.push("/shop")}>
                            Shop Now
                        </Button>


                    </div>

                    <Button className=' bg-transparent rounded-3xl flex items-center justify-center border text-[#666565] border-gray-600 mt-6'>
                        7+ Brands
                    </Button>
                </div>

                <div className="relative flex items-center justify-center w-full mt-52 lg:mt-0">
                    <div className="absolute lg:inset-0   flex items-center justify-center ">
                        <div className="w-96 h-96 bg-[#Feeeea] rounded-full"></div>
                    </div>
                    <div className='relative px-2  md:px-0'>
                        <Image src="/shopping.svg" alt='happy' width={600} height={600} />

                    </div>
                </div>


            </div>


        </div>
    )
}

export default Hero