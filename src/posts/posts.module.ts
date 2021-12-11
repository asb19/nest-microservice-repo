import { Module } from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { HttpModule } from '@nestjs/axios';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';

@Module({
  providers: [
    PostsService,
    {
      provide: 'POSTS_SERVICE',
      useFactory: () => {
        const user = 'admin';
        const password = 'admin';
        const host = 'localhost:5672';
        const queueName = 'TEST_MESSAGE';

        return ClientProxyFactory.create({
          transport: Transport.RMQ,
          options: {
            urls: [`amqp://${user}:${password}@${host}`],
            queue: queueName,
            queueOptions: {
              durable: true,
            },
          },
        });
      },
    },
  ],
  controllers: [PostsController],
  imports: [PrismaModule, HttpModule],
})
export class PostsModule {}
