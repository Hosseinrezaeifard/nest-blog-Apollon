import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailserService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendEmail(to: string, comment: string, author: string) {
    const context = `You commented on ${author}'s post: ${comment}`;
    await this.mailserService.sendMail({
      to,
      subject: 'YAAAY!! YOU JUST WROTE A COMMENT',
      text: context,
    });
  }
}
