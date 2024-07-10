import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { SellTypeService } from './sell-type.service';
import { CreateSellTypeDto } from './dto/create-sell-type.dto';
import { SellType } from './entities/sell-type.entity';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { UpdateSellTypeDto } from './dto/update-sell-type.dto';

@Controller('api/v1')
export class SellTypeController {
  constructor(private readonly sellTypeService: SellTypeService) {}

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/sell-type/create')
  async create(
    @Req() request: Request,
    @Body() createSellType: CreateSellTypeDto,
  ): Promise<SellType> {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    return await this.sellTypeService.create(token, createSellType);
  }

  @UseGuards(AuthGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('/sell-type/update/:id')
  async Update(
    @Req() request: Request,
    @Param('id') id: number,
    @Body() updateSellType: UpdateSellTypeDto,
  ): Promise<SellType> {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    return await this.sellTypeService.update(token, id, updateSellType);
  }

  @UseGuards(AuthGuard)
  @Delete('/user/delete/:id')
  async remove(@Req() request: Request, @Param('id') id: number) {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    await this.sellTypeService.remove(token, id);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/sell-types')
  async getAllSellTypes(): Promise<SellType[]> {
    return await this.sellTypeService.getAllSellTypes();
  }
}
