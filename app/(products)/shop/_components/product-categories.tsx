"use client"
import { Button } from '@/components/ui/button';
import { useGetCategories } from '@/features/categories/api/use-get-categories';
import { ArrowRight } from 'lucide-react';
import React from 'react';

interface ProductCategoryProps {
    onCategorySelect: (category: string | null) => void;
}

export const ProductCategory = ({ onCategorySelect }: ProductCategoryProps) => {
    const categoriesQuery = useGetCategories();
    const categories = categoriesQuery.data;

    return (
        <div className='flex flex-col w-full lg:w-auto'>
            <h1 className='text-xl font-bold py-3 border-b-2'>Product Categories</h1>
            <div className='flex flex-col gap-y-2 py-2'>
                <Button variant="outline"

                    className='flex items-center justify-between'
                    onClick={() => onCategorySelect(null)}
                >
                    <p className='text-[#666565]'>All</p>

                    <ArrowRight className='size-3 text-[#666565]' />

                </Button>
                {
                    categories ? (
                        categories.map((category) => (

                            <Button variant="outline"
                                key={category.id}
                                className='flex items-center justify-between'
                                onClick={() => onCategorySelect(category.id)}
                            >
                                <p className='text-[#666565]'>{category.name}</p>

                                <ArrowRight className='size-3 text-[#666565]' />

                            </Button>


                        ))
                    ) : (
                        <div className='flex items-center justify-center'>
                            <p>No Category</p>
                        </div>
                    )
                }


            </div>
        </div>
    );
}
