"use client"

import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDeleteProduct } from "@/features/products/api/use-delete-product";
import { useConfirm } from "@/hooks/use-confirm";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
    id: string;
}

const Actions = ({ id }: Props) => {


    const router = useRouter();

    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure",
        "You are about to delete this product"
    )
    const deleteMutation = useDeleteProduct(id);

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
                    <DropdownMenuItem disabled={deleteMutation.isPending} onClick={() => router.push(`/admin/products/${id}`)}>
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