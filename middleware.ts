import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { authenticatedUserSchema } from './model/auth';
import { UserRole } from '@prisma/client';

export const middleware = async (req: NextRequest) => {
  const token = await getToken({ req });
  const user = token?.user;

  if (!authenticatedUserSchema.isValidSync(user) || user.role !== UserRole.ADMIN) {
    return new NextResponse(null, { status: 403 });
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/api/admin/:path*', '/admin/:path*'],
};
