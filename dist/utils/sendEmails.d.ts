type EmailOptions = {
    to: string;
    subject: string;
    html: string;
};
export declare const sendEmail: ({ to, subject, html }: EmailOptions) => Promise<boolean>;
export {};
//# sourceMappingURL=sendEmails.d.ts.map