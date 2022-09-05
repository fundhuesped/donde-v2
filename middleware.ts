import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { AuthenticatedUserSchema } from './model/auth';
import { UserRole } from '@prisma/client';

type RouteMatcher = {
  path: string;
  methods?: string[];
};

type RouteAuthorizationConfig = {
  matcher: RouteMatcher;
  roles: UserRole[];
};

const ADMIN_ROUTES: RouteMatcher[] = [{ path: '/api/admin' }, { path: '/admin' }];

const COLLABORATOR_ROUTES: RouteMatcher[] = [
  { path: '/establecimientos/nuevo' },
  { path: '/establecimientos/editar' },
  { path: '/api/establishments/', methods: ['POST', 'PUT'] },
];

const ROUTE_AUTORIZATION_CONFIGS: RouteAuthorizationConfig[] = [
  ...ADMIN_ROUTES.map((matcher) => ({ matcher, roles: [UserRole.ADMIN] })),
  ...COLLABORATOR_ROUTES.map((matcher) => ({ matcher, roles: [UserRole.ADMIN, UserRole.COLLABORATOR] })),
];

function getRouteAuthorizationConfig(req: NextRequest) {
  const path = req.nextUrl.pathname;
  const method = req.method;
  return ROUTE_AUTORIZATION_CONFIGS.find(
    ({ matcher }) => path.startsWith(matcher.path) && (!matcher.methods || matcher.methods.includes(method)),
  );
}

export const middleware = async (req: NextRequest) => {
  const routeAuthorizationConfig = getRouteAuthorizationConfig(req);
  if (routeAuthorizationConfig) {
    const token = await getToken({ req });
    const userParse = AuthenticatedUserSchema.safeParse(token?.user);

    if (!userParse.success || !routeAuthorizationConfig.roles.includes(userParse.data.role)) {
      return new NextResponse(null, { status: 403 });
    }
  }

  return NextResponse.next();
};
