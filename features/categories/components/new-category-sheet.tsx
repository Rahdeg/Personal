import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";


import { insertCategorySchema } from "@/db/schema";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNewCategory } from "../hooks/use-new-category";
import { useCreateCategory } from "../api/use-create-category";
import CategoryForm from "./category-form";

export const NewCategorySheet = () => {
    const { isOpen, onClose } = useNewCategory();

    const mutation = useCreateCategory();

    const formSchema = insertCategorySchema.pick({
        name: true
    });

    type FormValues = z.input<typeof formSchema>;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: undefined,
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
                        New Category
                    </SheetTitle>
                    <SheetDescription>
                        Create a new category to track your transactions.
                    </SheetDescription>
                </SheetHeader>
                <CategoryForm onSubmit={onSubmit} disabled={mutation.isPending} defaultValues={{ name: "" }} />
            </SheetContent>
        </Sheet>
    );
};