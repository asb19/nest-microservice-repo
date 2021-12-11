import { Post } from '.prisma/client';
import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { response } from 'express';
import { map } from 'rxjs/operators';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PostsService {
  public constructor(
    private readonly prismaService: PrismaService,
    private readonly httpService: HttpService,
    @Inject('POSTS_SERVICE') private readonly client: ClientProxy,
  ) {}

  public async createPost(title: string): Promise<Post> {
    const post = await this.prismaService.post.create({
      data: {
        title: title,
      },
    });
    return post;
  }

  public async getPosts(): Promise<Post[]> {
    const post = await this.prismaService.post.findMany({});
    return post;
  }

  public async getPost(id: number): Promise<any> {
    const post = await this.prismaService.post.findUnique({
      where: {
        id,
      },
    });
    // const comments = await this.httpService
    //   .get(`http://localhost:3001/comment/${id}/comments`)
    //   .toPromise()
    //   .then((data) => data.data)
    //   .catch((err) => console.log(err));
    const comments = await this.client
      .send(
        {
          cmd: 'get-comment',
          get: 'comments',
        },
        { id },
      )
      .pipe()
      .toPromise();
    console.log(comments);
    return { ...post, comments: comments || [] };
  }
}
