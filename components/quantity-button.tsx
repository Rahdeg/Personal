import React, { useState } from 'react';
import { Button } from './ui/button';
import { Minus, Plus } from 'lucide-react';
import { Input } from './ui/input';


interface Props {
    value: number;
    setValue: React.Dispatch<React.SetStateAction<number>>;
}


const QuantityButton = ({ value, setValue }: Props) => {




    const handleIncrement = () => {
        setValue(value + 1);
    };

    const handleDecrement = () => {
        if (value === 0) {
            return;
        }
        setValue(value - 1);
    };

    return (
        <div className="flex items-center space-x-2">

            <Button onClick={handleDecrement} variant="outline">

                <Minus />
            </Button>
            <Input value={value}
                readOnly className='w-12' />
            {/* <input
                type="number"
                
                className="w-12 text-center flex items-center justify-center border border-gray-300 rounded"
            /> */}

            <Button onClick={handleIncrement} variant="outline">
                <Plus />
            </Button>

        </div>
    );
};

export default QuantityButton;
