export interface Credentials {
    login: string;
    password: string;
    user_type: string;
}

export interface TokenResponse {
    token_type: string;
    access_token: string;
    expires_in: string;
}