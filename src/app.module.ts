import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { EbooksModule } from './ebooks/ebooks.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from '@nestjs/schedule';
import { EbookEmailScheduler } from './schedulers/ebook-email-scheduler';

@Module({
  imports: [PrismaModule, EbooksModule, UsersModule, AuthModule, ScheduleModule.forRoot()],
  controllers: [AppController],
  providers: [AppService,EbookEmailScheduler],
})
export class AppModule {}
