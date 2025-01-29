export interface JwtResponse {
    access_token: string;
    token_type: string;
    expires_in: string;
}

export interface JwtPayload {
    userId: number;
    roleId: number;
}