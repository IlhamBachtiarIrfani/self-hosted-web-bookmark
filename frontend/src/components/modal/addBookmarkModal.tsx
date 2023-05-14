'use client';

import useApiBaseUrl from '@moi-meow/utils/useApiBaseUrl';
import useBaseUrl from '@moi-meow/utils/useBaseUrl';
import React, { ChangeEvent, FormEvent, forwardRef, useImperativeHandle, useRef, useState, MouseEvent } from 'react'

interface AddBookmarkModalProps {
    onAddBookmarkComplete?: () => void;
}

export interface AddBookmarkModalRef {
    closeDialog: () => void;
    openDialog: () => void;
}

const AddBookmarkModal = forwardRef<AddBookmarkModalRef, AddBookmarkModalProps>((props, ref) => {
    const API_BASE_URL = useApiBaseUrl();

    const dialogRef = useRef<HTMLDialogElement>(null);

    const [titleInput, setTitleInput] = useState("")
    const [urlInput, setUrlInput] = useState("")
    const [tagsInput, setTagsInput] = useState("")

    const closeDialog = () => {
        dialogRef.current?.classList.remove("show");

        setTimeout(() => {
            dialogRef.current?.close();
        }, 300);
    };
    const openDialog = () => {
        dialogRef.current?.showModal();
        dialogRef.current?.classList.add("show");
    };

    useImperativeHandle(ref, () => ({
        closeDialog,
        openDialog
    }));

    function onTitleInputChange(event: ChangeEvent<HTMLInputElement>) {
        setTitleInput(event.target.value);
    }

    function onUrlInputChange(event: ChangeEvent<HTMLInputElement>) {
        setUrlInput(event.target.value);
    }

    function onTagsInputChange(event: ChangeEvent<HTMLInputElement>) {
        setTagsInput(event.target.value);
    }


    async function onCreateSubmit(event: FormEvent) {
        event.preventDefault();

        if (!titleInput || !urlInput) {
            return;
        }

        closeDialog();

        const formData = new FormData();
        formData.append("title", titleInput);
        formData.append("url", urlInput);

        if (tagsInput.toString() !== "") {
            tagsInput.toString().split(",").forEach(tag => {
                formData.append("tags[]", tag.trim());
            });
        }

        setTitleInput("");
        setUrlInput("");
        setTagsInput("");

        console.log("Inserting data");

        const response = await fetch(`${API_BASE_URL}bookmarks`, {
            method: "POST",
            body: formData
        })

        const responseJSON = await response.json();

        console.log("insert: " + responseJSON.toString());

        if (props.onAddBookmarkComplete) props.onAddBookmarkComplete()
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
            <form onSubmit={onCreateSubmit} className='flex flex-col gap-3'>
                <p>New Bookmark</p>

                <input type='text' placeholder='Bookmark Title' className='h-10 w-full rounded-md bg-gray-100 px-3 focus:outline-none focus:ring-2 ring-indigo-500' onChange={onTitleInputChange} value={titleInput} />

                <input type='url' placeholder='Website Url' className='h-10 w-full rounded-md bg-gray-100 px-3 focus:outline-none focus:ring-2 ring-indigo-500' onChange={onUrlInputChange} value={urlInput} />

                <input type='text' placeholder='Tags A, Tags B, Tags C' className='h-10 w-full rounded-md bg-gray-100 px-3 focus:outline-none focus:ring-2 ring-indigo-500' onChange={onTagsInputChange} value={tagsInput} />

                <div className='flex w-full justify-end gap-3'>
                    <button className='border-indigo-500 border text-indigo-500 hover:bg-indigo-500 hover:text-white rounded-md px-3 py-2  focus:outline-0 hover:ring-4 focus:ring-4 ring-indigo-500/50 transition-all  ' onClick={closeDialog} type='button' >Cancel</button>

                    <button className='bg-indigo-500 text-white rounded-md px-3 py-2 focus:outline-0 hover:ring-4 focus:ring-4 ring-indigo-500/50 transition-all' type='submit'>Submit</button>
                </div>
            </form>
        </dialog>
    )
});

AddBookmarkModal.displayName = "AddBookmarkModal";

export default AddBookmarkModal;
