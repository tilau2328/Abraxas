import { Controller, UseGuards, HttpStatus, HttpException, Post, Req, Res, Get, Delete, Patch, Body, Param } from '@nestjs/common';
import { AuthGuard } from '../../core/guards/auth.guard';
import { FilesService } from '../services/files.service';
import { UpdateFileDto } from '../dto/update-file.dto';

@Controller('files')
export class FilesController {
    constructor(
        private readonly filesService: FilesService,
    ) {}

    @Post()
    @UseGuards(AuthGuard)
    async upload(@Req() req: any, @Res() res: any, @Body() data) {
        const files: any = req.files;
        const { directory } = data;
        if(!files || !files.length) return res.status(HttpStatus.EXPECTATION_FAILED).send();
        const result = files.map((file) => this.filesService.create(req.user.id, file, directory));
        return res.status(HttpStatus.CREATED).json(result);
    }

    @Get(':id/download')
    @UseGuards(AuthGuard)
    async download(@Req() req: any, @Res() res: any, @Param('id') id: string) {
        const file = await this.filesService.get(req.user.id, id);
        if(!file) return res.status(HttpStatus.NOT_FOUND).send(); 
        return res.status(HttpStatus.OK).download(file.path);
    }

    @Get()
    @UseGuards(AuthGuard)
    async list(@Req() req: any, @Res() res: any) {
        const files = await this.filesService.list(req.user.id);
        if(!files || !files.length) return res.status(HttpStatus.NOT_FOUND).send(); 
        return res.status(HttpStatus.OK).json(files.map((file) => file.toDto()));
    }

    @Get(':id')
    @UseGuards(AuthGuard)
    async get(@Req() req: any, @Res() res: any, @Param('id') id: string) {
        const file = await this.filesService.get(req.user.id, id);
        if(!file) return res.status(HttpStatus.NOT_FOUND).send(); 
        return res.status(HttpStatus.OK).json(file);
    }

    @Patch(':id')
    @UseGuards(AuthGuard)
    async update(@Req() req: any, @Res() res: any, @Param('id') id: string, @Body() updateFileDto: UpdateFileDto) {
        const file = await this.filesService.update(req.user.id, id, updateFileDto);
        if(!file) return res.status(HttpStatus.NOT_FOUND).send();
        return res.status(HttpStatus.OK).json(file.toDto());
    }

    @Delete(':id')
    @UseGuards(AuthGuard)
    async remove(@Req() req: any, @Res() res: any, @Param('id') id: string) {
        const file = await this.filesService.remove(req.user.id, id);
        if(!file) return res.status(HttpStatus.NOT_FOUND).send();
        return res.status(HttpStatus.OK).json(file.toDto());
    }
}