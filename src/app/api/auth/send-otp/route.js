import prisma from '../../../utils/prisma';
import sendEmail from '../../../utils/sendEmail';

export async function POST(req) {
  const { email, mobile } = await req.json();

  if (!email) {
    return new Response(JSON.stringify({ message: 'Email is required' }), { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedMobile = mobile?.trim();

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  // upsert user record
  await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: { mobile: normalizedMobile, otp, otpExpires },
    create: { email: normalizedEmail, mobile: normalizedMobile, otp, otpExpires },
  });

  try {
    await sendEmail({
  to: normalizedEmail,
      subject: 'Your Decoreraisa OTP Code',
      text: `Your one-time password is ${otp}. It expires in 5 minutes.`,
      html: `<p>Your one-time password is <strong>${otp}</strong>. It expires in 5 minutes.</p>`,
    });
  } catch (err) {
    console.error('Email send failed', err);
    return new Response(JSON.stringify({ message: 'Failed to send OTP email' }), { status: 500 });
  }

  return new Response(JSON.stringify({ message: 'OTP sent to email' }), { status: 200 });
}
