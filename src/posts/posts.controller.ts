import { Post as post, Prisma } from '.prisma/client';
import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  public constructor(
    private postservice: PostsService,
    @Inject('POSTS_SERVICE') private readonly client: ClientProxy,
  ) {}

  @Post('/create')
  public async CreatePost(@Body() body: Prisma.PostCreateInput): Promise<post> {
    const data = await this.postservice.createPost(body.title);
    return data;
  }

  @Get('/')
  public async GetPosts(): Promise<post[]> {
    const data = await this.postservice.getPosts();
    return data;
  }

  @Get('/:id')
  public async GetPost(@Param('id') id: string): Promise<post[]> {
    const data = await this.postservice.getPost(parseInt(id));
    return data;
  }

  @Delete('/:id')
  public async DeletePost(@Param('id') id: string): Promise<any> {
    // const data = await this.postservice.getPost(parseInt(id));
    await this.client.emit('delete-post', { id: parseInt(id) });
    return {};
  }
}
