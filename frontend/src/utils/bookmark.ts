export interface BookmarkTagItemData {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}

export interface BookmarkItemData  {
    id: string;
    title: string;
    url: string;
    pageTitle: string | null;
    thumbnail: string | null;
    screenshot: string | null;
    favicon: string | null;
    description: string | null;
    locale: string | null;
    tags: Array<BookmarkTagItemData>;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}