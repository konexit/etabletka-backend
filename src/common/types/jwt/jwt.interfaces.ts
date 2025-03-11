export interface JwtResponse {
	access_token: string;
	token_type: string;
	expires_in: string;
}

export interface JwtCartResponse extends JwtResponse {
	cartId: number;
}

export interface JwtCheckoutResponse extends JwtResponse {
	cartId: number;
	aggregatorOrderId: number;
	tradeOrderId: number | null;
	bookingDate: string;
}

export interface JwtPayload {
	rmbMe: boolean;
	userId?: number;
	roles?: string[];
	carts?: number[];
	exp?: number;
	iat?: number;
}