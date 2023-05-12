import React from 'react'

interface MoiButtonProps {
    onClick?: () => void;
    label: string;
}

export default function MoiButton(props: MoiButtonProps) {
    return (
        <button onClick={props?.onClick} className='bg-indigo-500 text-white
         rounded-md px-3 py-2 focus:outline-none focus:border-none hover:ring-4 focus:ring-4 ring-indigo-500/40 transition-all'>{props.label}</button>
    )
}
