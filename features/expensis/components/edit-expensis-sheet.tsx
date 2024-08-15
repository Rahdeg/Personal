import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { insertExpensisSchema } from "@/db/schema";
import { z } from "zod";
import { useGetExpensis } from "../api/use-get-expensis";
import { useOpenExpensis } from "../hooks/use-open-expensis";
import { Loader2 } from "lucide-react";
import { useEditExpensis } from "../api/use-edit-expensis";
import { useDeleteExpensis } from "../api/use-delete-expensis";
import { useConfirm } from "@/hooks/use-confirm";
import SizeForm from "./expensis-form";

export const EditExpensisSheet = () => {
    const { isOpen, onClose, id } = useOpenExpensis();
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this size"
    )

    const expensisQuery = useGetExpensis(id);
    const editMutation = useEditExpensis(id);
    const deleteMutation = useDeleteExpensis(id);

    const isPending = editMutation.isPending || deleteMutation.isPending;

    const isLoading = expensisQuery.isLoading;

    const formSchema = z.object({
        name: z.string(),
        amount: z.string(),
    });

    type FormValues = z.input<typeof formSchema>;




    const onSubmit = (values: FormValues) => {
        editMutation.mutate({ ...values, amount: Number(values.amount) }, {
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

    const defaultValues = expensisQuery.data ? {
        name: expensisQuery.data.name,
        amount: expensisQuery.data.amount.toString(),
    } : {
        name: "",
        amount: '',
    }



    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>
                            Edit Expensis
                        </SheetTitle>
                        <SheetDescription>
                            Edit your  expensis to track your shoes.
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