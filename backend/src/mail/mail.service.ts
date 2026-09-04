import * as path from 'path';
import * as fs from 'fs/promises';
import * as nodemailer from 'nodemailer';
import * as Handlebars from 'handlebars';
import { Injectable, OnModuleInit } from '@nestjs/common';

import { MailTemplate } from './enums/mailTemplate.enum';
import { MailTemplateContext } from './types/mailTemplateContext.type';
import { requireEnvironmentVariable } from '../../src/common/utils/requireEnvironmentVariable.util';

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
                context,
            );
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
            });
        } catch(error) {
            throw new Error("Failed to send email", { cause: error });
        }
    }

    async sendFirstAccessEmail(to: string, context: MailTemplateContext[MailTemplate.FIRST_ACCESS]): Promise<void> {
        return this.sendEmail(to, "Seja bem-vindo ao Sendly!", MailTemplate.FIRST_ACCESS, context);
    }

    async sendForgotPasswordEmail(to: string, context: MailTemplateContext[MailTemplate.FORGOT_PASSWORD]): Promise<void> {
        return this.sendEmail(to, "Redefinição de senha solicitada!", MailTemplate.FORGOT_PASSWORD, context);
    }
}
