import { Controller, UseGuards, HttpStatus, HttpException, Post, Req, Res, Get } from '@nestjs/common';
import { AuthGuard } from '../../core/guards/auth.guard';
import { FilesService } from '../services/files.service';

@Controller('files')
export class FilesController {
    constructor(
        private readonly filesService: FilesService,
    ) {}

    @Post()
    @UseGuards(AuthGuard)
    async upload(@Req() req: any, @Res() res: any) {
        const files: any = req.files;
        console.log("Files, ", files);
        return res.status(HttpStatus.OK).json();
    }
}