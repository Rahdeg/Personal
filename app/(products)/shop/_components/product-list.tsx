'use client'

import React from 'react'

import { useRouter } from 'next/navigation';

import { ProductCard } from './product-card'
import { Product } from '@/types'

interface ProductList {
    products: Product[];
}


export const ProductList = ({ products }: ProductList) => {

    const router = useRouter();
    return (
        <div className=' flex items-center justify-center w-full lg:w-auto '>

            <div className=" grid grid-cols-1 lg:grid-cols-3 gap-4 lg:pl-20 w-full lg:w-auto ">
                {products ? (
                    products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className=' flex items-center justify-center w-full h-full '>
                        <p>No  Products at moment</p>
                    </div>
                )}
                {
                    products && products.length <= 0 && (
                        <div className='flex items-center justify-center w-full min-h-screen'>
                            <p>No Product in this category</p>
                        </div>
                    )
                }
            </div>

        </div>
    )
}
