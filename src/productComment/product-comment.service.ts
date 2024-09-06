import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductComment } from './entities/product-comment.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { CreateProductComment } from './dto/create-product-comment.dto';
import { UpdateProductComment } from './dto/update-product-comment.dto';
import { WsGateway } from '../ws/ws.gateway';
import { PaginationDto } from '../common/dto/paginationDto';

@Injectable()
export class ProductCommentService {
  constructor(
    @InjectRepository(ProductComment)
    private readonly productCommentRepository: Repository<ProductComment>,
    private readonly wsGateway: WsGateway,
    private jwtService: JwtService,
  ) {}

  async create(token: string, createProductComment: CreateProductComment) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }
    const comment = this.productCommentRepository.create(createProductComment);
    if (!comment) {
      throw new HttpException(
        `Can't create comment to product with data: ${createProductComment}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    const result: ProductComment =
      await this.productCommentRepository.save(comment);
    this.wsGateway.handleEmit({ event: 'new_product_comment', data: result });
    return result;
  }

  async update(
    token: string,
    id: number,
    updateProductComment: UpdateProductComment,
  ) {
    if (!token || typeof token !== 'string') {
      throw new HttpException('You have not permissions', HttpStatus.FORBIDDEN);
    }

    // TODO: only admin can approve comments
    const payload = await this.jwtService.decode(token);
    if (payload?.roleId !== 1) {
      updateProductComment.isApproved = false;
    }

    await this.productCommentRepository.update(id, updateProductComment);

    const comment = await this.productCommentRepository.findOne({
      where: { id },
    });

    if (!comment) {
      throw new HttpException(
        `Can't update comment for product with data: ${updateProductComment}`,
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!comment.isApproved && payload?.roleId !== 1) {
      this.wsGateway.handleEmit({
        event: 'update_product_comment',
        data: comment,
      });
    }

    return comment;
  }

  async getComments(
    pagination: PaginationDto = {},
    where: any = {},
    lang: string = 'uk',
  ) {
    const { take = 15, skip = 0 } = pagination;

    const queryBuilder =
      this.productCommentRepository.createQueryBuilder('productComment');
    const total = await queryBuilder.getCount();

    queryBuilder
      .select('productComment')
      .addSelect('product.name')
      .addSelect('author.id')
      .addSelect('author.firstName')
      .addSelect('author.lastName')
      .leftJoin('productComment.author', 'author')
      .leftJoin('productComment.product', 'product')
      .orderBy('productComment.createdAt', 'DESC')
      .take(take)
      .skip(skip)
      .where('productComment.id is not null');

    /** Where statements **/
    if (where) {
      if (where?.approved) {
        queryBuilder.andWhere('blogComment.isApproved = :isApproved', {
          isApproved: where.approved,
        });
      }
    }

    const comments = await queryBuilder.getMany();
    if (comments) {
      for (const comment of comments) {
        comment.product.name = comment.product.name[lang];
      }
    }

    return {
      comments,
      pagination: { total, take, skip },
    };
  }

  async getProductComments(productId: number, token: string) {
    if (token || typeof token === 'string') {
      const payload = await this.jwtService.decode(token);
      // TODO: get all for Admin
      if (payload.roleId === 1) {
        return await this.productCommentRepository.find({
          where: { productId },
          relations: ['author', 'product'],
        });
      }
    }

    const comments = await this.productCommentRepository.find({
      where: { productId, isApproved: true },
      relations: ['author', 'product'],
    });

    if (!comments) {
      throw new HttpException(
        'Comments for product not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return comments;
  }

  async getProductCommentById(id: number) {
    const comment = await this.productCommentRepository.findOne({
      where: { id, isApproved: true },
      relations: ['author', 'product'],
    });

    if (!comment) {
      throw new HttpException(
        'Comment for product not found',
        HttpStatus.NOT_FOUND,
      );
    }

    return comment;
  }
}
