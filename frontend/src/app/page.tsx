'use client';

import Header from '@moi-meow/components/common/moiHeader';
import { useNotif } from '@moi-meow/components/common/moiNotification';
import BookmarkItem from '@moi-meow/components/item/bookmarkItem';
import { BookmarkItemData } from '@moi-meow/utils/bookmark';
import useApiBaseUrl from '@moi-meow/utils/useApiBaseUrl';
import useLocalStorageState from '@moi-meow/utils/useLocalStorageState';
import { error } from 'console';
import Head from 'next/head';
import { useCallback, useEffect, useRef, useState } from 'react'

export default function Home() {
  const API_BASE_URL = useApiBaseUrl();

  const useMoiNotif = useNotif();
  const timeoutIdRef = useRef<NodeJS.Timeout>();

  const [searchQuery, setSearchQuery] = useState("");

  const [isError, setError] = useState(false);
  const [isLoading, setLoading] = useState(true);

  const [showUrl, setShowUrl] = useLocalStorageState("_showUrl", false);
  const [showDesc, setShowDesc] = useLocalStorageState("_showDesc", false);
  const [showTags, setShowTags] = useLocalStorageState("_showTags", true);
  const [showPageTitle, setShowPageTitle] = useLocalStorageState("_showPageTitle", false);

  const [data, setData] = useState<Array<BookmarkItemData>>([]);

  // ===== GET BOOKMARK DATA FETCH API =====
  const getBookmarkData = useCallback(async () => {
    if (!API_BASE_URL) return;

    try {
      setError(false);
      setLoading(true);

      const response = await fetch(`${API_BASE_URL}bookmarks?search=${searchQuery}&limit=100`);
      const jsonData = await response.json();

      setData(jsonData);
    } catch (e) {
      console.log("Server Error.");
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, API_BASE_URL])

  // ===== ON EVENT IS CHANGE UPDATE BOOKMARK =====
  const handleEventSource = useCallback(() => {
    try {
      setError(false);
      const source = new EventSource(`${API_BASE_URL}bookmarks/subscribe`);

      source.onmessage = function (event) {
        const jsonData = JSON.parse(event.data);
        if (jsonData.notification === "dataUpdated") {
          getBookmarkData();

          useMoiNotif.addNotif({
            title: "Data Updated",
            desc: jsonData.detail
          });
        }
      };
      return source;
    } catch (e) {
      console.log("Server Error.");
      setError(true);
    }
  }, [API_BASE_URL, getBookmarkData, useMoiNotif]);

  // ===== ON SEARCH CHANGE ======
  const onSearchQuery = useCallback(() => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
    }

    timeoutIdRef.current = setTimeout(() => getBookmarkData(), 300);

    return () => {
      clearTimeout(timeoutIdRef.current);
    }

  }, [getBookmarkData])

  // ===== ON INPUT SEARCH CHANGE =====
  useEffect(() => {
    onSearchQuery();
  }, [searchQuery, onSearchQuery])

  useEffect(() => {
    if (API_BASE_URL) {
      console.log("First call on mount..");
      console.log(API_BASE_URL);

      const source = handleEventSource();
      getBookmarkData();

      return () => {
        source?.close();
        console.log("Cleanup..");
      }
    }
  }, [API_BASE_URL])

  return (
    <main className="flex min-h-screen flex-col items-center gap-3 bg-gray-200 text-black">
      <Head>
        <title>Moi Meow - Web Bookmark</title>
      </Head>
      <Header setSearchQuery={setSearchQuery} searchQuery={searchQuery} />

      {
        isLoading && data.length == 0 ?
          <div className='auto-grid gap-3 py-3 px-5 md:px-10'>
            {
              [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => {
                return <div key={item} className='flex flex-col p-1 bg-white rounded-2xl'>
                  <div className='aspect-video bg-gray-300 rounded-xl animate-pulse' />
                  <div className='flex p-2 gap-3 items-center'>
                    <div className='h-5 w-5 flex-none rounded-full bg-gray-300 animate-pulse'/>
                    <div className='grow bg-gray-300 rounded-full h-4 animate-pulse' />
                  </div>
                </div>
              })
            }
          </div>
          :
          isError ?
            <div className='flex items-center justify-center py-52'>
              <p>Server Error occurred. Please try again later.</p>
            </div> :
            <div className='auto-grid gap-3 py-3 px-5 md:px-10'>
              {
                data.map((item, index) => {
                  return <BookmarkItem key={item.id ?? index} item={item} index={index} showUrl={showUrl} showDesc={showDesc} showTags={showTags} showPageTitle={showPageTitle} onRequestUpdateData={getBookmarkData} />
                })
              }
            </div>
      }

    </main>
  )
}
