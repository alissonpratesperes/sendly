import { MailTemplate } from '../enums/mailTemplate.enum';

export type MailTemplateContext = {
    [MailTemplate.FIRST_ACCESS]: { };

    [MailTemplate.FORGOT_PASSWORD]: { };

    [MailTemplate.RESET_PASSWORD]: { };
};
