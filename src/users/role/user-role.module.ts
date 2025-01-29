import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from './entities/role.entity';
import { RoleController } from './user-role.controller';
import { RoleService } from './user-role.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserRole])],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService, RoleModule],
})
export class RoleModule {}
