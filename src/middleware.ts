import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { auth } from '@/modules/users/infrastructure/auth';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip public assets and basic routes
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname === '/') {
    return NextResponse.next();
  }

  // 2. Protect Admin routes
  if (pathname.startsWith('/admin')) {
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session) {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }

    const { user } = session;
    
    // RBAC: Check roles
    if (pathname.startsWith('/admin/super') && user.role !== 'super_admin') {
      return NextResponse.redirect(new URL('/admin', request.url));
    }

    if (user.role === 'client') {
      return NextResponse.redirect(new URL('/', request.url));
    }
    
    // TODO: Implement Feature Flag checks
    // This usually requires fetching barbershop settings
    // For performance, we could store feature flags in the session or a cookie
  }

  // 3. Handle Public Barbershop Pages (/barberia/[slug])
  if (pathname.startsWith('/barberia/')) {
    // We could check if the barbershop exists and has 'show_public_site' active
    // But this is better done in the Page component with SSR for SEO
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/barberia/:path*'],
};
