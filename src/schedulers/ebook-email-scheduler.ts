import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as nodemailer from 'nodemailer';
import * as process from "process";
import { EbooksRepository } from 'src/ebooks/ebooks.repository';
import { UsersRepository } from 'src/users/users.repository';

@Injectable()
export class EbookEmailScheduler {

  constructor (
    private readonly ebooksRepository: EbooksRepository,
    private readonly usersRepository: UsersRepository) { }


  private transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  private async sendEmail(email: string, username: string, ebookTitle: string, ebookBuffer: Buffer) {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Special Gift from Mr. Santa Klaus - Your Dream Ebook',
      text: `Dear ${username},\n\n
      Greetings and festive wishes! This is Mr. Santa Klaus reaching out to add an extra touch of joy to your holiday season.\n
      While perusing through your wishlist, I noticed that the ebook titled "${ebookTitle}" has caught your eye. As part of the holiday magic, I am delighted to inform you that your desired gift is ready for your enjoyment.\n
      To make it easy for you to dive into your special present, here is your special ebook.\n 
      I hope the contents of this book bring delight and knowledge to your day. Wishing you a Christmas filled with joyful moments.\n\n
      Merry Chistmas!
      Mr. Santa Klaus`,
      attachments: [
        {
          filename: `${ebookTitle}.pdf`,
          content: ebookBuffer,
          encoding: 'base64',
        },
      ],
    };

    await this.transporter.sendMail(mailOptions);
  }

  @Cron('0 0 0 25 12 *')
  //@Cron('0 * * * * *')
  async sendEbookEmails() {

    const usersWithEbooks = await this.usersRepository.findAllWithEbooks();

    for (const user of usersWithEbooks) {"[Ebook Title]"
      for(const ebookid of user.ebooks)
      {
        const ebook = await this.ebooksRepository.findOne(ebookid.ebookId);
        const ebook_pdf = Buffer.from(ebook.pdf, 'base64');
        try {
          await this.sendEmail(user.email, user.name, ebook.title, ebook_pdf);
        } catch (error) {
          console.error('Error sending email to ${user.email}:', error);
        }
      }
    }
  }
}