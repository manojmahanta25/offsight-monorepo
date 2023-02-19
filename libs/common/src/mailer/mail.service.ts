import { Injectable } from "@nestjs/common";
import { MailerService } from '@nestjs-modules/mailer';
import { join } from "path";

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  async generalMail(): Promise<void> {
    this.mailerService.sendMail({
        to: 'amansuper@yopmail.com', // List of receivers email address
        from: 'user@outlook.com', // Senders email address
        subject: 'Testing Nest MailerModule ✔', // Subject line
        text: 'welcome', // plaintext body
        html: '<b>welcome</b>', // HTML body content
      })
      .then((success) => {
        console.log(success)
      })
      .catch((err) => {
        console.log(err)
      });
  }

  public mailWithTemplate(): void {
    this
      .mailerService
      .sendMail({
        to: 'amansuper@yopmail.com', // List of receivers email address
        from: 'user@outlook.com', // Senders email address
        subject: 'Testing Nest Mailermodule with template ✔',
        template: 'index', // The `.pug` or `.hbs` extension is appended automatically.
        context: {  // Data to be sent to template engine.
          code: 'cf1a3f828287',
          username: 'john doe',
        },
      })
      .then((success) => {
        console.log(success)
      })
      .catch((err) => {
        console.log(err)
      });
  }

  public mailWithAttachment(): void {
    this.mailerService
      .sendMail({
        to: 'amansuper@yopmail.com',
        from: 'noreply@nestjs.com',
        subject: 'Testing Nest Mailermodule with template ✔',
        template: 'index', // The `.pug` or `.hbs` extension is appended automatically.
        context: {  // Data to be sent to template engine.
          code: 'cf1a3f828287',
          username: 'john doe',
        },
        attachments:[{
          path: join(process.cwd(),'static','attachment','images.jpeg'),
          filename:'images.webp',
          contentDisposition:"attachment"
        }]
      })
      .then((success) => {
        console.log(success)
      })
      .catch((err) => {
        console.log(err)
      });
  }

  async sendEmail(to:string,from:string,subject:string,template:string,payload:object,...attachment):Promise<any> {
      if(attachment.length > 0){
        return await this.mailerService.sendMail({
          to: to,
          from: from,
          subject: subject,
          template: template,
          context: payload,
          attachments:attachment
        })
      }else{
        return await this.mailerService.sendMail({
          to: to,
          from: from,
          subject: subject,
          template: template,
          context: payload,
        })
      }
  }


}