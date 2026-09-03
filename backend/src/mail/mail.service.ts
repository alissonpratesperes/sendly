import * as path from 'path';
import * as fs from 'fs/promises';
import * as Handlebars from 'handlebars';
import * as nodemailer from 'nodemailer';
import { Injectable, OnModuleInit } from '@nestjs/common';

import { MailTemplate } from './enums/mailTemplate.enum';
import { MailTemplateContext } from './types/mailTemplateContext.type';

@Injectable()
export class MailService implements OnModuleInit {
    private transporter!: nodemailer.Transporter;

    async onModuleInit(): Promise<void> {
        const testAccount = await nodemailer.createTestAccount();

        this.transporter = nodemailer.createTransport({
            host: testAccount.smtp.host,
            port: testAccount.smtp.port,
            secure: testAccount.smtp.secure,
            auth: {
                user: testAccount.user,
                pass: testAccount.pass,
            },
        });
    }

    private async renderTemplate<T extends MailTemplate>(template: T, context: MailTemplateContext[T]): Promise<string> {
        try {
            return Handlebars.compile(
                await fs.readFile(
                    path.join(
                        __dirname,
                        "templates",
                        `${template}.hbs`,
                    ),
                    "utf-8",
                )
            )(
                context
            );
        } catch (error) {
            throw new Error(`Failed to render e-mail template`, { cause: error });
        }
    }

    private async sendEmail<T extends MailTemplate>(to: string, subject: string, template: T, context: MailTemplateContext[T]): Promise<void> {
        const html = await this.renderTemplate(template, context);

        try {
            await this.transporter.sendMail({
                from: "'Thesle' <no-reply@thesle.com.br>", //TODO: move to .env and load here
                to,
                subject,
                html ,
            });
        } catch(error) {
            throw new Error(`Failed to send email`, { cause: error });
        }
    }

    async sendFirstAccessEmail(to: string, subject: string, context: MailTemplateContext[MailTemplate.FIRST_ACCESS]) {}

    async sendForgotPasswordEmail(to: string, subject: string, context: MailTemplateContext[MailTemplate.FORGOT_PASSWORD]) {}

    async sendResetPasswordEmail(to: string, subject: string, context: MailTemplateContext[MailTemplate.RESET_PASSWORD]) {}
}
