import * as path from 'path';
import * as fs from 'fs/promises';
import * as nodemailer from 'nodemailer';
import * as Handlebars from 'handlebars';
import { Injectable, OnModuleInit } from '@nestjs/common';

import { MailSubject } from './enums/mailSubject.enum';
import { MailTemplate } from './enums/mailTemplate.enum';
import { MailTemplateContext } from './types/mailTemplateContext.type';
import { requireEnvironmentVariable } from '../common/utils/requireEnvironmentVariable.util';

@Injectable()
export class MailService implements OnModuleInit {
    private transporter!: nodemailer.Transporter;

    async onModuleInit(): Promise<void> {
        const port = Number(requireEnvironmentVariable("SMTP_PORT"));

        this.transporter = nodemailer.createTransport({
            host: requireEnvironmentVariable("SMTP_HOST"),
            port,
            secure: port === 465,

            auth: {
                user: requireEnvironmentVariable("SMTP_USER"),
                pass: requireEnvironmentVariable("SMTP_PASS"),
            },
        });

        await this.transporter.verify();
    }

    private async renderTemplate<T extends MailTemplate>(template: T, context: MailTemplateContext[T]): Promise<string> {
        try {
            return Handlebars.compile(await fs.readFile(path.join(__dirname, "layouts", `${template}.hbs`), "utf-8"))(context);
        } catch (error) {
            throw new Error("Failed to render e-mail template", { cause: error });
        }
    }

    private async sendEmail<T extends MailTemplate>(to: string, subject: string, template: T, context: MailTemplateContext[T]): Promise<void> {
        const html = await this.renderTemplate(template, context);

        try {
            await this.transporter.sendMail({
                from: requireEnvironmentVariable("SMTP_FROM"),
                to,
                subject,
                html,

                attachments: [{
                    cid: "logo_sendly",
                    filename: "logo.png",
                    path: path.join(__dirname, "assets", "logo.png"),
                }],
            });
        } catch(error) {
            throw new Error("Failed to send email", { cause: error });
        }
    }

    async sendFirstAccessEmail(to: string, context: MailTemplateContext[MailTemplate.FIRST_ACCESS]): Promise<void> {
        return this.sendEmail(to, MailSubject.FIRST_ACCESS, MailTemplate.FIRST_ACCESS, context);
    }

    async sendForgotPasswordEmail(to: string, context: MailTemplateContext[MailTemplate.FORGOT_PASSWORD]): Promise<void> {
        return this.sendEmail(to, MailSubject.FORGOT_PASSWORD, MailTemplate.FORGOT_PASSWORD, context);
    }

    async sendSystemRootEmail(to: string, context: MailTemplateContext[MailTemplate.SYSTEM_ROOT]): Promise<void> {
        return this.sendEmail(to, MailSubject.SYSTEM_ROOT, MailTemplate.SYSTEM_ROOT, context);
    }
}
