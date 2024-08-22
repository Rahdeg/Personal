"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import useAppState from "@/hooks/app-states";


// List of all possible currencies with their names
const currencies = [
    { code: "USD", name: "US Dollar" },
    { code: "EUR", name: "Euro" },
    { code: "GBP", name: "British Pound" },
    { code: "NGN", name: "Nigerian Naira" },
    { code: "JPY", name: "Japanese Yen" },
    { code: "CAD", name: "Canadian Dollar" },
    // Add more currencies as needed
];

interface CurrencyTypeProps {
    label: string;
}

export const CurrencyType = ({ label }: CurrencyTypeProps) => {

    const { currency, setCurrency } = useAppState();



    const onCurrencyChange = (newCurrency: string) => {
        setCurrency(newCurrency);
    };

    return (
        <div className="rounded-xl bg-muted p-6">
            <div className="flex items-center justify-between">
                <p className="font-semibold shrink-0">
                    {label}
                </p>
                <div className="flex items-center justify-center gap-x-2">
                    <Select onValueChange={onCurrencyChange} value={currency}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select Currency" />
                        </SelectTrigger>
                        <SelectContent>
                            {currencies.map((currency) => (
                                <SelectItem key={currency.code} value={currency.code}>
                                    {currency.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>
        </div>
    );
};

export const CurrencyTypeSkeleton = () => {
    return (
        <Skeleton className="rounded-xl p-10 w-full" />
    );
};
