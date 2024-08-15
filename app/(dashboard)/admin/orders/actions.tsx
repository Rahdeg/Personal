"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDeleteOrder } from "@/features/orders/api/use-delete-order";
import { useOpenOrder } from "@/features/orders/hooks/use-open-order";
import { useConfirm } from "@/hooks/use-confirm";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

type Props = {
    id: string;
}

const Actions = ({ id }: Props) => {

    const { onOpen } = useOpenOrder();
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure",
        "You are about to delete this order"
    )
    const deleteMutation = useDeleteOrder(id);

    const handleDelete = async () => {
        const ok = await confirm();

        if (ok) {
            deleteMutation.mutate();
        }
    }


    return (
        <>
            <ConfirmDialog />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className=" size-8 p-0">
                        <MoreHorizontal />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled={deleteMutation.isPending} onClick={() => onOpen(id)}>
                        <Edit className=" size-4 mr-2" />
                        Update
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled={deleteMutation.isPending} onClick={handleDelete}>
                        <Trash className=" size-4 mr-2" />
                        Delete
                    </DropdownMenuItem>

                </DropdownMenuContent>

            </DropdownMenu>
        </>
    )
}

export default Actions