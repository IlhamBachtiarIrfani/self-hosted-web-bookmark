'use client';

import useLocalStorageState from '@moi-meow/utils/useLocalStorageState';
import React from 'react'
import MoiSwitch from '../form/moiSwitch';

export default function PropsBookmarkModal() {
    const [showUrl, setShowUrl] = useLocalStorageState("_showUrl", false);
    const [showDesc, setShowDesc] = useLocalStorageState("_showDesc", false);
    const [showTags, setShowTags] = useLocalStorageState("_showTags", true);
    const [showPageTitle, setShowPageTitle] = useLocalStorageState("_showPageTitle", false);

    return <div className='w-screen max-w-sm flex flex-col gap-3'>
        <MoiSwitch label='Bookmark Tags' value={showTags} onChange={setShowTags} />
        <MoiSwitch label='Website URL' value={showUrl} onChange={setShowUrl} />
        <MoiSwitch label='Website Description' value={showDesc} onChange={setShowDesc} />
        <MoiSwitch label='Website Page Title' value={showPageTitle} onChange={setShowPageTitle} />
    </div>;
}