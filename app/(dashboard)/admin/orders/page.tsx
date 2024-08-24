"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plus } from 'lucide-react'
import React from 'react'
import { DataTable } from '@/components/data-table'
import { columns } from './columns'
import { Skeleton } from '@/components/ui/skeleton'
import { useGetOrders } from '@/features/orders/api/use-get-orders'
import { useBulkDeleteOrders } from '@/features/orders/api/use-bulk-delete-orders'





const SizePage = () => {


    const orderQuery = useGetOrders();
    const orders = orderQuery.data || [];
    const deleteOrders = useBulkDeleteOrders();


    const disabled = orderQuery.isLoading || deleteOrders.isPending;

    const paidOrdersLength = orders.filter(order => order.isPaid === true).length;
    const unPaidOrdersLength = orders.filter(order => order.isPaid === false).length;

    console.log(orders, "orders");

    if (orderQuery.isLoading) {
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
                <CardHeader className='gap-y-2 flex-row items-center justify-between'>
                    <CardTitle className=' flex flex-col items-start justify-center'>
                        <h1 className=' text-2xl font-bold text-blue-900'>
                            Orders ({orders.length})
                        </h1>
                        <p className=' text-base text-blue-900'>See  products Orders</p>
                    </CardTitle>
                    <div className=' flex flex-col md:flex-row items-center justify-center gap-2'>
                        <Button variant="outline" className='text-base text-blue-900 '>
                            <p className=' mr-2'>Paid Order</p>   ({paidOrdersLength})
                        </Button>

                    </div>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={orders} filterKey='status' disabled={disabled} onDelete={
                        (row) => {
                            const ids = row.map((r) => r.original.id);
                            deleteOrders.mutate({ ids });
                        }
                    } />
                </CardContent>
            </Card>

        </div>
    )
}

export default SizePage