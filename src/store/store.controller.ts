import {
  HttpException,
  HttpStatus,
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards
} from "@nestjs/common";
import { StoreService } from './store.service';
import { Store } from './entities/store.entity';
import { Request } from 'express';
import { UpdateStoreDto } from './dto/update-store.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from "src/auth/auth.guard";
import { OptionalJwtAuthGuard } from "src/auth/jwt/optional-jwt-auth.guard";
import { JWTPayload } from "src/common/decorators/jwt-payload";
import { JwtPayload } from "src/common/types/jwt/jwt.interfaces";
import { OptionsStoreDto } from "./dto/options-store.dto";

@ApiTags('stores')
@Controller('api/v1/store')
export class StoreController {
  constructor(private readonly storeService: StoreService) { }

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  async getStoresByOptions(
    @JWTPayload() jwtPayload: JwtPayload,
    @Body() optionsStoreDto: OptionsStoreDto
  ): Promise<Store[]> {
    return this.storeService.getStoresByOptions(jwtPayload, optionsStoreDto);
  }

  @UseGuards(AuthGuard)
  @Patch('store/:id')
  async update(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updateStore: UpdateStoreDto,
  ) {
    try {
      if (updateStore.name && typeof updateStore.name === 'string') {
        try {
          updateStore.name = JSON.parse(updateStore.name);
        } catch (error) {
          throw new HttpException(
            'Invalid JSON format in "name" property',
            HttpStatus.BAD_REQUEST,
          );
        }
      }
      const token = request.headers.authorization?.split(' ')[1] ?? '';

      return await this.storeService.update(token, +id, updateStore);
    } catch (error) {
      throw error;
    }
  }

  @Get('/store/:id')
  async getStoreById(
    @Req() request: Request,
    @Param('id') id: number,
  ): Promise<Store> {
    const token = request.headers.authorization?.split(' ')[1] ?? '';
    return await this.storeService.getStoreById(token, +id);
  }

  @Get('/stores/city/:cityId')
  async getStoresByCityId(@Param('cityId') cityId: number): Promise<Store[]> {
    return await this.storeService.getStoresByCityId(cityId);
  }
}
