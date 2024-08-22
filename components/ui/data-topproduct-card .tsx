import { IconType } from "react-icons";
import { VariantProps, cva } from "class-variance-authority";

import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";

import { Skeleton } from "./skeleton";
import { CountUp } from "../count-up";
import { Button } from "./button";
import { useGetProductWithIds } from "@/features/products/api/use-get-products-withId";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import useAppState from "@/hooks/app-states";



const boxVariant = cva(
    "rounded-full w-20 h-20",
    {
        variants: {
            variant: {
                default: "bg-blue-500/20",
                success: "bg-emerald-500/20",
                danger: "bg-rose-500/20",
                warning: "bg-yellow-500/20"
            }
        },
        defaultVariants: {
            variant: "default",
        }
    }
)

const iconVariant = cva(
    "size-6",
    {
        variants: {
            variant: {
                default: "fill-blue-500",
                success: "fill-emerald-500",
                danger: "fill-rose-500",
                warning: "fill-yellow-500"
            }
        },
        defaultVariants: {
            variant: "default",
        }
    }
)

type BoxVariants = VariantProps<typeof boxVariant>;
type IconVariants = VariantProps<typeof iconVariant>;

interface DataCardProps extends BoxVariants, IconVariants {

    title: string;
    value?: number;
    dateRange: string;
    percentageChange?: number;
    data: {
        categoryName: string | null,
        totalQuantity: number | any,
        sellingPrice: number

    }[]
}




export const TopProductDataCard = ({ title, value = 0, dateRange, percentageChange = 0, variant, data = [] }: DataCardProps) => {

    const { currency } = useAppState();



    return (
        <Card className=" border-none drop-shadow-sm rounded-2xl">
            <CardHeader className=" flex flex-row items-center justify-between gap-x-4">
                <div className=" space-y-2">
                    <CardTitle className=" text-2xl line-clamp-1">
                        <Button className=" flex items-center justify-center gap-x-3 text-base font-bold bg-blue-900">
                            <p>
                                {title}
                            </p>



                            ( <CountUp
                                preserveValue
                                start={0}
                                end={value}
                                decimalPlaces={2}
                            />
                            )
                        </Button>

                    </CardTitle>
                    <CardDescription className=" line-clamp-1 text-blue-900">
                        {dateRange}
                    </CardDescription>
                </div>


            </CardHeader>
            <CardContent className=" space-y-3">
                {
                    data?.map((item, idx) => (
                        <Button size="lg" variant="outline" key={idx} className=" flex items-center justify-between gap-x-3  w-full  p-3">
                            <p>{item?.categoryName}</p>
                            <p> QTY: {item?.totalQuantity}</p>
                            <p> {formatCurrency(item?.sellingPrice * item?.totalQuantity, currency)}</p>
                        </Button>
                    ))
                }
            </CardContent>
        </Card>
    )
}



export const TopProductDataCardLoading = () => {
    return (
        <Card className="borer-none drop-shadow-sm h-[192px]">
            <CardHeader className="flex flex-row items-center jsutify-between gap-x-4">
                <div className="space-y-2">
                    <Skeleton className="h-6 w-24" />
                    <Skeleton className="h-4 w-40" />
                </div>
                <Skeleton className="size-12" />
            </CardHeader>
            <CardContent>
                <Skeleton className="shrink-0 h-10 w-24 mb-2" />
                <Skeleton className="shrink-0 h-4 w-40" />
            </CardContent>
        </Card>
    );
};
