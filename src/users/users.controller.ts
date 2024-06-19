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
import { UsersService } from './users.service';
import { UpdateBodyDto } from 'src/auth/index.dto';
import { Roles } from 'src/auth/roles.decorator';
import { AuthRoleGuard } from 'src/auth/auth-role.guard';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Get('get-all-users')
  @ApiOkResponse()
  @Roles(['user'])
  @UseGuards(AuthRoleGuard)
  async getAllUsers() {
    return await this.usersService.findAllUsers();
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
