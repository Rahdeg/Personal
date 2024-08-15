"use client"
import React, { useEffect, useState } from 'react';
import { ProductCategory } from './product-categories';
import { ProductList } from './product-list';
import { useGetProducts } from '@/features/products/api/use-get-products';

export const ProductContainer = () => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);



    const productsQuery = useGetProducts(selectedCategory);
    const products = productsQuery.data;



    return (
        <div className='flex flex-col md:flex-row items-center md:items-start justify-start gap-x-4 w-full'>
            <ProductCategory onCategorySelect={setSelectedCategory} />
            <ProductList products={products || []} />
        </div>
    );
}
