"use client"

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, Plus } from 'lucide-react'
import React from 'react'
import { DataTable } from '@/components/data-table'
import { columns } from './columns'
import { Skeleton } from '@/components/ui/skeleton'
import { useNewExpensis } from '@/features/expensis/hooks/use-new-expensis'
import { useGetExpenses } from '@/features/expensis/api/use-get-expenses'
import { useBulkDeleteExpensis } from '@/features/expensis/api/use-bulk-expensis'





const SizePage = () => {

    const { onOpen } = useNewExpensis();
    const expensisQuery = useGetExpenses();
    const expensis = expensisQuery.data || [];
    const deleteExpensis = useBulkDeleteExpensis();

    const disabled = expensisQuery.isLoading || deleteExpensis.isPending;



    if (expensisQuery.isLoading) {
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
                        Expensis page
                    </CardTitle>
                    <Button onClick={onOpen}>
                        <Plus className=' size-4 mr-2' />
                        Add new expensis
                    </Button>
                </CardHeader>
                <CardContent>
                    <DataTable columns={columns} data={expensis} filterKey='name' disabled={disabled} onDelete={
                        (row) => {
                            const ids = row.map((r) => r.original.id);
                            deleteExpensis.mutate({ ids });
                        }
                    } />
                </CardContent>
            </Card>

        </div>
    )
}

export default SizePage