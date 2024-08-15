

import React from 'react'
import Header from './_components/header';


type Props = {
    children: React.ReactNode;
}

const ProductsLayout = ({ children }: Props) => {
    return (
        <div className='bg-[#ffffff]'>
            <Header />
            <main className=' mt-20'>
                {children}
            </main>

        </div>
    )
}

export default ProductsLayout