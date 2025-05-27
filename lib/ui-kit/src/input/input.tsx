import s from './input.module.css';
import { ComponentProps, useId, forwardRef, ReactNode } from 'react';

export type InputProps = {
    /**
     * Подпись к input-элементу
     */
    label: string;
    /**
     * Сообщение об ошибке
     * @default nbsp
     */
    error?: ReactNode;
    /**
     * Описание компонента
     * @default undefined
     */
    description?: string;
} & ComponentProps<'input'>

/**
 *
 *
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(({ label, ...rest }, ref) => {
    const autoId = useId();
    return (
        <div className={s.container}>
            <label htmlFor={autoId}>{label || 'Some label'}</label>
            <input ref={ref} id={autoId} type='text' {...rest}/>
        </div>
    );
});
