import { useRef } from 'react';
import { InputProps, Input } from '../input/input';

export type DateInputProps = {
    /**
     * Маска
     */
    mask?: string
} & InputProps;

export function Datepicker({ label, ...rest }: DateInputProps) {
    const dateInputRef = useRef<HTMLInputElement>(null);

    const openRealInput = () => {

    };

    const closeRealInput = () => {

    };

    return (
        <div>
            <input type='date' ref={dateInputRef} />
            <Input label={label} {...rest} onFocus={openRealInput} onBlur={closeRealInput}/>
        </div>
    );
}
