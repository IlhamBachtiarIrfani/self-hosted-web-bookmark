'use client';

import React, { useState, useContext, createContext, ReactNode, useRef, MouseEvent } from "react";
import MoiButton from "../form/moiButton";

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
        setModalContent(content);
        dialogRef.current?.showModal();
    };

    const hideModal = () => {
        dialogRef.current?.close();
        setModalContent(null);
    };

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
        <ModalContext.Provider value={{ showModal, hideModal }}>
            {children}
            <dialog className='backdrop:bg-black/50 w-96 rounded-2xl p-5' ref={dialogRef} onClick={onBackdropClick}>
                <div className="bg-white p-3 rounded-xl">
                    {modalContent}
                </div>
            </dialog>
        </ModalContext.Provider>
    );
};

export default MoiModalProvider;
