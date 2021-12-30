import {Injectable} from "@nestjs/common";
import {MailerService} from '@nestjs-modules/mailer';

@Injectable()
export class UsersEmailService {
    constructor(private readonly mailerService: MailerService) {}
    async sendActivateEmail(to: string, link: string) {
        this.mailerService
            .sendMail({
                to,
                from: 'mailer@webdelin.de',
                subject: 'activate link ✔ ' +  process.env.HOST_URL,
                //text: 'welcome', // plaintext body
                html: `
                <h1>Aktivate account for ${process.env.HOST_URL}</h1>
                <p><a href="http://localhost:333/auth/activate/${link}">http://localhost:333/auth/activate/${link}</a></p> 
                `, // HTML body content
            })
            .then(success => {
                console.log(success);
            })
            .catch(err => {
                console.log(err);
            });
    }
}
