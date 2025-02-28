declare namespace Pharmacies {
    export type Pharmacy = { 
        id: number;
        cityId: number;
        syncId: number;
        lat: string;
        lng: string;
        name: string;
        slug: string;
        cdnData: General.CDNData | null;
        workTime: string;
        contacts: string;
        address: string;
        isActive: boolean;
        isOnline: boolean;
        city: Locations.City;
        storeBrand: PharmacyBrand;
    } & General.Timestamps;

    export type PharmacyBrand = {
        id: number;
        name: string;
        cdnData: General.CDNData | null;
    } & General.Timestamps;
}