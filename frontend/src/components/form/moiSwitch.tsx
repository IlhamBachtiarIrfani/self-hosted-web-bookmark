import React, { ChangeEvent } from 'react'

export interface MoiSwitchProps {
    label: string;
    value?: boolean;
    onChange?: (value: boolean) => void;
}

export default function MoiSwitch(props: MoiSwitchProps) {
    function onInputChange(event: ChangeEvent<HTMLInputElement>) {
        if (props.onChange) {
            props.onChange(event.target.checked);
        }
    }

    return (
        <label className="relative flex justify-between items-center cursor-pointer">
            <span className="font-medium text-gray-900">{props.label}</span>


            <input type="checkbox" checked={props.value} onChange={onInputChange} className='sr-only peer' />

            <div className="relative w-10 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-indigo-500/40 peer-checked:after:translate-x-4 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all  peer-checked:bg-indigo-600"></div>

        </label>
    )
}
