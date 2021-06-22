import { PostStatusEnum } from "../../enums/post-status.enum"

export class ResponsePostDto {
    _id: string
    title: string
    content: string
    user: string
    status: PostStatusEnum
    ctegories: string[]
    createdAt: string
    updatedAt: string
    rating: number
}