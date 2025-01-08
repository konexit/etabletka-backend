import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartItem } from 'src/common/types/cart/cart.interface';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) { }

  @Post()
  createCart(): { cartId: string } {
    const cartId = this.cartService.createCart();
    return { cartId };
  }

  @Get(':cartId')
  getCart(@Param('cartId') cartId: string) {
    const cart = this.cartService.getCart(cartId);
    if (!cart) {
      return { message: 'Cart not found' };
    }
    return cart;
  }

  @Post(':cartId/items')
  addItemToCart(
    @Param('cartId') cartId: string,
    @Body() item: CartItem,
  ) {
    const updatedCart = this.cartService.addItemToCart(cartId, item);
    if (!updatedCart) {
      return { message: 'Cart not found' };
    }
    return updatedCart;
  }

  @Delete(':cartId/items/:productId')
  removeItemFromCart(
    @Param('cartId') cartId: string,
    @Param('productId') productId: string,
  ) {
    const updatedCart = this.cartService.removeItemFromCart(cartId, productId);
    if (!updatedCart) {
      return { message: 'Cart not found' };
    }
    return updatedCart;
  }
}
