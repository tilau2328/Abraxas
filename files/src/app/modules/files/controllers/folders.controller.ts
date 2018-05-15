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

    @Post()
    @UseGuards(AuthGuard)
    async create(@Req() req: any, @Res() res: any, @Body() createFolderDto: CreateFolderDto) {
        const folder = await this.foldersService.create(req.user.id, createFolderDto);
        return res.status(HttpStatus.CREATED).json(folder.toDto());
    }

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

    @Patch(':id')
    @UseGuards(AuthGuard)
    async update(@Req() req: any, @Res() res: any, @Param('id') id: string, @Body() updateFolderDto: UpdateFolderDto) {
        const folder = await this.foldersService.update(req.user.id, id, updateFolderDto);
        if(!folder) return res.status(HttpStatus.NOT_FOUND).send();
        return res.status(HttpStatus.OK).json(folder.toDto());
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async remove(@Req() req: any, @Res() res: any, @Param('id') id: string) {
        const folder = await this.foldersService.remove(req.user.id, id);
        if(!folder) return res.status(HttpStatus.NOT_FOUND).send();
        return res.status(HttpStatus.OK).json(folder.toDto());
    }
}