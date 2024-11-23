import { NextResponse, type NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const response = NextResponse.next();

  // Перевіряємо, чи шлях відповідає статичним файлам
  if (req.nextUrl.pathname.startsWith('/_next/static/')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  return response;
}