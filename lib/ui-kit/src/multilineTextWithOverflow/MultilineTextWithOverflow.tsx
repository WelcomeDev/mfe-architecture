import s from './multilineTextWithOverflow.module.css';
import { useState, Dispatch, SetStateAction } from 'react';

interface MultilineTextWithOverflowProps {
    collapsedMaxLines?: number;
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export function MultilineTextWithOverflow(props: MultilineTextWithOverflowProps) {
    const { collapsedMaxLines = 6, isOpen, setIsOpen } = props;
    return (
        <div className={s.container}>
            <p className={s.content} style={{ '--line-clamp': isOpen ? Infinity : collapsedMaxLines }}>
                Lorem ipsum dolor sit amet, consectetur adipisicing elit. Assumenda eligendi illum necessitatibus odit
                possimus quas, suscipit? Accusamus asperiores corporis eos, et molestias rem sapiente tempora. Accusamus
                beatae debitis dolorem ex exercitationem fugiat iure! Ab ad adipisci amet animi autem beatae,
                consequatur debitis delectus dicta eius error est facere id impedit in laborum magnam magni nobis
                numquam officia perspiciatis possimus praesentium quasi quo quod quos ratione reprehenderit saepe sit
                suscipit tempora, tempore temporibus tenetur velit veniam veritatis vero? Amet doloremque nostrum nulla
                pariatur voluptate! Ab adipisci, cupiditate deserunt dolorem enim eveniet nisi, numquam possimus quos
                repellat vero voluptatum! Ducimus eum expedita laboriosam officiis possimus ullam. Consequuntur dolores
                minima nostrum optio quae quasi repellat. Dolor enim expedita fuga, modi nam placeat quis vero? Alias
                aliquid amet animi eius eligendi error esse est expedita fugiat iusto molestias nisi non, nulla odit
                quaerat quam quidem quis quisquam recusandae repellat, saepe temporibus velit voluptates. Accusamus
                adipisci amet animi aperiam aspernatur consectetur, delectus dicta dolor dolores ducimus ea esse ipsum
                libero nemo nesciunt nihil placeat quaerat reprehenderit sint sit tenetur totam voluptate. Aliquam
                aperiam autem, culpa delectus dolores earum, facere hic necessitatibus repellat reprehenderit vel, vero!
                Explicabo libero quam saepe. A accusantium alias aliquid amet aperiam autem corporis deleniti distinctio
                dolores eius facere fugit, hic illo ipsa ipsum iure maxime mollitia neque obcaecati odio odit optio
                perspiciatis porro praesentium provident quasi recusandae reiciendis rerum sapiente, sequi suscipit
                tempora vel velit! Alias autem, blanditiis dignissimos eius eos ex facilis libero, magnam modi nam
                obcaecati quam quidem quos rerum sequi temporibus voluptas. Amet, animi cum delectus dolorem, eaque ipsa
                laborum mollitia nobis nostrum, odit quod rerum sint sit soluta sunt totam unde ut. Aliquid commodi
                consectetur delectus dicta distinctio doloribus esse exercitationem in ipsum, labore libero maiores
                minus molestias, nihil nulla omnis quaerat sapiente, temporibus vel voluptates voluptatum?
            </p>
            <button onClick={() => setIsOpen(prev => !prev)}>
                Open
            </button>
        </div>
    );
}

function useMultilineAllowOverflow(collapsedMaxLines: number = 6): MultilineTextWithOverflowProps {
    const [ isOpen, setIsOpen ] = useState<boolean>(false);

    return {
        isOpen,
        setIsOpen,
        collapsedMaxLines: isOpen ? Infinity : collapsedMaxLines,
    }
}
