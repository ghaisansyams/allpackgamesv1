<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title>Your ALLPACK Packaging Decision Result</title>
</head>
<body style="margin:0; padding:0; background-color:#f8fafc; font-family: Arial, Helvetica, sans-serif; color:#0f172a;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f8fafc; padding:32px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" style="max-width:560px; background-color:#ffffff; border-radius:16px; overflow:hidden;">
                    <tr>
                        <td style="background-color:#0f172a; padding:28px 32px;">
                            <p style="margin:0; color:#fbbf24; font-size:12px; font-weight:bold; letter-spacing:2px; text-transform:uppercase;">ALLPACK 2026</p>
                            <h1 style="margin:6px 0 0; color:#ffffff; font-size:22px;">Your Packaging Decision Result</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:32px;">
                            <p style="margin:0 0 16px; font-size:15px;">Hi {{ $visitor->name }},</p>
                            <p style="margin:0 0 24px; font-size:15px; line-height:1.6;">
                                Thanks for playing the Packaging Decision Lab at the ALLPACK 2026 booth. Here is your result for the
                                <strong>{{ $businessCase?->title }}</strong> scenario.
                            </p>

                            <table role="presentation" width="100%" style="background-color:#0f172a; border-radius:12px; margin-bottom:24px;">
                                <tr>
                                    <td align="center" style="padding:24px;">
                                        <p style="margin:0; color:#cbd5e1; font-size:11px; letter-spacing:2px; text-transform:uppercase;">Fit Score</p>
                                        <p style="margin:4px 0; color:#fbbf24; font-size:42px; font-weight:bold;">{{ $session->fit_score }}<span style="font-size:18px; color:#cbd5e1;">/100</span></p>
                                    </td>
                                </tr>
                            </table>

                            <table role="presentation" width="100%" style="margin-bottom:24px;">
                                <tr>
                                    <td style="padding:10px 0; border-bottom:1px solid #e2e8f0;">
                                        <p style="margin:0; font-size:11px; color:#64748b; text-transform:uppercase; letter-spacing:1px;">Your Profile</p>
                                        <p style="margin:2px 0 0; font-size:15px; font-weight:bold;">{{ $session->profile }}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 0; border-bottom:1px solid #e2e8f0;">
                                        <p style="margin:0; font-size:11px; color:#64748b; text-transform:uppercase; letter-spacing:1px;">Your Strength</p>
                                        <p style="margin:2px 0 0; font-size:15px; font-weight:bold;">{{ $session->strength }}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 0; border-bottom:1px solid #e2e8f0;">
                                        <p style="margin:0; font-size:11px; color:#64748b; text-transform:uppercase; letter-spacing:1px;">Your Trade-off</p>
                                        <p style="margin:2px 0 0; font-size:15px; font-weight:bold;">{{ $session->trade_off }}</p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding:10px 0;">
                                        <p style="margin:0; font-size:11px; color:#64748b; text-transform:uppercase; letter-spacing:1px;">ALLPACK Solution</p>
                                        <p style="margin:2px 0 0; font-size:15px; font-weight:bold;">{{ $option?->label }}</p>
                                    </td>
                                </tr>
                            </table>

                            <p style="margin:0; font-size:14px; line-height:1.6; color:#475569;">
                                Want to talk through this result with our packaging team? Just reply to this email, or drop by
                                the ALLPACK booth again — we're ready to help you make it real.
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:20px 32px; background-color:#f1f5f9; text-align:center;">
                            <p style="margin:0; font-size:12px; color:#94a3b8;">ALLPACK 2026 — Growing Our Tomorrow</p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
