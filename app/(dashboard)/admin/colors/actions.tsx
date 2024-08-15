"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDeleteColor } from "@/features/colors/api/use-delete-color";
import { useOpenColor } from "@/features/colors/hooks/use-open-color";
import { useConfirm } from "@/hooks/use-confirm";
import { Edit, MoreHorizontal, Trash } from "lucide-react";

type Props = {
    id: string;
}

const Actions = ({ id }: Props) => {

    const { onOpen } = useOpenColor();
    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure",
        "You are about to delete this color"
    )
    const deleteMutation = useDeleteColor(id);

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
                        Edit
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