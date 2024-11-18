import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { ConfigModule } from '@nestjs/config'; // Import ConfigModule

@Module({
  imports: [ConfigModule],  
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
