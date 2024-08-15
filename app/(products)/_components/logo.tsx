import Image from 'next/image'
import React from 'react'

const Logo = () => {
    return (
        <div className=' flex items-center justify-center gap-x-2'>
            <Image src="/logo.svg" alt='logo' width={20} height={20} />
            <p className=' text-2xl font-bold text-[#1c1e25]'>BarbShow</p>
        </div>
    )
}

export default Logo