import { Middleware, NestMiddleware } from '@nestjs/common';
import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';

@Middleware()
export class FilesMiddleware implements NestMiddleware {
    resolve(field: string, count?: number): (req: any, res: any, next) => void {
        var storage = multer.diskStorage({
            destination: function (req, file, cb) {
                if(!req.user) return cb('Sorry sir, I need to see your ID!');
                const upload_path = `/uploads/${req.user.id}`;
                const full_path = path.join(__dirname,"/../../../../..", upload_path);
                if (!fs.existsSync(full_path)){
                    fs.mkdirSync(full_path);
                }
                return cb(null, full_path);
            },
            filename: function (req, file, cb) {
                cb(null, file.originalname)
            }
        });

        const upload = multer({ storage });
        return upload.array(field, count);
    }
}