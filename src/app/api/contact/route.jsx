import { Resend } from "resend";
import { NextResponse } from "next/server";

export async function POST(req) {
    try {
        const resend = new Resend(process.env.RESEND_API_KEY);

        const { name, email, message } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ error: "All fields are required" }, { status: 400 });
        }

        const { data, error } = await resend.emails.send({
            from:    "onboarding@resend.dev",   // ✅ must be this on free plan
            to:      [process.env.YOUR_EMAIL],  // ✅ must be array, must match resend signup email
            replyTo: email,                     // ✅ visitor email goes here — so you can reply to them
            subject: `Portfolio Contact from ${name}`,
            html: `
                <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
                    <h2 style="color:#0ea5e9;">Portfolio Message</h2>
                    <table style="width:100%;border-collapse:collapse;">
                        <tr>
                            <td style="padding:8px;font-weight:bold;color:#555;">Name</td>
                            <td style="padding:8px;">${name}</td>
                        </tr>
                        <tr style="background:#f9f9f9;">
                            <td style="padding:8px;font-weight:bold;color:#555;">Email</td>
                            <td style="padding:8px;"><a href="mailto:${email}">${email}</a></td>
                        </tr>
                        <tr>
                            <td style="padding:8px;font-weight:bold;color:#555;vertical-align:top;">Message</td>
                            <td style="padding:8px;white-space:pre-wrap;">${message}</td>
                        </tr>
                    </table>
                </div>
            `,
        });

        if (error) {
            console.error("Resend error:", error);
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ success: true, id: data.id });
    } catch (err) {
        console.error("Server error:", err.message);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}