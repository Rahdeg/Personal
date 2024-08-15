"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plus } from 'lucide-react'
import React from 'react'
import { DataTable } from '@/components/data-table'
import { columns } from './columns'
import { Skeleton } from '@/components/ui/skeleton'
import { useNewCategory } from '@/features/categories/hooks/use-new-category'
import { useGetCategories } from '@/features/categories/api/use-get-categories'
import { useBulkDeleteCategory } from '@/features/categories/api/use-bulk-delete'




const CategoriesPage = () => {

    const { onOpen } = useNewCategory();
    const categoriesQuery = useGetCategories();
    const categories = categoriesQuery.data || [];
    const deleteCategories = useBulkDeleteCategory();

    const disabled = categoriesQuery.isLoading || deleteCategories.isPending;



    if (categoriesQuery.isLoading) {
        return (
            <div className=' max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
                <Card className='border-none drop-shadow-sm'>
                    <CardHeader>
                        <Skeleton className='h-8 w-48' />
                    </CardHeader>
                    <CardContent >
                        <div className=' h-[500px] w-full flex items-center justify-center'>
                            <Loader2 className=' size-6 text-slate-300 animate-spin' />
                        </div>

                    </CardContent>
                </Card>
            </div>
        )
    }



    return (
        <div className=' max-w-screen-2xl mx-auto w-full pb-10 -mt-24'>
            <Card className='border-none drop-shadow-sm'>
                <CardHeader className='gap-y-2 lg:flex-row lg:items-center lg:justify-between'>
                    <CardTitle className=' text-xl line-clamp-1'>
                        Category page
                    </CardTitle>
                    <Button onClick={onOpen}>
                        <Plus className=' size-4 mr-2' />
                        Add new
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={categories} filterKey='name' disabled={disabled} onDelete={
                        (row) => {
                            const ids = row.map((r) => r.original.id);
                            deleteCategories.mutate({ ids });
                        }
                    } />
                </CardContent>
            </Card>

        </div>
    )
}

export default CategoriesPage