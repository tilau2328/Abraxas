import { Controller, UseGuards, HttpStatus, HttpException, Post, Req, Res, Get, Delete, Patch, Body, Param } from '@nestjs/common';
import { AuthGuard } from '../../core/guards/auth.guard';
import { FilesService } from '../services/files.service';
import { UpdateFileDto } from '../dto/update-file.dto';

@Controller('files')
export class FilesController {
    constructor(
        private readonly filesService: FilesService,
    ) {}

    @Get(':id')
    @UseGuards(AuthGuard)
    async get(@Req() req: any, @Res() res: any, @Param('id') id: string) {
        const file = await this.filesService.get(req.user.id, id);
        if(!file) return res.status(HttpStatus.NOT_FOUND).send(); 
        return res.status(HttpStatus.OK).json(file.toDto());
    }

    @Patch(':id')
    @UseGuards(AuthGuard)
    async update(@Req() req: any, @Res() res: any, @Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
        await this.filesService.update(req.headers.authentication, id, updateFileDto);
        return res.status(HttpStatus.OK).send();
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async remove(@Req() req: any, @Res() res: any, @Param('id') id: string) {
        await this.filesService.remove(req.headers.authentication, id);
        return res.status(HttpStatus.OK).send();
    }
}