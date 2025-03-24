import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Query,
  UseGuards,
  ParseIntPipe
} from "@nestjs/common";
import { KatottgService } from './katottg.service';
import { ApiTags } from '@nestjs/swagger';
import { UpdateKatottgDto } from './dto/update-katottg.dto';
import { OptionalJwtAuthGuard } from "src/auth/jwt/optional-jwt-auth.guard";
import { JWTPayload } from "src/common/decorators/jwt-payload";
import { JwtPayload } from "src/common/types/jwt/jwt.interfaces";
import { Katottg } from "./entities/katottg.entity";

@ApiTags('katottg')
@Controller('api/v1/katottg')
export class KatottgController {
  constructor(private readonly katottgService: KatottgService) { }

  @UseGuards(OptionalJwtAuthGuard)
  @Patch()
  async update(
    @JWTPayload() jwtPayload: JwtPayload,
    @Body() updateKatottg: UpdateKatottgDto,
  ) {
    return this.katottgService.update(jwtPayload, updateKatottg);
  }

  @Get('city/:id')
  async getCityById(@Param('id', ParseIntPipe) id: number): Promise<Katottg> {
    return this.katottgService.getCityById(id);
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('cities')
  async findAll(@JWTPayload() jwtPayload: JwtPayload): Promise<any> {
    return this.katottgService.getCities(jwtPayload);
  }

  @Get('default-city')
  async getDefaultCity(): Promise<Katottg> {
    return this.katottgService.getDefaultCity();
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('cities/stores')
  async getCitiesWithStores(
    @JWTPayload() jwtPayload: JwtPayload,
    @Query('pagination') pagination?: any,
    @Query('orderBy') orderBy?: any,
  ): Promise<Katottg[]> {
    return this.katottgService.getCitiesWithStores(jwtPayload, pagination, orderBy);
  }
}
