"use client"

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Currency from "@/components/ui/currency";
import useCart from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useCheckout } from "./use-checkout";




const Summary = () => {
    const items = useCart((state) => state.items);
    const removeAll = useCart((state) => state.removeAll);
    const searchParams = useSearchParams();
    const checkout = useCheckout();

    useEffect(() => {
        if (searchParams.get("success")) {
            toast.success("Payment completed")
            removeAll();
        }

        if (searchParams.get("canceled")) {
            toast.error("Something went wrong.")
        }

    }, [searchParams, removeAll])


    const totalPrice = items.reduce((total, item) => { return total + Number(item.sellingPrice * item.quantity) }, 0)

    const onCheckout = async () => {

        const productItems = items.map((item) => ({
            productId: item.id, // renaming `id` to `productId`
            color: item.colors || undefined, // ensuring color is a string or undefined
            size: item.sizes || undefined, // ensuring size is a string or undefined
            quantity: item.quantity,
        }));

        checkout.mutate({ items: productItems });
    }

    return (
        <div className=" mt-16 rounded-lg bg-gray-50 px-4 py-6 sm:p-6 lg:col-span-5 lg:mt-0 lg:p-8">
            <h2 className=" text-lg font-medium text-gray-900">
                Order Summary
            </h2>
            <div className=" mt-6 space-y-4">
                <div className=" flex items-center justify-between border-t border-gray-200 pt-4">
                    <div className=" text-base font-medium text-gray-900">
                        Order total
                    </div>
                    <Currency value={totalPrice} />
                </div>
            </div>
            <Button disabled={items.length === 0 || checkout.isPending} className="w-full mt-6" onClick={onCheckout} >
                Checkout
            </Button>
        </div>
    )
}

export default Summary;