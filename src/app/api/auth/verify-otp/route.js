import prisma from '../../../utils/prisma';
import jwt from 'jsonwebtoken';

export async function POST(req) {
  const { email, otp } = await req.json();

  if (!email || !otp) {
    return new Response(JSON.stringify({ message: 'Email and OTP are required' }), { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const submittedOtp = otp.trim();

  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  if (
    !user ||
    user.otp !== submittedOtp ||
    !user.otpExpires ||
    new Date(user.otpExpires).getTime() < Date.now()
  ) {
    return new Response(JSON.stringify({ message: 'Invalid or expired OTP' }), { status: 400 });
  }

  const updated = await prisma.user.update({
    where: { id: user.id },
    data: { isVerified: true, otp: null, otpExpires: null },
  });

  const token = jwt.sign({ userId: updated.id, email: updated.email }, process.env.JWT_SECRET, { expiresIn: '7d' });

  return new Response(JSON.stringify({ message: 'OTP verified', token }), { status: 200 });
}
