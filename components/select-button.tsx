'use client'
import React from 'react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { useNewColor } from '@/features/colors/hooks/use-new-color';
import { useNewSize } from '@/features/sizes/hooks/use-new-size';

type Option = {
    label: string;
    value: string;
};

type SelectableButtonFormProps = {
    color?: boolean;
    values: Option[];
    selectedOptions: string[];
    setSelectedOptions: React.Dispatch<React.SetStateAction<string[]>>;
};

const SelectableButtonForm: React.FC<SelectableButtonFormProps> = ({ values, selectedOptions, setSelectedOptions, color }) => {


    const toggleValue = (value: string) => {
        setSelectedOptions((prevSelectedOptions) =>
            prevSelectedOptions.includes(value)
                ? prevSelectedOptions.filter((v) => v !== value)
                : [...prevSelectedOptions, value]
        );
    };

    const newColor = useNewColor();
    const newSize = useNewSize();


    const onClick = () => {
        if (color) {
            newColor.onOpen();
        } else {
            newSize.onOpen();
        }
    }

    return (
        <div className='flex space-x-3'>
            {!color && values.map((option) => (
                <Button
                    type="button"
                    key={option.value}
                    className={cn('bg-slate-400', selectedOptions.includes(option.label) && "bg-blue-600")}
                    onClick={() => toggleValue(option.label)}
                >
                    {option.label}
                </Button>
            ))}
            {color && values.map((option) => (
                <Button
                    type="button"
                    variant="outline"
                    key={option.value}
                    className={cn(' rounded-full w-10 h-10', selectedOptions.includes(option.label) && " border-2 border-black")}
                    style={{ backgroundColor: option.label }}
                    onClick={() => toggleValue(option.label)}
                >

                </Button>
            ))}

            <Button className='' variant="outline" onClick={onClick} type='button'>
                <Plus />
            </Button>
        </div>
    );
};

export default SelectableButtonForm;


// `category-button ${selectedOptions.includes(value) ? 'selected' : ''}