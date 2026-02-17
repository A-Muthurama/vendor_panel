
const COLORS = {
    primary: '#3F0E27', // Dark Plum
    secondary: '#D4AF37', // Gold
    text: '#333333',
    lightText: '#666666',
    background: '#fcfafb',
    card: '#ffffff',
    border: '#e1e1e1'
};

const LOGO_URL = "https://vendor.jewellersparadise.com/images/logo.png";

const getBaseTemplate = (title, content) => `
<div style="margin: 0; padding: 0; font-family: Arial, sans-serif; background-color: ${COLORS.background}; padding-bottom: 40px;">
    <table align="center" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 600px; margin: 20px auto; background-color: ${COLORS.card}; border: 1px solid ${COLORS.border}; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
        <!-- Header -->
        <tr>
            <td style="background-color: ${COLORS.primary}; padding: 40px 20px; text-align: center; border-bottom: 4px solid ${COLORS.secondary};">
                <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto;">
                    <tr>
                        <td style="padding-right: 12px; vertical-align: middle;">
                            <img src="${LOGO_URL}" alt="Logo" width="45" height="45" style="display: block; border-radius: 4px;">
                        </td>
                        <td style="vertical-align: middle;">
                            <h1 style="color: ${COLORS.secondary}; font-family: Arial, Helvetica, sans-serif; font-size: 24px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; margin: 0; line-height: 1.2;">Jewellers Paradise</h1>
                        </td>
                    </tr>
                </table>
                <div style="width: 50px; height: 1px; background-color: ${COLORS.secondary}; opacity: 0.3; margin: 15px auto 8px auto;"></div>
                <p style="color: #ffffff; margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 3px; font-weight: bold; opacity: 0.8; font-family: Arial, sans-serif;">${title}</p>
            </td>
        </tr>
        
        <!-- Content -->
        <tr>
            <td style="padding: 60px 50px;">
                ${content}
            </td>
        </tr>
        
        <!-- Footer -->
        <tr>
            <td style="background-color: #fcfcfc; padding: 45px 30px; text-align: center; border-top: 1px solid #f0f0f0;">
                <table border="0" cellpadding="0" cellspacing="0" align="center" style="margin: 0 auto;">
                    <tr>
                        <td style="padding-right: 10px; vertical-align: middle;">
                            <img src="${LOGO_URL}" alt="JP" width="25" height="25" style="display: block; opacity: 0.5;">
                        </td>
                        <td style="vertical-align: middle;">
                            <p style="margin: 0; color: ${COLORS.primary}; font-family: Arial, sans-serif; font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 2px; opacity: 0.8;">Jewellers Paradise</p>
                        </td>
                    </tr>
                </table>
                <div style="margin: 20px auto; width: 40px; height: 1px; background-color: ${COLORS.border};"></div>
                <div style="color: #a0a0a0; font-size: 11px; line-height: 1.8; max-width: 450px; margin: 0 auto;">
                    This communication contains confidential information intended solely for the partner. 
                    If you are not the intended recipient, please notify us immediately.<br/>
                    © 2026 Jewellers Paradise. All Rights Reserved.
                </div>
                <div style="margin-top: 25px; letter-spacing: 5px;">
                    <span style="color: ${COLORS.secondary}; font-size: 18px;">•</span>
                    <span style="color: ${COLORS.primary}; font-size: 18px;">•</span>
                    <span style="color: ${COLORS.secondary}; font-size: 18px;">•</span>
                </div>
            </td>
        </tr>
    </table>
</div>
`;

export const getWelcomeEmail = (shopName) => getBaseTemplate(
    "Registration Successful",
    `
    <h2 style="color: ${COLORS.primary}; margin: 0 0 25px 0; font-family: 'Arial', sans-serif; font-size: 22px; font-weight: bold; letter-spacing: 0.5px;">Welcome to the Network,</h2>
    <div style="color: ${COLORS.text}; line-height: 1.8; font-size: 15px; font-family: 'Helvetica Neue', sans-serif;">
        <p>This communication serves as formal acknowledgment of the registration for <strong style="color: ${COLORS.primary};">${shopName}</strong> within the Jewellers Paradise merchant network.</p>
        
        <div style="background-color: #fdfafb; border-left: 3px solid ${COLORS.secondary}; padding: 25px; margin: 35px 0; border-radius: 4px; box-shadow: 2px 2px 10px rgba(0,0,0,0.02);">
            <p style="margin: 0; font-weight: 700; color: ${COLORS.primary}; font-size: 13px; text-transform: uppercase; letter-spacing: 1.5px;">Status: Credential Verification</p>
            <p style="margin: 12px 0 0 0; font-size: 14px; color: ${COLORS.lightText}; line-height: 1.6;">Our administrative department is currently reviewing your submitted business documentation. This mandatory protocol ensures the integrity of our marketplace and is typically concluded within 24 to 48 business hours.</p>
        </div>

        <p>Upon successful verification, your account will be activated with authorized access to:</p>
        <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0; font-size: 14px; color: ${COLORS.lightText};">
            <tr><td style="padding: 8px 0; border-bottom: 1px dashed #eee;">• Premium collection showcase tools</td></tr>
            <tr><td style="padding: 8px 0; border-bottom: 1px dashed #eee;">• Integrated merchant-client communication suite</td></tr>
            <tr><td style="padding: 8px 0;">• Strategic business intelligence metrics</td></tr>
        </table>

        <p style="margin-top: 45px; font-size: 14px; color: ${COLORS.primary}; text-align: center; font-style: italic; font-weight: 500;">"Crafting excellence through strategic partnerships."</p>
    </div>
    `
);

export const getForgotPasswordEmail = (resetLink, systemRef) => getBaseTemplate(
    "Security Protocol",
    `
    <h2 style="color: ${COLORS.primary}; margin: 0 0 25px 0; font-size: 20px; font-weight: bold; letter-spacing: 0.5px; text-align: center;">Security Authorization</h2>
    <div style="color: ${COLORS.text}; line-height: 1.8; font-size: 15px; text-align: center;">
        <p style="margin-bottom: 30px;">A formal request to modify the administrative credentials associated with your account has been recorded.</p>
        
        <div style="margin: 30px 0;">
            <a href="${resetLink}" style="background-color: ${COLORS.primary}; color: ${COLORS.secondary}; padding: 18px 36px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block; font-size: 13px; border: 1px solid ${COLORS.secondary}; text-transform: uppercase; letter-spacing: 1px;">Authorize Modification</a>
        </div>

        <p style="color: #888; font-size: 12px; margin-top: 20px;">If the button above does not work, please copy and paste the following link into your browser:</p>
        <p style="word-break: break-all; color: ${COLORS.primary}; font-size: 12px; background: #f9f9f9; padding: 10px; border-radius: 4px; border: 1px dashed ${COLORS.border};">${resetLink}</p>

        <div style="background-color: #fcfcfc; border-top: 2px solid ${COLORS.primary}; padding: 25px; border-radius: 0 0 4px 4px; margin-top: 40px; text-align: left;">
            <p style="margin: 0; font-size: 12px; color: ${COLORS.lightText}; line-height: 1.6;">
                <strong>Administrative Notice:</strong> This authorization link is time-bound and will automatically expire in 15 minutes to preserve account integrity.
            </p>
        </div>
        <p style="margin-top: 25px; font-size: 10px; color: #ccc;">System Reference: ${systemRef}</p>
    </div>
    `,
    "Jewellers Paradise Security Administration"
);

export const getOTPEmail = (otp) => getBaseTemplate(
    "EMAIL VERIFICATION",
    `
    <div style="text-align: center;">
        <h2 style="color: ${COLORS.primary}; margin: 0 0 20px 0; font-size: 20px; font-weight: bold;">Identity Verification</h2>
        <p style="color: ${COLORS.text}; line-height: 1.6; font-size: 15px; margin-bottom: 30px;">To proceed with your request, please use the following secure verification code.</p>
        
        <div style="background-color: #fdfafb; border: 1px solid #f2e1e5; padding: 30px; margin: 0 auto; border-radius: 8px; display: inline-block; min-width: 200px;">
            <h1 style="color: ${COLORS.primary}; letter-spacing: 10px; margin: 0; font-size: 42px; font-weight: bold;">${otp}</h1>
        </div>

        <p style="margin-top: 30px; font-size: 13px; color: ${COLORS.lightText};">
            This code remains valid for <strong>5 minutes</strong>.
        </p>
        <p style="margin-top: 10px; font-size: 11px; color: #a0a0a0; font-style: italic;">For security, do not share this code with anyone.</p>
    </div>
    `
);

export const getApprovalEmail = (ownerName, shopName) => getBaseTemplate(
    "Partnership Activated",
    `
    <h2 style="color: ${COLORS.primary}; margin: 0 0 25px 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">Congratulations!</h2>
    <div style="color: ${COLORS.text}; line-height: 1.8; font-size: 15px;">
        <p>Dear <strong>${ownerName}</strong>,</p>
        <p>We are pleased to inform you that your application for <strong>${shopName}</strong> has been successfully verified and approved.</p>
        
        <p>Your administrative console is now fully provisioned. You can now begin showcasing your collections and engaging with our client network.</p>

        <div style="background-color: #fdfafb; border: 1px solid ${COLORS.secondary}; padding: 25px; margin: 35px 0; border-radius: 8px; text-align: center;">
            <p style="margin: 0; font-weight: 700; color: ${COLORS.primary}; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Account Ready for Use</p>
            <p style="margin: 12px 0 20px 0; font-size: 14px; color: ${COLORS.lightText};">Login to your dashboard to complete your profile and start posting offers.</p>
            <a href="https://jewellersparadise.in/vendor/login" style="background-color: ${COLORS.primary}; color: ${COLORS.secondary}; padding: 15px 30px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block; font-size: 13px; text-transform: uppercase;">Access Dashboard</a>
            
            <p style="color: #888; font-size: 11px; margin-top: 20px;">Link fallback: https://vendor.jewellersparadise.com/login</p>
        </div>

        <p>We look forward to a successful partnership.</p>
    </div>
    `,
    "Jewellers Paradise Partner Success Team"
);

export const getRejectionEmail = (ownerName, shopName, reason) => getBaseTemplate(
    "Application Status",
    `
    <h2 style="color: ${COLORS.primary}; margin: 0 0 25px 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">Application Update,</h2>
    <div style="color: ${COLORS.text}; line-height: 1.8; font-size: 15px;">
        <p>Dear <strong>${ownerName}</strong>,</p>
        <p>Thank you for your interest in joining the Jewellers Paradise merchant network with <strong>${shopName}</strong>.</p>
        
        <p>After a thorough review of your application and submitted documentation by our administrative department, we regret to inform you that we are unable to approve your registration at this time.</p>
        
        <div style="background-color: #fffaf0; border-left: 4px solid #cc0000; padding: 25px; margin: 35px 0; border-radius: 4px;">
            <p style="margin: 0; font-weight: 700; color: #cc0000; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Reason for Rejection</p>
            <p style="margin: 12px 0 0 0; font-size: 14px; color: ${COLORS.lightText};">${reason || "Documentation provided does not meet our current verification standards."}</p>
        </div>

        <p>If you believe this is an error or wish to provide additional documentation, please contact our support team at <a href="mailto:jewellersparadisej@gmail.com" style="color: ${COLORS.primary}; font-weight: 600;">jewellersparadisej@gmail.com</a>.</p>
        
        <p style="margin-top: 40px;">We appreciate your understanding and wish you the best in your business endeavors.</p>
    </div>
    `,
    "Jewellers Paradise Administrative Reviews"
);

export const getOfferApprovalEmail = (ownerName, offerTitle) => getBaseTemplate(
    "Offer Approved",
    `
    <h2 style="color: ${COLORS.primary}; margin: 0 0 25px 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">Offer Published!</h2>
    <div style="color: ${COLORS.text}; line-height: 1.8; font-size: 15px;">
        <p>Dear <strong>${ownerName}</strong>,</p>
        <p>Your promotional offer titled <strong>"${offerTitle}"</strong> has been reviewed and approved by our administrative team.</p>
        
        <p>The offer is now live on the Jewellers Paradise platform and visible to our customer network.</p>

        <div style="background-color: #f6fdf6; border-left: 4px solid #28a745; padding: 25px; margin: 35px 0; border-radius: 4px;">
            <p style="margin: 0; font-weight: 700; color: #28a745; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Status: Online & Active</p>
            <p style="margin: 12px 0 0 0; font-size: 14px; color: ${COLORS.lightText};">You can monitor its performance through your merchant dashboard.</p>
        </div>
    </div>
    `,
    "Jewellers Paradise Content Moderation"
);

export const getOfferRejectionEmail = (ownerName, offerTitle, reason) => getBaseTemplate(
    "Offer Status Update",
    `
    <h2 style="color: ${COLORS.primary}; margin: 0 0 25px 0; font-size: 20px; font-weight: 600; letter-spacing: 0.5px;">Offer Moderation Notice,</h2>
    <div style="color: ${COLORS.text}; line-height: 1.8; font-size: 15px;">
        <p>Dear <strong>${ownerName}</strong>,</p>
        <p>Our moderation team has completed the review of your offer submission: <strong>"${offerTitle}"</strong>.</p>
        
        <p>Regrettably, we are unable to publish this offer in its current form due to the following reason:</p>
        
        <div style="background-color: #fffaf0; border-left: 4px solid #cc0000; padding: 25px; margin: 35px 0; border-radius: 4px;">
            <p style="margin: 0; font-weight: 700; color: #cc0000; font-size: 13px; text-transform: uppercase; letter-spacing: 1px;">Moderation Feedback</p>
            <p style="margin: 12px 0 0 0; font-size: 14px; color: ${COLORS.lightText};">${reason || "The offer content does not align with our quality guidelines."}</p>
        </div>

        <p>You may revise the offer details and resubmit for verification through your dashboard.</p>
    </div>
    `,
    "Jewellers Paradise Content Moderation"
);
