'use client';

import React, { useState, useContext, createContext, ReactNode, useRef } from "react";
import MarkChatUnreadRoundedIcon from '@mui/icons-material/MarkChatUnreadRounded';

interface NotifData {
    key?: string;
    title: string;
    desc: string;
}

type NotificationContextType = {
    addNotif: (data: NotifData) => void;
};

const ModalContext = createContext<NotificationContextType>({
    addNotif: (data: NotifData) => { }
});

export const useNotif = () => useContext<NotificationContextType>(ModalContext);

type MoiNotifProviderProps = {
    children: ReactNode;
};

const MoiNotifProvider = ({ children }: MoiNotifProviderProps) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [notifData, setNotifData] = useState<Array<NotifData>>([])

    const addNotif = (newData: NotifData) => {
        newData.key = new Date().getTime().toString() + newData.title;
        setNotifData((oldData) => [...oldData, newData]);

        setTimeout(() => {
            setNotifData(prevItems => prevItems.slice(1));
        }, 5000)
    };

    return (
        <ModalContext.Provider value={{ addNotif }}>
            {children}
            <div className="absolute z-50 top-16 right-0 flex flex-col gap-2 p-3 w-full max-w-sm">
                {
                    notifData.map((item, index) => {
                        return <div key={item.key ?? item.title} className="bg-white p-3 rounded-2xl shadow-xl animate-notif flex gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-200 flex items-center justify-center">
                                <MarkChatUnreadRoundedIcon className="text-indigo-500" />
                            </div>
                            <div>
                                <p className="text-lg font-bold text-indigo-500">{item.title}</p>
                                <p className="text-sm text-gray-500">{item.desc}</p>
                            </div>
                        </div>
                    })
                }
            </div>
        </ModalContext.Provider>
    );
};

export default MoiNotifProvider;
