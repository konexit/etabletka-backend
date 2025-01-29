import {
    IsNotEmpty,
    IsString,
    IsBoolean,
    IsArray
} from 'class-validator';

export class SearchEngineRefreshDto {
    @IsString()
    @IsNotEmpty()
    key: string;

    @IsString()
    @IsNotEmpty()
    index: string;
    
    primaryKey?: string;
    primaryKeys?: string[];
    lang?: string;
    fullReplace?: boolean;
}
