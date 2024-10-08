import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { UsersService } from '../services/users.service';
import { Roles } from '../../../libs/auth/decorators/roles.decorator';
import { AuthGuard } from '../../../libs/auth/guards/authToken.guard';
import { AuthRoleGuard } from '../../../libs/auth/guards/auth-role.guard';
import { UpdateBodyDto } from '../../../modules/auth/index.dto';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('get-all-users')
  @ApiOkResponse()
  @Roles(['user'])
  @UseGuards(AuthGuard, AuthRoleGuard)
  async getAllUsers() {
    return await this.usersService.findAllUsers();
  }

  @Get('get-user-with-relation')
  findRelationUser() {
    return this.usersService.findRelationUser();
  }

  @Patch('update-user/:id')
  @ApiOkResponse()
  async updateUser(
    @Body() body: UpdateBodyDto,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return await this.usersService.updateUser(id, body);
  }

  @Delete('delete-user/:id')
  @ApiOkResponse()
  async deleteUser(@Param('id', ParseIntPipe) id: number) {
    return await this.usersService.deleteUser(id);
  }
}
