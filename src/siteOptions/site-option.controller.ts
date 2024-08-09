import { Body, Controller, Get, Param, Patch, Post, Req } from '@nestjs/common';
import { SiteOptionService } from './site-option.service';
import { SiteOption } from './entities/site-option.entity';
import { ApiTags } from '@nestjs/swagger';
import { Request } from 'express';
import { UpdateCharacteristic } from './dto/update-characteristic.dto';
import { CreateCharacteristic } from './dto/create-characteristic.dto';

@ApiTags('site-options')
@Controller('api/v1')
export class SiteOptionController {
  constructor(private readonly siteOptionService: SiteOptionService) {}

  @Post('/site-option/create')
  async create(@Req() request: Request,) {}

  @Patch('/site-option/update/:id')
  async update(@Req() request: Request, @Param('id') id: number) {}

  @Post('/characteristic/create')
  async characteristicCreate(
    @Req() request: Request,
    @Body() createCharacteristic: CreateCharacteristic,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    return await this.siteOptionService.characteristicCreate(
      token,
      createCharacteristic,
    );
  }

  @Patch('/characteristic/update/:key')
  async characteristicUpdate(
    @Req() request: Request,
    @Param('key') key: string,
    @Body() updateCharacteristic: UpdateCharacteristic,
  ) {
    const token = request.headers.authorization?.split(' ')[1] ?? [];
    console.log('updateCharacteristic', updateCharacteristic);
    return await this.siteOptionService.characteristicUpdate(
      token,
      key,
      updateCharacteristic,
    );
  }

  @Get('/site-options')
  async getActiveSiteOptions(): Promise<SiteOption[]> {
    return await this.siteOptionService.getActiveSiteOptions();
  }

  @Get('/site-option/:id')
  async getSiteOptionById(@Param('id') id: number) {
    return await this.siteOptionService.getSiteOptionById(+id);
  }

  @Get('/site-option/key/:key')
  async getSiteOptionByKey(
    @Param('key') key: string = 'product_attributes_map',
  ) {
    return await this.siteOptionService.getSiteOptionByKey(key);
  }
}
