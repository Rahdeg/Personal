
import { insertUsersSchema } from "@/db/schema";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import CategoryForm from "./users-form";
import { currentUser } from "@clerk/nextjs/server";
import { useGetUser } from "../api/use-get-user";
import { useUpdateUser } from "../api/use-update-user";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/nextjs";

export const UpdateUser = () => {

    const { user } = useUser();

    const id = user?.publicMetadata.userId as string;

    const userQuery = useGetUser(id);
    const editMutation = useUpdateUser(id);

    const isPending = editMutation.isPending;

    const isLoading = userQuery.isLoading;

    const formSchema = insertUsersSchema.pick({
        address: true,
        phone: true,
    })

    type FormValues = z.input<typeof formSchema>;




    const onSubmit = (values: FormValues) => {
        editMutation.mutate(values);
    };


    const defaultValues = userQuery.data ? {
        address: userQuery.data.address,
        phone: userQuery.data.phone
    } : {
        address: "",
        phone: "",
    }



    return (

        <Card>

            <CardHeader>
                <CardTitle>
                    Update Profile
                </CardTitle>
                <CardDescription>
                    Edit your  profile .
                </CardDescription>
            </CardHeader>
            <CardContent>
                {
                    isLoading ? (
                        <div className=" absolute inset-0 flex items-center justify-center">
                            <Loader2 className=" size-4 text-muted-foreground animate-spin" />
                        </div>
                    ) : (<CategoryForm onSubmit={onSubmit} disabled={isPending} defaultValues={defaultValues} id={id} onDelete={() => { }} />)
                }
            </CardContent>



        </Card>


    );
};