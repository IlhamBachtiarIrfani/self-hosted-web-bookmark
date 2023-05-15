'use client';

import React, { useState, useContext, createContext, ReactNode, useRef, MouseEvent } from "react";

type ModalContextType = {
    showModal: (content: ReactNode) => void;
    hideModal: () => void;
};

const ModalContext = createContext<ModalContextType>({
    showModal: () => { },
    hideModal: () => { },
});

export const useModal = () => useContext<ModalContextType>(ModalContext);

type MoiModalProviderProps = {
    children: ReactNode;
};

const MoiModalProvider = ({ children }: MoiModalProviderProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [modalContent, setModalContent] = useState<ReactNode | null>(null);

    const showModal = (content: ReactNode) => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        setModalContent(content);

        dialog.showModal()
        dialog.classList.add("show")
    };

    const hideModal = () => {
        const dialog = dialogRef.current;
        if (!dialog) return;

        dialog.classList.remove("show");
        dialog.classList.add("hide");
        setTimeout(() => {
            dialog.close()
            dialog.classList.remove("hide");
            setModalContent(null);
        }, 300);
    };

    function onBackdropClick(event: MouseEvent<HTMLDialogElement>) {
        var rect = dialogRef.current?.getBoundingClientRect();
        if (!rect) return;

        var isInDialog = (rect.top <= event.clientY && event.clientY <= rect.top + rect.height
            && rect.left <= event.clientX && event.clientX <= rect.left + rect.width);

        if (!isInDialog) {
            hideModal();
        }
    }

    return (
        <ModalContext.Provider value={{ showModal, hideModal }}>
            {children}
            <dialog className='backdrop:bg-black/50 p-5 rounded-2xl w-full max-w-fit' ref={dialogRef} onClick={onBackdropClick} onCancel={(e) => {
                e.preventDefault();
                hideModal();
            }}>
                {modalContent}
            </dialog>
        </ModalContext.Provider>
    );
};

export default MoiModalProvider;
