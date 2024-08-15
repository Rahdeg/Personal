import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";


import { insertSizeSchema } from "@/db/schema";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNewSize } from "../hooks/use-new-size";
import { useCreateSize } from "../api/use-create-size";
import SizeForm from "./size-form";

export const NewSizeSheet = () => {
    const { isOpen, onClose } = useNewSize();

    const mutation = useCreateSize();

    const formSchema = insertSizeSchema.pick({
        name: true,
        value: true
    });

    type FormValues = z.input<typeof formSchema>;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: undefined,
            value: undefined

        },
    });


    const onSubmit = (values: FormValues) => {
        mutation.mutate(values, {
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
                        New Size
                    </SheetTitle>
                    <SheetDescription>
                        Create a new size to be attached to your Shoes.
                    </SheetDescription>
                </SheetHeader>
                <SizeForm onSubmit={onSubmit} disabled={mutation.isPending} defaultValues={{ name: "", value: "" }} />
            </SheetContent>
        </Sheet>
    );
};