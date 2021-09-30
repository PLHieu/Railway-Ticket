import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './cart.entity';

export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
  ) {}

  async createCart({ id, user, price, status }) {
    const cart = await this.cartRepository.create({
      id,
      user,
      price,
      status,
    });
    return this.cartRepository.save(cart);
  }
}
