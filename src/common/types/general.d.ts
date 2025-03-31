declare namespace General {
    export type CDNData = {
        filename: string;
        path: string;
        url: string;
        thumbnail_filename?: string;
        thumbnail_path?: string;
        thumbnail_url?: string;
    };

    export type I18NObject<T = string | null> = {
        [key in I18NKey]?: T;
    };

    export type I18NKey = 'uk' | 'ru' | 'en';

    export type SEOObject = {
        [key in SEOKey]?: string | null;
    }

    export type SEOKey = 'seoH1' | 'seoTitle' | 'seoDescription' | 'seoText' | 'seoKeywords';

    export type Timestamps = {
        createdAt: Date;
        updatedAt: Date;
    }

    export type OneOf<T> = {
        [K in keyof T]: Required<Pick<T, K>> & Partial<Omit<T, K>>;
    }[keyof T];

    export type Pagination = {
        total: number;
        take: number;
        skip: number;
    }

    export type Page<T> = {
        items: T[];
        pagination: Pagination;
    }
}