import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { insertSizeSchema } from "@/db/schema";
import { z } from "zod";
import { useGetSize } from "../api/use-get-size";
import { useOpenSize } from "../hooks/use-open-size";
import { Loader2 } from "lucide-react";
import { useEditSize } from "../api/use-edit-size";
import { useDeleteSize } from "../api/use-delete-size";
import { useConfirm } from "@/hooks/use-confirm";
import SizeForm from "./size-form";

export const EditSizeSheet = () => {
    const { isOpen, onClose, id } = useOpenSize();
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this size"
    )

    const categoryQuery = useGetSize(id);
    const editMutation = useEditSize(id);
    const deleteMutation = useDeleteSize(id);

    const isPending = editMutation.isPending || deleteMutation.isPending;

    const isLoading = categoryQuery.isLoading;

    const formSchema = insertSizeSchema.pick({
        name: true,
        value: true
    });

    type FormValues = z.input<typeof formSchema>;




    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values, {
            onSuccess: () => {
                onClose();
            },
        });
    };

    const onDelete = async () => {
        const ok = await confirm();

        if (ok) {
            deleteMutation.mutate(undefined, {
                onSuccess: () => {
                    onClose();
                }
            })
        }

    }

    const defaultValues = categoryQuery.data ? {
        name: categoryQuery.data.name,
        value: categoryQuery.data.value
    } : {
        name: "",
        value: "",
    }



    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>
                            Edit Size
                        </SheetTitle>
                        <SheetDescription>
                            Edit your  size to track your shoes.
                        </SheetDescription>
                    </SheetHeader>
                    {
                        isLoading ? (
                            <div className=" absolute inset-0 flex items-center justify-center">
                                <Loader2 className=" size-4 text-muted-foreground animate-spin" />
                            </div>
                        ) : (<SizeForm onSubmit={onSubmit} disabled={isPending} defaultValues={defaultValues} id={id} onDelete={onDelete} />)
                    }

                </SheetContent>
            </Sheet>
        </>

    );
};