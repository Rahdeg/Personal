"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useGetOrderItems } from '@/features/orders/api/use-get-orderItem'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'
import { format } from "date-fns";
import { useRouter } from 'next/navigation'
import { Loader } from '@/components/ui/loader'
import { MappedOrderItem, OrderItem } from '@/lib/types'

const ReviewOrder = () => {
    const { user } = useUser();
    const { data, isLoading, error } = useGetOrderItems(user?.publicMetadata.userId! as string)
    const router = useRouter()

    const orderList: MappedOrderItem[] | undefined = data?.flatMap((response: any) =>
        response.orderItems.map((orderItem: OrderItem): MappedOrderItem => ({
            ...orderItem,
            createdAt: response.createdAt,
            status: response.status,
            totalAmount: response.totalAmount,
            trackingNumber: response.trackingNumber,
            userId: response.userId,
            orderId: response.id,
        }))
    );

    const orders = orderList?.filter((order) => order.status === "Delivered" && order.isReviewed === false);

    return (
        <div className='w-full flex flex-col gap-y-3 px-3 py-3'>
            {
                isLoading ? (
                    <div className="flex h-full w-full items-center justify-center">
                        <Loader />
                    </div>
                ) : orders && orders.length > 0 ? (
                    orders.map((item, idx) => (
                        <Card key={idx} className='w-full cursor-pointer' onClick={() => router.push(`/reviews/${item.orderId}/?name=${encodeURIComponent(item.productName)}`)}>
                            <CardContent className='flex flex-col md:flex-row items-start w-full justify-between py-2'>
                                <div className='relative flex flex-col md:flex-row gap-y-3 gap-x-3 w-full'>
                                    <Image alt='or' src={item.image} width={200} height={200} className='object-contain' />
                                    <div className='flex flex-col items-start justify-center gap-y-4'>
                                        <p>{item.productName}</p>
                                        <p className='text-sm'>Order No: <span>{item.trackingNumber}</span></p>
                                        <div className='flex gap-x-4 text-green-500'>
                                            <p>{item.status}</p>
                                            <p>{format(item.createdAt ?? "", 'MMMM do, yyyy') ?? ""}</p>
                                        </div>
                                    </div>
                                </div>
                                <Button variant="ghost" className='hidden md:block text-orange-500'>
                                    RATE THIS PRODUCT
                                </Button>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <p>No order to review at the moment</p>
                    </div>
                )
            }
        </div>
    )
}

export default ReviewOrder
