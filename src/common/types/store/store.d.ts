import { Store } from "src/store/entities/store.entity";

declare namespace Stores {
    export type Pharmacy = {
        id: number;
        katottgId: number;
        syncId: number;
        companyId: number;
        lat: string;
        lng: string;
        name: string;
        slug: string;
        cdnData: General.CDNData | null;
        workTime: string;
        workSchedule: string;
        contacts: string;
        address: string;
        isActive: boolean;
        isOnline: boolean;
        isWHSOrder: boolean;
        Company: Companies.Company;
    } & General.Timestamps;

    export type Coorditates = Pick<Store, 'id' | 'lat' | 'lng'> & {
        icon: string;
    };
}