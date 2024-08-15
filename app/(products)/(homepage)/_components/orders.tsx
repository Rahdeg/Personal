"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useGetOrderItems } from '@/features/orders/api/use-get-orderItem'
import { useUser } from '@clerk/nextjs'
import Image from 'next/image'
import React from 'react'
import { format } from "date-fns";
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Loader } from '@/components/ui/loader'

const OrderContainer = () => {

    const { user } = useUser();
    const { data, isLoading, error } = useGetOrderItems(user?.publicMetadata.userId! as string)
    const router = useRouter()


    // const enrichedOrderItemsArray = responseArray.flatMap(response => 
    //     response.orderItems.map(orderItem => ({
    //       ...orderItem,
    //       createdAt: response.createdAt,
    //       status: response.status,
    //       totalAmount: response.totalAmount,
    //       trackingNumber: response.trackingNumber,
    //       userId: response.userId
    //     }))
    //   );


    const seenProducts = new Map<string, Set<string>>();

    const uniqueOrderItems = data?.flatMap(response =>
        response.orderItems.filter(orderItem => {
            const { productId } = orderItem;
            if (!seenProducts.has(productId)) {
                seenProducts.set(productId, new Set<string>());
            }
            const seenResponseIds = seenProducts.get(productId)!;

            if (seenResponseIds.has(response.id)) {
                // If productId has been seen in this response.id, do not include it
                return false;
            }
            // Otherwise, add the response.id to the set
            seenResponseIds.add(response.id);
            return true;
        }).map(orderItem => ({
            ...orderItem,
            createdAt: response.createdAt,
            status: response.status,
            totalAmount: response.totalAmount,
            trackingNumber: response.trackingNumber,
            userId: response.userId,
            orderId: response.id
        }))
    );



    console.log(uniqueOrderItems, "dataenri")


    return (
        <div className=' w-full flex flex-col gap-y-3 px-3 py-3'>
            {
                uniqueOrderItems ? (uniqueOrderItems.map((item, idx) => (
                    <Card key={idx} className=' w-full  cursor-pointer' onClick={() => router.push(`/orders/orderItems/${item.orderId}`)}>
                        <CardContent className='flex flex-col md:flex-row items-start  w-full justify-between py-2'>
                            <div className=' relative flex flex-col md:flex-row gap-y-3 gap-x-3 w-full '>
                                <Image alt='or' src={item.images} width={200} height={200} className=' object-contain' />

                                <div className=' flex flex-col items-start justify-center gap-y-4'>
                                    <div>
                                        <p >{item.productName} <span>({item.quantity})</span></p>
                                        <p className=' text-sm'>{item.trackingNumber}</p>
                                        <div className=' flex items-center justify-start gap-x-2 mt-2'>
                                            <Button variant="outline" size="sm" style={{ backgroundColor: `${item.color}` }} className=' text-white'>
                                                {item.color}
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                {item.size}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className=' flex flex-col gap-y-4'>
                                        <Button className={cn("", item.status === "Processing" ? " bg-yellow-300" : "bg-green-500")}>
                                            {item.status}
                                        </Button>
                                        <p> {format(item.createdAt ?? "", 'MMMM do, yyyy') ?? ""}</p>
                                    </div>

                                </div>
                            </div>



                            <Button variant="ghost" className=' hidden md:block text-orange-500'>
                                SEE DETAILS
                            </Button>

                        </CardContent>
                    </Card>
                ))) : (<div className="flex h-full w-full items-center justify-center">
                    <Loader />
                </div>)
            }

        </div>
    )
}

export default OrderContainer



