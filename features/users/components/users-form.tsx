import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { insertUsersSchema } from "@/db/schema";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";

const formSchema = insertUsersSchema.pick({
    address: true,
    phone: true,
})

type FormValues = z.input<typeof formSchema>;

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: FormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
}

const UsersForm = ({ id, defaultValues, onSubmit, onDelete, disabled }: Props) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    })

    const handleSubmit = (values: FormValues) => {
        onSubmit(values)
    };



    const { watch } = form;
    const address = watch("address");
    const phone = watch("phone");
    const isButtonDisabled = disabled || !address || !phone


    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className=" space-y-4 pt-4">
                <FormField
                    name="address"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Address
                            </FormLabel>
                            <FormControl>
                                <Input disabled={disabled} placeholder="e.g. Nigeria" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    name="phone"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Phone Number
                            </FormLabel>
                            <FormControl>
                                <Input disabled={disabled} placeholder="e.g. 08065335637" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button className=" w-full" disabled={isButtonDisabled}>
                    {id ? "Save changes " : "Create category"}
                </Button>
            </form>
        </Form>
    )
}

export default UsersForm