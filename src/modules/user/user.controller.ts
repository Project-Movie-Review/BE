import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtGuard } from '../auth/guard/jwt-auth.guard';
import { FilterUserDto } from './dto/filter-user.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtGuard)
  async getProfile(@Req() req: any) {
    const userId = req.user.id;
    return await this.userService.findById(userId);
  }

  @Get('profile/:id')
  async getUserById(@Param('id') id: number) {
    return await this.userService.findById(id);
  }

  @Get('all')
  async getAllUsers(@Query() dto: FilterUserDto) {
    return await this.userService.findAll(dto);
  }

  @Put('update')
  @UseGuards(JwtGuard)
  async updateUser(@Body() updateData: UpdateUserDto, @Req() req: any) {
    const userId = req.user.id;
    return await this.userService.updateUser(userId, updateData);
  }

  @Delete('delete/:id')
  @UseGuards(JwtGuard)
  async deleteUser(@Param('id') id: number) {
    return await this.userService.deleteUser(id);
  }
}
