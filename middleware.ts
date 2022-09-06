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
  status?: number;
};

const ADMIN_ROUTES: RouteMatcher[] = [{ path: '/admin' }];
const ADMIN_API_ROUTES: RouteMatcher[] = [{ path: '/api/admin' }];

const COLLABORATOR_ROUTES: RouteMatcher[] = [{ path: '/establecimientos/editar' }];
const COLLABORATOR_API_ROUTES: RouteMatcher[] = [{ path: '/api/establishments', methods: ['POST', 'PUT'] }];

const ROUTE_AUTORIZATION_CONFIGS: RouteAuthorizationConfig[] = [
  ...ADMIN_ROUTES.map((matcher) => ({ matcher, roles: [UserRole.ADMIN], status: 404 })),
  ...COLLABORATOR_ROUTES.map((matcher) => ({ matcher, roles: [UserRole.ADMIN, UserRole.COLLABORATOR], status: 404 })),
  ...ADMIN_API_ROUTES.map((matcher) => ({ matcher, roles: [UserRole.ADMIN] })),
  ...COLLABORATOR_API_ROUTES.map((matcher) => ({ matcher, roles: [UserRole.ADMIN, UserRole.COLLABORATOR] })),
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
      if (routeAuthorizationConfig.status === 404) {
        const destination = req.nextUrl.clone();
        destination.pathname = '/404';
        return NextResponse.rewrite(destination);
      } else {
        return new NextResponse(null, { status: routeAuthorizationConfig.status ?? 403 });
      }
    }
  }

  return NextResponse.next();
};
