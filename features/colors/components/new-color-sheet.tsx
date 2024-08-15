import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";


import { insertColorSchema } from "@/db/schema";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNewColor } from "../hooks/use-new-color";
import { useCreateColor } from "../api/use-create-color";
import ColorForm from "./color-form";

export const NewColorSheet = () => {
    const { isOpen, onClose } = useNewColor();

    const mutation = useCreateColor();

    const formSchema = insertColorSchema.pick({
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
                        New Color
                    </SheetTitle>
                    <SheetDescription>
                        Create a new color to be attached to your Shoes.
                    </SheetDescription>
                </SheetHeader>
                <ColorForm onSubmit={onSubmit} disabled={mutation.isPending} defaultValues={{ name: "", value: "" }} />
            </SheetContent>
        </Sheet>
    );
};