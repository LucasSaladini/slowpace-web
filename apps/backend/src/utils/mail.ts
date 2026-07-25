import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendResetPasswordEmail(to: string, token: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const resetLink = `${frontendUrl}/reset-password?token=${token}`;

    try {
        const { data, error } = await resend.emails.send({
            from: 'SlowPace <onboarding@resend.dev>', // Em produção, você substitui pelo seu domínio verificado
            to: [to],
            subject: 'Recuperação de Senha - SlowPace',
            html: `
                <div style="font-family: sans-serif; padding: 24px; background-color: #09090b; color: #f4f4f5; border-radius: 16px;">
                    <h2 style="font-weight: 300; letter-spacing: 0.1em; text-transform: uppercase; font-size: 18px; color: #a1a1aa;">SlowPace / Recuperação</h2>
                    <p style="font-size: 14px; color: #d4d4d8; margin-top: 16px;">Você solicitou a redefinição de senha para a sua conta.</p>
                    <p style="font-size: 14px; color: #d4d4d8;">Clique no botão abaixo para prosseguir:</p>
                    <a href="${resetLink}" target="_blank" rel="noopener noreferrer" style="display: inline-block; padding: 12px 24px; background-color: #f4f4f5; color: #09090b; text-decoration: none; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; border-radius: 12px; margin-top: 16px;">Redefinir Senha</a>
                    <p style="margin-top: 32px; font-size: 11px; color: #71717a;">Se você não solicitou esta alteração, por favor ignore este e-mail.</p>
                </div>
            `,
        });

        if (error) {
            console.error('Erro ao enviar e-mail via Resend:', error);
            throw new Error('Falha ao enviar e-mail de recuperação.');
        }

        return data;
    } catch (err) {
        console.error('Erro crítico no serviço de e-mail:', err);
        throw err;
    }
}