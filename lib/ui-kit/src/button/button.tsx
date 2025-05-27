import s from './button.module.css';
import { ComponentProps } from 'react';

export type ButtonProps = ComponentProps<'button'>

export function Button({ children, className, ...rest }: ButtonProps) {
    return (
        <button className={`${s.container} ${className}`} {...rest}>
            Hello {children}
        </button>
    );
}
