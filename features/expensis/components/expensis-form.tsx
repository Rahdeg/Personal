import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertExpensisSchema } from "@/db/schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import AmountInput from "@/components/amount-input";

// const formSchema = insertExpensisSchema.pick({
//     name: true,
//     amount: true
// });

const formSchema = z.object({
    name: z.string(),
    amount: z.string(),
});


type FormValues = z.input<typeof formSchema>;

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: FormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
}

const ExpensisForm = ({ id, defaultValues, onSubmit, onDelete, disabled }: Props) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    const { watch } = form;
    const name = watch("name");
    const value = watch("amount");
    const isButtonDisabled = disabled || !name || !value;

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
                                <Input disabled={disabled} placeholder="transportation" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name='amount'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cost Price</FormLabel>
                            <AmountInput
                                {...field}
                                disabled={disabled}
                                placeholder="0.00"

                            />
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button className="w-full" disabled={isButtonDisabled}>
                    {id ? "Save changes" : "Create expensis"}
                </Button>
                {id && (
                    <Button type="button" disabled={disabled} onClick={handleDelete} className="w-full flex gap-x-2" variant="outline">
                        <Trash className="w-4 h-4" />
                        <p>Delete expensis</p>
                    </Button>
                )}
            </form>
        </Form>
    );
}

export default ExpensisForm;
