import { Injectable } from '@nestjs/common';
import { Cart, CartItem } from 'src/common/types/cart/cart.interface';

import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CartService {
  private carts: Map<string, Cart> = new Map();

  createCart(): string {
    const cartId = uuidv4();
    this.carts.set(cartId, { id: cartId, items: [], total: 0 });
    return cartId;
  }

  getCart(cartId: string): Cart | undefined {
    return this.carts.get(cartId);
  }

  addItemToCart(cartId: string, item: CartItem): Cart | undefined {
    const cart = this.carts.get(cartId);
    if (!cart) return undefined;

    const existingItem = cart.items.find((i) => i.productId === item.productId);

    if (existingItem) {
      existingItem.quantity += item.quantity;
    } else {
      cart.items.push(item);
    }

    cart.total = this.calculateTotal(cart.items);
    return cart;
  }

  removeItemFromCart(cartId: string, productId: string): Cart | undefined {
    const cart = this.carts.get(cartId);
    if (!cart) return undefined;

    cart.items = cart.items.filter((item) => item.productId !== productId);
    cart.total = this.calculateTotal(cart.items);
    return cart;
  }

  private calculateTotal(items: CartItem[]): number {
    return items.reduce((total, item) => total + item.quantity * item.price, 0);
  }
}
