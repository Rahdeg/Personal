import React from 'react'
import { Hero } from './_components/hero'
import { ProductContainer } from './_components/products-container'

const Shops = () => {
    return (
        <div className=' flex flex-col'>
            <Hero />
            <div className='py-16 px-3 lg:px-14 w-full'>

                <ProductContainer />
            </div>

        </div>
    )
}

export default Shops

