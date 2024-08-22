"use client"
import { Button } from '@/components/ui/button'
import { useGetOrderItems } from '@/features/orders/api/use-get-orderItem'
import { useCreateReview } from '@/features/reviews/api/use-create-review'
import { MappedOrderItem, OrderItem } from '@/lib/types'
import { useUser } from '@clerk/nextjs'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

import React, { FormEvent, useState } from 'react'
import { toast } from 'sonner'


interface OrderReviewPageProps {
    params: {
        reviewId: string
    }
}

const ReviewPage: React.FC<OrderReviewPageProps> = ({ params }) => {

    const { user } = useUser();
    const { data, isLoading, error } = useGetOrderItems(user?.publicMetadata.userId! as string)



    const router = useRouter()
    const searchParams = useSearchParams();
    const productName = searchParams.get("name");


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


    const orders = orderList?.filter((order) => order.orderId === params.reviewId && order.productName === productName)[0];

    const productId = orders?.productId!;
    const userId = user?.publicMetadata.userId! as string;


    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [reviewTitle, setReviewTitle] = useState("");
    const [reviewDetail, setReviewDetail] = useState("");
    const [name, setName] = useState(user?.username!);

    const handleRating = (index: React.SetStateAction<number>) => {
        setRating(index);
    };

    const handleHover = (index: React.SetStateAction<number>) => {
        setHoverRating(index);
    };

    const mutation = useCreateReview();

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();

        const reviewData = {
            productId,
            userId,
            rating,
            comment: `${reviewTitle}: ${reviewDetail}`,
        };



        mutation.mutate(reviewData, {
            onSuccess: () => {
                toast.success("Review submitted successfully!");
                router.back();
                setRating(0);
                setReviewTitle("");
                setReviewDetail("");
            },
            onError: (error: Error) => {
                alert(`Error submitting review: ${error.message}`);
            },
        });
    };

    return (
        <div className="p-6  bg-white shadow-md rounded-lg">
            <h2 className="text-lg font-bold mb-4 flex  items-center  border-b-2 pb-4"> <span> <ArrowLeft onClick={() => router.push('/reviews')} className='mr-2 cursor-pointer' /></span>Rate & Review</h2>

            <div className="mb-6">
                <h3 className="text-sm font-semibold mb-2  border-b-2 pb-4">SELECT THE STARS TO RATE THE PRODUCT</h3>
                <div className="flex flex-col lg:flex-row items-start mb-4 justify-start gap-x-4 py-4">
                    <Image alt='or' src={orders?.image!} width={200} height={200} className=' object-contain' />
                    <div>
                        <p className="font-medium mb-4">{orders?.productName}</p>
                        <div className="flex">
                            {[1, 2, 3, 4, 5].map((index) => (
                                <svg
                                    key={index}
                                    className={`w-8 h-8 cursor-pointer ${(hoverRating || rating) >= index
                                        ? "text-yellow-400"
                                        : "text-gray-300"
                                        }`}
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 24 24"
                                    onMouseEnter={() => handleHover(index)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => handleRating(index)}
                                >
                                    <path d="M12 .587l3.668 7.431 8.2 1.191-5.934 5.777 1.4 8.162L12 18.897l-7.334 3.851 1.4-8.162-5.934-5.777 8.2-1.191z" />
                                </svg>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your name
                </label>
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Review Title
                </label>
                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                    placeholder="e.g. I like it! / I don't like it!"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Detailed Review
                </label>
                <textarea
                    rows={4}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring focus:ring-indigo-200 focus:border-indigo-500"
                    placeholder="Tell us more about your rating!"
                    value={reviewDetail}
                    onChange={(e) => setReviewDetail(e.target.value)}
                />
            </div>



            <Button disabled={mutation.isPending} onClick={onSubmit} className="w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition">
                Submit Review
            </Button>
        </div>
    )
}

export default ReviewPage