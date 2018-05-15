import { Controller, UseGuards, HttpStatus, HttpException, Post, Req, Res, Get, Delete, Patch, Body, Param } from '@nestjs/common';
import { FoldersService } from '../services/folders.service';
import { CreateFolderDto } from '../dto/create-folder.dto';
import { UpdateFolderDto } from '../dto/update-folder.dto';
import { AuthGuard } from '../../core/guards/auth.guard';

@Controller('folders')
export class FoldersController {
    constructor(
        private readonly foldersService: FoldersService,
    ) {}

    @Get()
    @UseGuards(AuthGuard)
    async root(@Req() req: any, @Res() res: any) {
        const folder = await this.foldersService.get(req.user.id);
        return res.status(HttpStatus.OK).json(folder);
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async get(@Req() req: any, @Res() res: any, @Param('id') id: string) {
        const folder = await this.foldersService.get(req.user.id, id);
        if(!folder) return res.status(HttpStatus.NOT_FOUND).send(); 
        return res.status(HttpStatus.OK).json(folder);
    }
    
    @Post()
    @UseGuards(AuthGuard)
    async create(@Req() req: any, @Res() res: any, @Body() createFolderDto: CreateFolderDto) {
        await this.foldersService.create(req.headers.authentication, createFolderDto);
        return res.status(HttpStatus.CREATED).send();
    }

    @Patch(':id')
    @UseGuards(AuthGuard)
    async update(@Req() req: any, @Res() res: any, @Param('id') id: string, @Body() updateFolderDto: UpdateFolderDto) {
        await this.foldersService.update(req.headers.authentication, id, updateFolderDto);
        return res.status(HttpStatus.OK).send();
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async remove(@Req() req: any, @Res() res: any, @Param('id') id: string) {
        await this.foldersService.remove(req.headers.authentication, id);
        return res.status(HttpStatus.OK).send();
    }
}