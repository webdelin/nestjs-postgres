import {HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';
@Injectable()
export class FilesService {
    async createFile(file): Promise<string>{
        try {
            const fileName = `${file.originalname}_${new Date().toLocaleTimeString()}.jpg`;
            console.log(fileName)
            const filePath = path.resolve(__dirname, '..', 'static');
            if(!fs.existsSync(filePath)){
                fs.mkdirSync(filePath, {recursive: true});
            }
            fs.writeFileSync(path.join(filePath,fileName), file.buffer);
            return fileName;
        } catch (e) {
            throw new HttpException('Error from upload file', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
