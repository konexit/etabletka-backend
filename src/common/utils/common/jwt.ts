import {
	JWT_EXPIRES_IN,
	JWT_REMEMBER_ME_EXPIRES_IN,
	JWT_CART_EXPIRES_IN
} from "src/auth/auth.constants"

export const getJwtExpiresInEnv = (remember = false, isCart = false): string => {
	return remember ? JWT_REMEMBER_ME_EXPIRES_IN : isCart ? JWT_CART_EXPIRES_IN : JWT_EXPIRES_IN;
}
