import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { insertColorSchema } from "@/db/schema";
import { z } from "zod";
import { useGetColor } from "../api/use-get-color";
import { useOpenColor } from "../hooks/use-open-color";
import { Loader2 } from "lucide-react";
import { useEditColor } from "../api/use-edit-color";
import { useDeleteColor } from "../api/use-delete-color";
import { useConfirm } from "@/hooks/use-confirm";
import ColorForm from "./color-form";

export const EditColorSheet = () => {
    const { isOpen, onClose, id } = useOpenColor();
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this color"
    )

    const colorQuery = useGetColor(id);
    const editMutation = useEditColor(id);
    const deleteMutation = useDeleteColor(id);

    const isPending = editMutation.isPending || deleteMutation.isPending;

    const isLoading = colorQuery.isLoading;

    const formSchema = insertColorSchema.pick({
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

    const defaultValues = colorQuery.data ? {
        name: colorQuery.data.name,
        value: colorQuery.data.value
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
                            Edit Color
                        </SheetTitle>
                        <SheetDescription>
                            Edit your  color to track your shoes.
                        </SheetDescription>
                    </SheetHeader>
                    {
                        isLoading ? (
                            <div className=" absolute inset-0 flex items-center justify-center">
                                <Loader2 className=" size-4 text-muted-foreground animate-spin" />
                            </div>
                        ) : (<ColorForm onSubmit={onSubmit} disabled={isPending} defaultValues={defaultValues} id={id} onDelete={onDelete} />)
                    }

                </SheetContent>
            </Sheet>
        </>

    );
};