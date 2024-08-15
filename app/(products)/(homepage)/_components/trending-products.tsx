"use client"

import { useState, useRef } from 'react';
import { ProductCard } from '../../shop/_components/product-card';
import { useGetFeaturedProducts } from '@/features/products/api/use-get-featured-products';

const TrendingProducts = () => {
    const productsQuery = useGetFeaturedProducts("isFeatured");
    const products = productsQuery.data;


    const scrollRef = useRef<HTMLDivElement>(null);
    const [scrollPosition, setScrollPosition] = useState(0);

    const handleScrollLeft = () => {
        if (scrollRef.current) {
            const newScrollPosition = scrollPosition - 200;
            scrollRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            });
            setScrollPosition(newScrollPosition);
        }
    };

    const handleScrollRight = () => {
        if (scrollRef.current) {
            const newScrollPosition = scrollPosition + 200;
            scrollRef.current.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            });
            setScrollPosition(newScrollPosition);
        }
    };

    return (
        <div className=" px-3 lg:px-14 w-full py-16 mt-16 md:mt-0 flex flex-col gap-y-10">
            <div className=' flex items-center justify-between w-full '>
                <h2 className="text-2xl font-bold mb-4 text-[#666565]">Trending Products</h2>
                <div className="space-x-2">
                    <button
                        className="w-8 h-8 bg-orange-100 text-orange-500 rounded-full"
                        onClick={handleScrollLeft}
                    >
                        &larr;
                    </button>
                    <button
                        className="w-8 h-8 bg-orange-500 text-white rounded-full"
                        onClick={handleScrollRight}
                    >
                        &rarr;
                    </button>
                </div>
            </div>

            <div className="flex items-center overflow-x-scroll w-full" ref={scrollRef}>
                {products ? (
                    products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <div className='flex items-center justify-center'>
                        <p>No Trending Products</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrendingProducts;
