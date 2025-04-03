export interface CDNResponse {
	status: number;
	timestamp: number;
}

export interface CDNFile {
	filename: string;
	url: string;
}

export interface CDNUploadResponse extends CDNResponse {
	files: CDNFile[];
}

export interface ICDNUploadOptions {
	path?: string;
	input?: string;

	getQueryParams(): string;
}
