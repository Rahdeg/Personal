import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { insertOrderSchema } from "@/db/schema";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const formSchema = insertOrderSchema.pick({
    status: true
});

type FormValues = z.input<typeof formSchema>;

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: FormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
}

const OrderForm = ({ id, defaultValues, onSubmit, onDelete, disabled }: Props) => {
    const statuses = ["Pending", "Processing", "Shipped", "Delivered", "Canceled"];

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    const handleSubmit = (values: FormValues) => {
        onSubmit(values);
    };

    const handleDelete = () => {
        onDelete?.();
    };

    const { watch } = form;
    const status = watch("status");
    const isButtonDisabled = disabled || !status;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4">
                <FormField
                    name="status"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <FormControl>
                                <Controller
                                    name="status"
                                    control={form.control}
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={(value) => field.onChange(value || undefined)}
                                            value={field.value || undefined}
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {statuses.map((status) => (
                                                    <SelectItem key={status} value={status}>
                                                        {status}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button className="w-full" disabled={isButtonDisabled}>
                    {id ? "Save changes" : ""}
                </Button>
                {id && (
                    <Button
                        type="button"
                        disabled={disabled}
                        onClick={handleDelete}
                        className="w-full flex gap-x-2"
                        variant="outline"
                    >
                        <Trash className="w-4 h-4" />
                        <p>Delete order</p>
                    </Button>
                )}
            </form>
        </Form>
    );
};

export default OrderForm;
