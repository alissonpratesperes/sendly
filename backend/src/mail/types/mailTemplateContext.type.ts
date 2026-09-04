import { MailTemplate } from '../enums/mailTemplate.enum';

export type MailTemplateContext = {
    [MailTemplate.FIRST_ACCESS]: {
        name: string;
        url: string;
    }

    [MailTemplate.FORGOT_PASSWORD]: {
        name: string;
        url: string;
    }
}
