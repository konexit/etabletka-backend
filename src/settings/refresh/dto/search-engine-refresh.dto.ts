import {
    IsNotEmpty,
    IsString,
    IsBoolean,
    IsOptional,
    IsArray
} from 'class-validator';

export class SearchEngineRefreshDto {
    @IsString()
    @IsNotEmpty()
    key: string;

    @IsString()
    @IsNotEmpty()
    index: string;
    
    @IsOptional()
    @IsString()
    primaryKey?: string;

    @IsOptional()
    @IsArray()
    @IsString({ each: true })
    primaryKeys?: string[];

    @IsOptional()
    @IsString()
    lang?: string;

    @IsOptional()
    @IsBoolean()
    fullReplace?: boolean;
}
