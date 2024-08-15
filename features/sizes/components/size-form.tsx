import { z } from "zod";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { insertSizeSchema } from "@/db/schema";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";

const formSchema = insertSizeSchema.pick({
    name: true,
    value: true
});

type FormValues = z.input<typeof formSchema>;

type Props = {
    id?: string;
    defaultValues?: FormValues;
    onSubmit: (values: FormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
}

const SizeForm = ({ id, defaultValues, onSubmit, onDelete, disabled }: Props) => {

    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: defaultValues,
    });

    const { watch } = form;
    const name = watch("name");
    const value = watch("value");
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
                                <Input disabled={disabled} placeholder="e.g. 6, 7, 8" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    name="value"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Value
                            </FormLabel>
                            <FormControl>
                                <Input disabled={disabled} placeholder="e.g. 40, 41, 42" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button className="w-full" disabled={isButtonDisabled}>
                    {id ? "Save changes" : "Create size"}
                </Button>
                {id && (
                    <Button type="button" disabled={disabled} onClick={handleDelete} className="w-full flex gap-x-2" variant="outline">
                        <Trash className="w-4 h-4" />
                        <p>Delete size</p>
                    </Button>
                )}
            </form>
        </Form>
    );
}

export default SizeForm;
