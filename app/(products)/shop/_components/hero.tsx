import Image from 'next/image'
import React from 'react'

export const Hero = () => {
    return (
        <div className='w-full'>
            <div className=' w-full h-96  relative'>
                <Image alt='he' src="/shop.png" fill className='  object-cover' />
            </div>


        </div>
    )
}
