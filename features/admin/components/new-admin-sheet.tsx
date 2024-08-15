import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";


import { insertAdminSchema } from "@/db/schema";
import { z } from "zod";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNewAdmin } from "../hooks/use-new-admin";
import { useCreateAdmin } from "../api/use-create-admin";
import AdminForm from "./admin-form";

export const NewAdminSheet = () => {
    const { isOpen, onClose } = useNewAdmin();

    const mutation = useCreateAdmin();

    const formSchema = insertAdminSchema.pick({
        name: true,
        email: true
    });

    type FormValues = z.input<typeof formSchema>;

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: undefined,
            email: undefined

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
                        New Admin
                    </SheetTitle>
                    <SheetDescription>
                        Add a new admin .
                    </SheetDescription>
                </SheetHeader>
                <AdminForm onSubmit={onSubmit} disabled={mutation.isPending} defaultValues={{ name: "", email: '' }} />
            </SheetContent>
        </Sheet>
    );
};