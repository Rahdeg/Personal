import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";


import { insertExpensisSchema } from "@/db/schema";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNewExpensis } from "../hooks/use-new-expensis";
import { useCreateExpensis } from "../api/use-create-expensis";
import ExpensisForm from "./expensis-form";

export const NewExpensisSheet = () => {
    const { isOpen, onClose } = useNewExpensis();

    const mutation = useCreateExpensis();

    const formSchema = z.object({
        name: z.string(),
        amount: z.string(),
    });

    type FormValues = z.input<typeof formSchema>;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: undefined,
            amount: undefined

        },
    });


    const onSubmit = (values: FormValues) => {
        mutation.mutate({ ...values, amount: Number(values.amount) }, {
            onSuccess: () => {
                form.reset();
                onClose();
            },
        });
    };



    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="space-y-4">
                <SheetHeader>
                    <SheetTitle>
                        New Expensis
                    </SheetTitle>
                    <SheetDescription>
                        Create a new expensis .
                    </SheetDescription>
                </SheetHeader>
                <ExpensisForm onSubmit={onSubmit} disabled={mutation.isPending} defaultValues={{ name: "", amount: '' }} />
            </SheetContent>
        </Sheet>
    );
};