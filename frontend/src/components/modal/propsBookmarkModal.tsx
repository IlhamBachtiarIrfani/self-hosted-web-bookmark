'use client';

import useLocalStorageState from '@moi-meow/utils/useLocalStorageState';
import React, { ChangeEvent, forwardRef, useImperativeHandle, useRef, MouseEvent } from 'react'
import MoiSwitch from '../form/moiSwitch';

interface Props {

}

export interface PropsBookmarkModalRef {
    closeDialog: () => void;
    openDialog: () => void;
}

const PropsBookmarkModal = forwardRef<PropsBookmarkModalRef, Props>((props, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    const [showUrl, setShowUrl] = useLocalStorageState("_showUrl", false);
    const [showDesc, setShowDesc] = useLocalStorageState("_showDesc", false);
    const [showTags, setShowTags] = useLocalStorageState("_showTags", true);
    const [showPageTitle, setShowPageTitle] = useLocalStorageState("_showPageTitle", false);


    const closeDialog = () => { dialogRef.current?.close() };
    const openDialog = () => { dialogRef.current?.showModal() };

    useImperativeHandle(ref, () => ({
        closeDialog,
        openDialog
    }));


    function onShowUrlInputChange(event: ChangeEvent<HTMLInputElement>) {
        setShowUrl(event.target.checked);
    }

    function onBackdropClick(event: MouseEvent<HTMLDialogElement>) {
        var rect = dialogRef.current?.getBoundingClientRect();
        if (!rect) return;

        var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height
            && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);

        if (!isInDialog) {
            dialogRef.current?.close();
        }
    }

    return (
        <dialog className='backdrop:bg-black/50 w-96 rounded-2xl p-5' ref={dialogRef} onClick={onBackdropClick}>
            <div className='flex flex-col gap-3'>
                <MoiSwitch label='Bookmark Tags' value={showTags} onChange={setShowTags} />
                <MoiSwitch label='Website URL' value={showUrl} onChange={setShowUrl} />
                <MoiSwitch label='Website Description' value={showDesc} onChange={setShowDesc} />
                <MoiSwitch label='Website Page Title' value={showPageTitle} onChange={setShowPageTitle} />
            </div>
        </dialog>
    )
});

PropsBookmarkModal.displayName = "PropsBookmarkModal";

export default PropsBookmarkModal;