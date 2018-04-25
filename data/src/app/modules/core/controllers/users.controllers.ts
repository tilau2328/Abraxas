import { 
    Get, 
    Post, 
    Patch,
    Delete,
    Res, 
    Body, 
    Param,
    HttpStatus,
    Controller, 
    UseGuards,
    Req
} from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { UpdateUserDto } from '../dto/update-user.dto';
import { AuthGuard } from '../guards/auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(AuthGuard)
  async self(@Req() req, @Res() res) {
    return res.status(HttpStatus.OK).json({ user: req.user });
  }

  @Get(':id')
  @UseGuards(AuthGuard)
  async get(@Req() req, @Res() res, @Param('id') id) {
    if(req.user.id !== id) return res.status(HttpStatus.UNAUTHORIZED).send();
    let user = await this.usersService.get(id);
    if(!user) return res.status(HttpStatus.NOT_FOUND).send();
    user = user.toDto();
    return res.status(HttpStatus.OK).json(user);
  }

  @Patch(':id')
  @UseGuards(AuthGuard)
  async update(@Req() req, @Res() res, @Param('id') id, @Body() updateUserDto: UpdateUserDto) {
    if(req.user.id !== id) return res.status(HttpStatus.UNAUTHORIZED).send();
    let user = await this.usersService.update(id, updateUserDto);
    if(!user) return res.status(HttpStatus.NOT_FOUND).send();
    user = user.toDto();
    return res.status(HttpStatus.OK).json(user);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async remove(@Req() req, @Res() res, @Param('id') id) {
    if(req.user.id !== id) return res.status(HttpStatus.UNAUTHORIZED).send();
    let user = await this.usersService.remove(id);
    if(!user) return res.status(HttpStatus.NOT_FOUND).send();
    user = user.toDto();
    return res.status(HttpStatus.OK).json(user);
  }
}