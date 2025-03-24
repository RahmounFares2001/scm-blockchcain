// middleware.js
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // allow acces to clientPage
  if(pathname === "/clientPage") {
    return NextResponse.next();
  }

  // Récupérer le rôle de l'utilisateur depuis les cookies
  const userRole = req.cookies.get('userRole')?.value;

  if (!userRole) {
    // Si l'utilisateur n'a pas de rôle (non connecté), redirigez-le vers la page de connexion
    if (pathname !== '/') {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return NextResponse.next();
  }

  // Rediriger en fonction du rôle
  if (userRole === '0' && !pathname.startsWith('/adminDashboard')) {
    return NextResponse.redirect(new URL('/adminDashboard', req.url));
  } else if (userRole === '1' && !pathname.startsWith('/supplierDashboard')) {
    return NextResponse.redirect(new URL('/supplierDashboard', req.url));
  } else if (userRole === '2' && !pathname.startsWith('/manufacturerDashboard')) {
    return NextResponse.redirect(new URL('/manufacturerDashboard', req.url));
  } else if (userRole === '3' && !pathname.startsWith('/distributorDashboard')) {
    return NextResponse.redirect(new URL('/distributorDashboard', req.url));
  }

  // Si le rôle est inconnu, redirigez vers une page d'erreur
  if (!['0', '1', '2', '3'].includes(userRole) && pathname !== '/error') {
    return NextResponse.redirect(new URL('/error', req.url));
  }

  return NextResponse.next();
}

// Configurer les chemins sur lesquels le middleware s'applique
export const config = {
  matcher: [
    /*
     * Exclure les fichiers statiques et les routes API
     */
    '/((?!api|_next/static|_next/image|favicon.ico|login|error).*)',
  ],
};