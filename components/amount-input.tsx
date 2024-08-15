import CurrencyInput from "react-currency-input-field"
import { Info, MinusCircle, PlusCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "./ui/tooltip"


type Props = {
    value: string;
    onChange: (value: string | undefined) => void;
    placeholder?: string;
    disabled?: boolean;
}

const AmountInput = ({ value, onChange, placeholder, disabled }: Props) => {
    // const parsedValue = parseFloat(value);
    // const isIncome = parsedValue > 0;
    // const isExpense = parsedValue < 0;

    // const onReversedValue = () => {
    //     if (!value) return;
    //     const newValue = parseFloat(value) * -1
    //     onChange(newValue);
    // };



    return (
        <div className=" relative">
            <TooltipProvider>
                <Tooltip delayDuration={100}>
                    <TooltipTrigger asChild>
                        <button type="button" className={cn(" hover:bg-slate-500 absolute top-1.5 left-1.5 rounded-md p-2 flex items-center justify-center transition bg-emerald-500",)}>

                            <PlusCircle className=" size-3 text-white" />
                        </button>
                    </TooltipTrigger>
                    <TooltipContent>
                        Product price
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <CurrencyInput
                prefix="₦"
                className="pl-10 flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={placeholder}
                value={value}
                decimalsLimit={2}
                decimalScale={2}
                onValueChange={onChange}
                disabled={disabled}
            />

        </div>
    )
}

export default AmountInput