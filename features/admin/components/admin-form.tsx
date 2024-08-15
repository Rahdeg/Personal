import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertAdminSchema } from "@/db/schema";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

const formSchema = insertAdminSchema.pick({
    name: true,
    email: true
});

type FormValues = z.input<typeof formSchema>;

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: FormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
}

const AdminForm = ({ id, defaultValues, onSubmit, onDelete, disabled }: Props) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    const { watch } = form;
    const name = watch("name");
    const email = watch("email");
    const isButtonDisabled = disabled || !name || !email;

    const handleSubmit = (values: FormValues) => {
        onSubmit(values);
    };

    const handleDelete = () => {
        onDelete?.();
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
                <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Name
                            </FormLabel>
                            <FormControl>
                                <Input disabled={disabled} placeholder="user" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    name="email"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Email
                            </FormLabel>
                            <FormControl>
                                <Input disabled={disabled} placeholder="don@gmail.com" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button className="w-full" disabled={isButtonDisabled}>
                    {id ? "Save changes" : "Add Admin"}
                </Button>
                {id && (
                    <Button type="button" disabled={disabled} onClick={handleDelete} className="w-full flex gap-x-2" variant="outline">
                        <Trash className="w-4 h-4" />
                        <p>Delete admin</p>
                    </Button>
                )}
            </form>
        </Form>
    );
}

export default AdminForm;
