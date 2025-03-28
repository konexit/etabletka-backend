import {
  Controller,
  Get,
} from "@nestjs/common";
import { CompanyService } from './company.service';
import { ApiTags } from '@nestjs/swagger';
import { Company } from "./entities/company.entity";

@ApiTags('companies')
@Controller('api/v1/company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) { }

  @Get()
  async getAllCompanies(): Promise<Company[]> {
    return await this.companyService.getAllStoreBrands();
  }
}
