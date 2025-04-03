export interface CDNResponse {
	status: number;
	timestamp: number;
}

export interface CDNFile {
	filename: string;
	url: string;
}

export interface CDNSearchItem {
	name: string;
	type: string;
	size: number;
	mtime: string;
	url: string;
}

export interface CDNListItem {
	name: string;
	type: string;
	size: number;
	list: CDNSearchItem[];
}

export interface CDNUploadResponse extends CDNResponse {
	files: CDNFile[];
}

export interface CDNSearchResponse extends CDNResponse {
	search_string: string;
	list: CDNSearchItem[];
}

export interface CDNListResponse extends CDNResponse {
	search_string: string;
	total_space: number;
	free_space: number;
	list: CDNListItem[];
}

export interface ICDNUploadOptions {
	path?: string;
	input?: string;

	getQueryParams(): string;
}
