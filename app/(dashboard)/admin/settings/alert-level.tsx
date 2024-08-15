"use client";

import { Skeleton } from "@/components/ui/skeleton";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import useStockAlert from "@/hooks/stock-level";




interface AlertLevelProps {
    label: string;

};

export const AlertLevel = ({
    label,
}: AlertLevelProps) => {

    const numbers = Array.from({ length: 100 }, (_, i) => i + 1);

    const { stockLevelAlert, setStockLevelAlert } = useStockAlert()



    const onChange = (newValue: string) => {

        setStockLevelAlert(Number(newValue));
    };

    return (
        <div className="rounded-xl bg-muted p-6">
            <div className="flex items-center justify-between">
                <p className="font-semibold shrink-0">
                    {label}
                </p>
                <div className=" flex items-center justify-center gap-x-2">
                    <Select onValueChange={onChange} value={stockLevelAlert.toString()} >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder='2' />
                        </SelectTrigger>
                        <SelectContent>
                            {numbers.map((number) => (
                                <SelectItem key={number} value={number.toString()} >
                                    {number}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                </div>
            </div>
        </div>
    );
};

export const AlertLevelSkeleton = () => {
    return (
        <Skeleton className="rounded-xl p-10 w-full" />
    );
};