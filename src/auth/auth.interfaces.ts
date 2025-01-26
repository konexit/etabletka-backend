export interface JWTResponse {
    access_token: string;
    token_type: string;
    expires_in: string;
}

export interface JWTPayload {
    userId: number;
    roleId: number;
}