import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
} from "@/components/ui/sheet";
import { insertAdminSchema } from "@/db/schema";
import { z } from "zod";
import { useGetAdmin } from "../api/use-get-admin";
import { useOpenAdmin } from "../hooks/use-open-admin";
import { Loader2 } from "lucide-react";
import { useEditAdmin } from "../api/use-edit-admin";
import { useDeleteAdmin } from "../api/use-delete-admin";
import { useConfirm } from "@/hooks/use-confirm";
import SizeForm from "./admin-form";

export const EditAdminSheet = () => {
    const { isOpen, onClose, id } = useOpenAdmin();
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure?",
        "You are about to delete this admin"
    )

    const adminQuery = useGetAdmin(id);
    const editMutation = useEditAdmin(id);
    const deleteMutation = useDeleteAdmin(id);

    const isPending = editMutation.isPending || deleteMutation.isPending;

    const isLoading = adminQuery.isLoading;

    const formSchema = insertAdminSchema.pick({
        name: true,
        email: true
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

    const defaultValues = adminQuery.data ? {
        name: adminQuery.data.name,
        email: adminQuery.data.email,
    } : {
        name: "",
        email: '',
    }



    return (
        <>
            <ConfirmDialog />
            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent className="space-y-4">
                    <SheetHeader>
                        <SheetTitle>
                            Edit Admin
                        </SheetTitle>
                        <SheetDescription>
                            Edit your  Admin.
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