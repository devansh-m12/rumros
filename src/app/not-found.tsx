import Image from 'next/image';
import Link from 'next/link';
import logo from '@/assets/logo.svg';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md px-4 text-center">
        <Link
          href="/"
          className="flex items-center justify-center mb-8 transition-opacity hover:opacity-80"
        >
          <Image alt="Rumros logo" src={logo} width={120} height={40} priority />
        </Link>
        
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <h2 className="text-xl font-semibold mb-6">Page not found</h2>
        <p className="text-muted-foreground mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="flex flex-col gap-4">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Go to Homepage
          </Link>
          <Link
            href="/u/dashboard"
            className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}