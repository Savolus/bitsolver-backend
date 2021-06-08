import { Controller, Get } from '@nestjs/common';
import { CommentsService } from './comments.service';

@Controller('api/comments')
export class CommentsController {
    constructor(
        private readonly commentsService: CommentsService
    ) {}

    // test
    @Get()
    findAll() {
        return this.commentsService.findAll()
    }
}
