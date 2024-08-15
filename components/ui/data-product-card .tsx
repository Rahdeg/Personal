import { IconType } from "react-icons";
import { VariantProps, cva } from "class-variance-authority";

import { cn, formatCurrency, formatPercentage } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";

import { Skeleton } from "./skeleton";
import { CountUp } from "../count-up";


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
    isOrder?: boolean;
}



export const ProductDataCard = ({ title, value = 0, dateRange, percentageChange = 0, variant, isOrder }: DataCardProps) => {
    return (
        <Card className=" border-none drop-shadow-sm rounded-2xl">
            <CardHeader className=" flex flex-row items-center justify-between gap-x-4">
                <div className=" space-y-2">
                    <CardTitle className=" text-2xl line-clamp-1">
                        {title}
                    </CardTitle>
                    <CardDescription className=" line-clamp-1">
                        {dateRange}
                    </CardDescription>
                </div>
                <div className={cn("shrink-0 flex items-center justify-center", boxVariant({ variant }),)}>
                    <h1 className=" font-bold text-2xl mb-2 line-clamp-1 break-all">
                        <CountUp
                            preserveValue
                            start={0}
                            end={24}
                            decimalPlaces={2}
                        />
                    </h1>
                </div>

            </CardHeader>
            <CardContent>
                <div className=" flex items-center justify-between">
                    <p className=" font-bold text-2xl">
                        {
                            isOrder ? "Paid " : " Sold"
                        }
                    </p>

                    <div className={cn("shrink-0 flex items-center justify-center", boxVariant({ variant }),)}>
                        <h1 className=" font-bold text-2xl mb-2 line-clamp-1 break-all">
                            <CountUp
                                preserveValue
                                start={0}
                                end={value}
                                decimalPlaces={2}
                            />
                        </h1>
                    </div>
                </div>
                {
                    isOrder && (
                        <div className=" flex items-center justify-between py-2">
                            <p className=" font-bold text-2xl">
                                Unpaid
                            </p>

                            <div className={cn("shrink-0 flex items-center justify-center", boxVariant({ variant }),)}>
                                <h1 className=" font-bold text-2xl mb-2 line-clamp-1 break-all">
                                    <CountUp
                                        preserveValue
                                        start={0}
                                        end={value}
                                        decimalPlaces={2}
                                    />
                                </h1>
                            </div>
                        </div>
                    )
                }
            </CardContent>
        </Card>
    )
}

export const ProductDataCardLoading = () => {
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
