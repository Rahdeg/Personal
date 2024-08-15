"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plus } from 'lucide-react'
import React from 'react'
import { DataTable } from '@/components/data-table'
import { columns } from './columns'
import { Skeleton } from '@/components/ui/skeleton'
import { useBulkDeleteProduct } from '@/features/products/api/use-bulk-delete-product'
import { useRouter } from 'next/navigation'
import { useGetAdminProducts } from '@/features/products/api/use-get-admin-products'






const ColorPage = () => {

    const productsQuery = useGetAdminProducts(null);
    const products = productsQuery.data || [];
    const deleteProducts = useBulkDeleteProduct();

    const disabled = productsQuery.isLoading || deleteProducts.isPending;
    const router = useRouter();



    if (productsQuery.isLoading) {
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
                    <CardTitle className=' flex flex-col items-start justify-center'>
                        <h1 className=' text-2xl font-bold text-blue-900'>
                            Products ({products.length})
                        </h1>
                        <p className=' text-base text-blue-900'>Manage products for the Store</p>
                    </CardTitle>
                    <Button onClick={() => router.push(`/admin/products/new`)} className=' bg-blue-900'>
                        <Plus className=' size-4 mr-2' />
                        Add new
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={products} filterKey='name' disabled={disabled} onDelete={
                        (row) => {
                            const ids = row.map((r) => r.original.id);
                            deleteProducts.mutate({ ids });
                        }
                    } />
                </CardContent>
            </Card>

        </div>
    )
}

export default ColorPage