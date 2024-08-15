"use client";

import { toast } from "sonner";
import { useTransition } from "react";

import { Switch } from "@/components/ui/switch";
// import { updateStream } from "@/actions/stream";
import { Skeleton } from "@/components/ui/skeleton";
import { useToggleAdmin } from "@/features/admin/api/use-toggle-admin";
import { Button } from "@/components/ui/button";
import { Delete, Edit } from "lucide-react";
import { useOpenAdmin } from "@/features/admin/hooks/use-open-admin";
import { useGetAdmin } from "@/features/admin/api/use-get-admin";
import { useDeleteAdmin } from "@/features/admin/api/use-delete-admin";
import { useConfirm } from "@/hooks/use-confirm";

// type FieldTypes = "isEnabled" | "isChatDelayed" | "isChatFollowersOnly";

interface ToggleCardProps {
    label: string;
    value: boolean;
    username: string;
    id: string;
    // field: FieldTypes;
};

export const ToggleCard = ({
    label,
    value = false,
    username,
    id
}: ToggleCardProps) => {

    const editMutation = useToggleAdmin(id);

    const { onOpen } = useOpenAdmin();

    const deleteMutation = useDeleteAdmin(id);


    const isPending = editMutation.isPending || deleteMutation.isPending;

    const onChange = (newValue: boolean) => {
        // console.log([newValue]);
        editMutation.mutate({ isAdmin: newValue });
    };

    const [ConfirmDialog, confirm] = useConfirm(
        "Are you sure",
        "You are about to delete this  admin"
    )


    const handleDelete = async () => {
        const ok = await confirm();

        if (ok) {
            deleteMutation.mutate();
        }
    }


    return (
        <>
            <ConfirmDialog />
            <div className="rounded-xl bg-muted p-6">
                <div className="flex items-center justify-between">
                    <p className="font-semibold shrink-0">
                        {username}
                    </p>
                    <div className="space-y-2 flex items-center justify-center gap-x-2">
                        <Switch
                            disabled={isPending}
                            onCheckedChange={onChange}
                            checked={value}
                        >
                            {value ? "On" : "Off"}
                        </Switch>
                        <Button variant="outline" className=" bg-blue-600" onClick={() => onOpen(id)}>
                            <Edit className=" text-white" />
                        </Button>
                        <Button variant="outline" className=" bg-red-400" onClick={handleDelete}>
                            <Delete />
                        </Button>
                    </div>
                </div>
            </div>
        </>

    );
};

export const ToggleCardSkeleton = () => {
    return (
        <Skeleton className="rounded-xl p-10 w-full" />
    );
};
