import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
  ParseIntPipe
} from "@nestjs/common";
import { StoreService } from './store.service';
import { Store } from './entities/store.entity';
import { UpdateStoreDto } from './dto/update-store.dto';
import { ApiTags } from '@nestjs/swagger';
import { AuthGuard } from "src/auth/auth.guard";
import { OptionalJwtAuthGuard } from "src/auth/jwt/optional-jwt-auth.guard";
import { JWTPayload } from "src/common/decorators/jwt-payload";
import { JwtPayload } from "src/common/types/jwt/jwt.interfaces";
import { OptionsStoreDto } from "./dto/options-store.dto";
import { Stores } from "src/common/types/store/store";

@ApiTags('stores')
@Controller('api/v1/store')
export class StoreController {
  constructor(private readonly storeService: StoreService) { }

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async getStores(): Promise<Store[]> {
    return this.storeService.getStores();
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  async getStoresByOptions(
    @JWTPayload() jwtPayload: JwtPayload,
    @Body() optionsStoreDto: OptionsStoreDto
  ): Promise<General.Page<Store>> {
    return this.storeService.getStoresByOptions(jwtPayload, optionsStoreDto);
  }

  @Post('/ids')
  async getStoresByIds(
    @Body('ids') storeIds: Store['id'][]
  ): Promise<Store[]> {
    return this.storeService.getStoresByIds(storeIds);
  }

  @Get('coords')
  async getCoords(): Promise<Stores.Coorditates[]> {
    return this.storeService.getCoords();
  }

  @Get('ids')
  async getStoreByIds(@Body() optionsStoreDto: OptionsStoreDto): Promise<Store[]> {
    return this.storeService.getStoreByIds(optionsStoreDto.ids);
  }

  @Get('katottg/:id')
  async getStoresByKatottgId(@Param('id', ParseIntPipe) id: number): Promise<Store[]> {
    return this.storeService.getStoresByKatottgId(id);
  }

  @Get(':id')
  async getStoreById(@Param('id', ParseIntPipe) id: number): Promise<Store> {
    return this.storeService.getStoreById(id);
  }

  @UseGuards(AuthGuard)
  @Patch(':id')
  async update(
    @JWTPayload() jwtPayload: JwtPayload,
    @Param('id', ParseIntPipe) id: number,
    @Body() updateStore: UpdateStoreDto,
  ) {
    return this.storeService.update(jwtPayload, id, updateStore);
  }
}
