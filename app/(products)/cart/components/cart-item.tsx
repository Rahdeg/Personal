"use client"
import { CartProduct, Product } from "@/types"
import { X } from "lucide-react"
import Image from "next/image"


import Currency from "@/components/ui/currency"
import useCart from "@/hooks/use-cart"
import { useEffect, useState } from "react"
import IconButton from "@/components/ui/icon-button"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface CartItemProps {
    data: CartProduct
}

const CartItem: React.FC<CartItemProps> = ({ data }) => {

    const [isMounted, setIsMounted] = useState(false)

    useEffect(() => {
        setIsMounted(true);
    }, [])

    const cart = useCart();



    if (!isMounted) {
        return null;
    }

    const onRemove = () => {
        cart.removeItem(data.id)
    }

    return (
        <div className=" flex py-6 border-b">
            <div className=" relative h-24 w-24 rounded-md overflow-hidden sm:h-48 sm:w-48">
                <Image fill src={data.images[0].url} className=" object-cover object-center" alt="" />
            </div>
            <div className=" relative ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                <div className=" absolute z-10 right-0 top-0">
                    <IconButton icon={<X size={15} onClick={onRemove} />} />
                </div>
                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                    <div className=" flex justify-between">
                        <p className=" text-lg font-semibold text-black">
                            {data.name}
                        </p>
                    </div>
                    <div className="mt-1 flex text-sm py-3 md:py-0">
                        <div className=" ">
                            <Button
                                type="button"
                                variant="outline"
                                className=
                                "h-10 w-10 rounded-full border border-gray-600"

                                style={{ backgroundColor: data.colors! }}

                            ></Button>
                        </div>
                        <div className=" ml-2  pr-4">
                            <Button
                                type="button"
                                variant="outline"
                                className=
                                " text-black"



                            >
                                {data.sizes}
                            </Button>
                        </div>

                        <Button variant="outline">
                            Q {data.quantity}
                        </Button>

                    </div>

                    <Currency value={data.sellingPrice * data.quantity} />
                </div>
            </div>
        </div>
    )
}

export default CartItem