declare namespace Companies {
    export type Company = {
        id: number;
        syncId: number;
        name: string;
        edrpou: string;
        cdnData: General.CDNData | null;
        phone: string | null;
        address: string | null;
    } & General.Timestamps;
}