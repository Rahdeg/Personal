import React, { useState } from 'react';
import { z } from 'zod';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { insertProductSchema } from '@/db/schema';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import Select from '@/components/select';
import AmountInput from '@/components/amount-input';
import ImageUpload from '@/components/ui/image-upload';
import SelectableButtonForm from '@/components/select-button';
import { getMatchingIds } from '@/lib/utils';


const formSchema = z.object({
    colors: z.string().array(),
    isFeatured: z.boolean(),
    isArchived: z.boolean(),
    name: z.string(),
    costPrice: z.string(),
    sellingPrice: z.string(),
    quantity: z.string(), // Ensure price is a number
    images: z.object({ url: z.string() }).array().nonempty(),
    sizes: z.string().array(),
    categoryId: z.string(),
});



export interface ProductInitialData {
    name?: string;
    categoryId?: string;
    costPrice?: string;
    sellingPrice?: string;
    quantity?: string;
    isFeatured?: boolean;
    isArchived?: boolean;
    colors?: string[];
    sizes?: string[];
    images?: { url: string }[];
}


const apiSchema = insertProductSchema.omit({
    id: true,
});

type FormValues = z.infer<typeof formSchema>;

type Props = {
    id?: string;
    initialData: any;
    onSubmit: (values: FormValues) => void;
    onDelete?: () => void;
    disabled?: boolean;
    categoryOptions?: { label: string; value: string }[];
    onCreateCategory?: (name: string) => void;
    colorOptions?: { label: string; value: string }[];
    sizeOptions?: { label: string; value: string }[];
};

const ProductForm: React.FC<Props> = ({
    id,
    initialData,
    onSubmit,
    onDelete,
    disabled,
    categoryOptions,
    onCreateCategory,
    colorOptions,

    sizeOptions,

}) => {



    const form = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? {
            ...initialData,
        } : {
            name: '',
            images: [],
            costPrice: '',
            sellingPrice: "",
            quantity: "",
            categoryId: '',
            colors: [],
            sizes: [],
            isFeatured: false,
            isArchived: false
        }
    });

    const action = initialData ? "Save changes" : "Create"


    const { watch } = form;
    const name = watch('name');
    const isButtonDisabled = disabled || !name

    const [selectedSizes, setSelectedSizes] = useState<string[]>(initialData?.sizes || []);
    const [selectedColors, setSelectedColors] = useState<string[]>(initialData?.colors || []);


    const handleSubmit = (values: FormValues) => {

        const colorIds = getMatchingIds(selectedColors, colorOptions!);
        const sizeIds = getMatchingIds(selectedSizes, sizeOptions!)


        onSubmit({ ...values, colors: colorIds, sizes: sizeIds, });

    };

    return (
        <Form {...form} >
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 pt-4 w-full">
                <FormField
                    name="images"
                    control={form.control}
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Images</FormLabel>
                            <FormControl>
                                <ImageUpload
                                    value={field.value.map((image) => image.url)}
                                    disable={disabled}
                                    onChange={(url) => field.onChange([...field.value, { url }])}
                                    onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className=' grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-4 w-full'>
                    <FormField
                        name="name"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input disabled={disabled} placeholder="palm" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="quantity"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Quantity</FormLabel>
                                <FormControl>
                                    <Input disabled={disabled} placeholder="1" {...field} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="categoryId"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>
                                    Category
                                </FormLabel>
                                <FormControl>
                                    <Select
                                        placeholder="Select a category"
                                        options={categoryOptions}
                                        onChange={field.onChange}
                                        onCreate={onCreateCategory}
                                        value={field.value}
                                        disabled={disabled}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="colors"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Colors</FormLabel>
                                <FormControl>
                                    <SelectableButtonForm
                                        values={colorOptions!}
                                        selectedOptions={selectedColors}
                                        setSelectedOptions={setSelectedColors}
                                        color

                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        name="sizes"
                        control={form.control}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Size</FormLabel>
                                <FormControl>
                                    <SelectableButtonForm
                                        values={sizeOptions!}
                                        selectedOptions={selectedSizes}
                                        setSelectedOptions={setSelectedSizes}
                                    />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name='costPrice'
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

                    <FormField
                        control={form.control}
                        name='sellingPrice'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel> Selling Price</FormLabel>
                                <AmountInput
                                    {...field}
                                    disabled={disabled}
                                    placeholder="0.00"

                                />
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Category Selection */}


                    <FormField
                        control={form.control}
                        name="isFeatured"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none ml-2">
                                    <FormLabel>Featured</FormLabel>
                                    <FormDescription>This product will appear on the home page</FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="isArchived"
                        render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                                <FormControl>
                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                                </FormControl>
                                <div className="space-y-1 leading-none ml-2">
                                    <FormLabel>Archived</FormLabel>
                                    <FormDescription>This product will not appear anywhere in the store.</FormDescription>
                                </div>
                            </FormItem>
                        )}
                    />
                </div>

                <div className=' flex items-center justify-center w-full'>
                    <Button size="lg" className="w-full" disabled={isButtonDisabled}>
                        {action}
                    </Button>
                </div>

            </form>
        </Form>
    );
};

export default ProductForm;
