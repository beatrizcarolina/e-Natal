import { Module } from '@nestjs/common';
import { EbooksService } from './ebooks.service';
import { EbooksController } from './ebooks.controller';
import { EbooksRepository } from './ebooks.repository';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  controllers: [EbooksController],
  providers: [EbooksService, EbooksRepository],
})
export class EbooksModule {}
