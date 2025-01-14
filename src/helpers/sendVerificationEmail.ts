import { resend } from "@/app/lib/resend";
import VerificationEmail from "../../emails/verificationEmails";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
): Promise<ApiResponse> {
    try {
        // Send the verification email
        await resend.emails.send({
            from: 'you@example.com', 
            to: email, 
            subject: 'Your Verification Code',
            react: VerificationEmail ({username, otp:verifyCode}),
        });

        return { success: true, message: 'Verification email sent successfully.' };
    } catch (emailError) {
        console.error("Error sending verification email:", emailError);

        return { success: false, message: 'Failed to send verification email.' };
    }
}
