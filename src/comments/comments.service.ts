import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from 'src/schemes/comment.schema';

@Injectable()
export class CommentsService {
    constructor(
        @InjectModel(Comment.name)
        private readonly commentsModel: Model<CommentDocument>
    ) {}

    // test
    findAll() {
        return this.commentsModel.find().exec()
    }
}
