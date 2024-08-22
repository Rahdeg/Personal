'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useGetOrderItems } from "@/features/orders/api/use-get-orderItem";
import { useUser } from "@clerk/nextjs";
import { MoveLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Loader } from "@/components/ui/loader";
import { cn, formatAmount, formatCurrency } from "@/lib/utils";
import useAppState from "@/hooks/app-states";
import { MappedOrderItem, OrderItem } from "@/lib/types";

interface OrderItemsPageProps {
    params: {
        orderId: string
    }
}

const OrderItemsPage: React.FC<OrderItemsPageProps> = ({ params }) => {

    const { user } = useUser();
    const { data, isLoading, error } = useGetOrderItems(user?.publicMetadata.userId! as string)
    const router = useRouter()

    const { currency } = useAppState();


    const ordersList: MappedOrderItem[] | undefined = data?.flatMap((response: any) =>
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



    const orders = ordersList?.filter((order) => order.orderId === params.orderId);

    return (
        <div className="p-5 flex flex-col">
            <div className="py-3 flex gap-x-2">
                <MoveLeft className="cursor-pointer" onClick={() => router.push("/orders")} />
                <p className="font-bold text-base">Order Details</p>
            </div>
            <hr />

            <div className="flex flex-col py-5">
                {orders && (<p className="font-bold text-sm"><span className="mr-2">Order No:</span>{orders[0].orderId}</p>)}
                {orders && (
                    <div className="mt-2 text-gray-500">
                        <p>{orders.length} <span className="ml-1">Items</span></p>
                        <p>{format(orders[0].createdAt ?? "", 'MMMM do, yyyy') ?? ""}</p>
                        <p>{formatAmount(orders[0].totalAmount!, currency)}</p>
                    </div>
                )}
            </div>

            <hr />

            <div className="mt-6">
                <p>ITEMS IN YOUR ORDER</p>
            </div>

            <div className='w-full flex flex-col gap-y-3 px-3 py-3'>
                {orders ? (orders.map((item) => (
                    <Card key={item.productId} className='w-full cursor-pointer' onClick={() => router.push(`/shop`)}>
                        <CardContent className='flex flex-col md:flex-row items-start w-full justify-between py-2'>
                            <div className='flex flex-col md:flex-row gap-y-3 gap-x-3 w-full'>
                                <div className="relative flex flex-col gap-y-3">
                                    <Button className={cn("", item.status === "Processing" ? "bg-yellow-300" : "bg-green-500")}>
                                        {item.status}
                                    </Button>
                                    <Image alt='or' src={item.image!} width={200} height={200} className='object-contain' />
                                </div>
                                <div className='flex flex-col items-start justify-center gap-y-4'>
                                    <div>
                                        <p>{item.productName}</p>
                                        <div className='flex items-center justify-start gap-x-2 mt-2'>
                                            <Button variant="outline" size="sm" style={{ backgroundColor: `${item.color}` }} className='text-white'>
                                                {item.color}
                                            </Button>
                                            <Button variant="outline" size="sm">
                                                {item.size}
                                            </Button>
                                        </div>
                                    </div>
                                    <p className="text-gray-500"> QTY :<span className="ml-1">{item.quantity}</span></p>
                                    <p className='text-sm'>{formatCurrency(item.amount, currency)}</p>
                                    <div className='flex flex-col gap-y-4'>
                                        <p>{format(item.createdAt ?? "", 'MMMM do, yyyy') ?? ""}</p>
                                    </div>
                                </div>
                            </div>
                            <Button variant="outline" className='hidden md:block text-white bg-[#ed5221]'>
                                BUY AGAIN
                            </Button>
                        </CardContent>
                    </Card>
                ))) : (
                    <div className="flex h-full w-full items-center justify-center">
                        <Loader />
                    </div>
                )}
            </div>
        </div>
    );
}

export default OrderItemsPage;
