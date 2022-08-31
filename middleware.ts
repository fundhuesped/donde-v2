import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { AuthenticatedUserSchema } from './model/auth';
import { UserRole } from '@prisma/client';

export const middleware = async (req: NextRequest) => {
  const token = await getToken({ req });

  const userParse = AuthenticatedUserSchema.safeParse(token?.user);

  if (!userParse.success || userParse.data.role !== UserRole.ADMIN) {
    return new NextResponse(null, { status: 403 });
  }

  return NextResponse.next();
};

export const config = {
  matcher: ['/api/admin/:path*', '/admin/:path*'],
};
