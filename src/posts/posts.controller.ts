import {Body, Controller, UploadedFile, Post, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { CreatePostDto } from './dto/create-post.dto';

import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
    constructor(private postsService: PostsService) {
    }

    @ApiOperation({summary: 'Create User'})
    //@ApiResponse({status: 201, type: Post})
    @UseInterceptors(FileInterceptor('image'))
    @Post()
    create(@Body() dto: CreatePostDto, @UploadedFile() image) {
        return this.postsService.create(dto, image);
    }
}

