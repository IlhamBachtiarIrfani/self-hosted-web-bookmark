import { BookmarkItemData, BookmarkTagItemData } from '@moi-meow/utils/bookmark';
import Image from 'next/image';
import React, { MouseEvent } from 'react'

import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import CachedRoundedIcon from '@mui/icons-material/CachedRounded';
import { useModal } from '../common/moiModal';
import MoiButton from '../form/moiButton';
import useApiBaseUrl from '@moi-meow/utils/useApiBaseUrl';

interface BookmarkItemProps {
    item: BookmarkItemData;
    index: number;
    showUrl: boolean;
    showDesc: boolean;
    showTags: boolean;
    showPageTitle: boolean;
    onRequestUpdateData: () => void;
}

export default function BookmarkItem(props: BookmarkItemProps) {
    const API_BASE_URL = useApiBaseUrl();

    const useMoiModal = useModal();
    const getThumbnailComponent = () => {
        if (props.item.thumbnail && props.item.screenshot) {
            return <BookmarkItemCompletePreview thumbnail={props.item.thumbnail} screenshot={props.item.screenshot} />
        } else if (props.item.thumbnail != null || props.item.screenshot != null) {
            return <BookmarkItemPreview thumbnail={props.item.thumbnail! ?? props.item.screenshot!} />
        } else {
            return <div className='bg-gray-200 w-full h-full flex items-center justify-center'>No Image</div>
        }
    }

    async function requestDeleteBookmark() {
        useMoiModal.hideModal();

        const response = await fetch(`${API_BASE_URL}bookmarks/${props.item.id}`, {
            method: "DELETE"
        });

        console.log(response);

        props.onRequestUpdateData();
    }

    async function onRefreshClick(e: MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        e.preventDefault();

        const response = await fetch(`${API_BASE_URL}bookmarks/${props.item.id}/refresh`, {
            method: "POST"
        });

        console.log(response);

        props.onRequestUpdateData();
    }

    function onDeleteClick(e: MouseEvent<HTMLButtonElement>) {
        e.stopPropagation();
        e.preventDefault();

        useMoiModal.showModal(<div className='flex flex-col gap-3'>
            <p className='text-lg'>Are you sure to delete this bookmark?</p>

            <div className='flex justify-end gap-3'>
                <MoiButton label='Cancel' onClick={useMoiModal.hideModal} />
                <MoiButton label='Delete' onClick={requestDeleteBookmark} />
            </div>
        </div>);
    }

    return (
        <a href={props.item.url ?? "#"} target='_blank' key={props.item.id ?? props.index} className={`group w-full flex flex-col bg-white rounded-2xl p-1 hover:scale-110 focus:scale-110 hover:-rotate-2 focus:-rotate-2 hover:z-10 focus:z-10 hover:shadow-2xl focus:shadow-2xl outline-none border-none transition-all duration-300`}>
            <div className='aspect-video rounded-xl overflow-hidden relative'>
                <button onClick={onDeleteClick} className='absolute top-2 right-2 p-2 bg-red-700/60 backdrop-blur-sm hover:bg-red-500 hover:scale-110 z-10 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100' tabIndex={-1}>
                    <DeleteOutlineRoundedIcon fontSize="small" className="text-white" />
                </button>

                <button onClick={onRefreshClick} className='absolute top-2 right-12 p-2 bg-gray-950/40 backdrop-blur-sm hover:bg-indigo-500 hover:scale-110 z-10 rounded-full flex items-center justify-center transition-all duration-300 opacity-0 group-hover:opacity-100' tabIndex={-1}>
                    <CachedRoundedIcon fontSize="small" className="text-white" />
                </button>

                <div className='w-full h-full rounded-xl overflow-hidden'>
                    {getThumbnailComponent()}
                </div>
            </div>

            <div className='p-2 flex flex-col gap-1'>
                <div className='flex gap-2 items-center'>
                    <div className='aspect-square w-5 p-0.5 flex-none'>
                        {
                            props.item.favicon ?
                                <Image alt='favicon' src={props.item.favicon} width={128} height={128} />
                                :
                                <div className='w-full h-full rounded-full bg-gray-200' />
                        }
                    </div>
                    <p className='font-medium line-clamp-1'>{props.showPageTitle && props.item.pageTitle ? props.item.pageTitle : props.item.title}</p>
                </div>

                {props.showUrl && <p className='text-xs text-indigo-500 line-clamp-1 break-all'>{props.item.url}</p>}

                {props.showDesc && <p className='text-xs text-gray-400 line-clamp-2'>{props.item.description}</p>}


                {props.showTags && <div className='flex flex-wrap gap-1'>
                    {
                        props.item.tags.map((tagData: BookmarkTagItemData) => {
                            return <p key={tagData.id} className='text-xs bg-indigo-100 text-indigo-600 px-2 py-1 rounded-md'>{tagData.name}</p>
                        })
                    }
                </div>}

            </div>
        </a>
    )
}

interface BookmarkItemCompletePreviewProps {
    thumbnail: string;
    screenshot: string;
}

function BookmarkItemCompletePreview(props: BookmarkItemCompletePreviewProps) {
    return <>
        <picture>
            <img alt='thumbnail' src={props.thumbnail} className='w-full h-full object-cover group-hover:scale-105 group-hover:blur-sm group-focus:scale-105 group-focus:blur-sm group-hover:opacity-0 group-focus:opacity-0 transition-all duration-700' />
        </picture>

        <div className='absolute inset-0'>
            <picture>
                <img alt='screenshot' src={props.screenshot} className='object-cover scale-95 opacity-0 group-hover:scale-100 group-focus:scale-100 group-hover:opacity-100 group-focus:opacity-100 blur-sm group-hover:blur-none group-focus:blur-none transition-all duration-700 rounded-xl overflow-hidden' />
            </picture>
        </div>
    </>
}

interface BookmarkItemPreviewProps {
    thumbnail: string;
}

function BookmarkItemPreview(props: BookmarkItemPreviewProps) {
    return <Image alt='thumbnail' src={props.thumbnail} className='w-full h-full object-cover' width={1280} height={720} priority />;
}