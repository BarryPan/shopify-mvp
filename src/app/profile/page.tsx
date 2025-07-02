import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import { shopifyFetch } from '@/lib/shopify';
import { CUSTOMER_QUERY } from '@/lib/queries/auth';

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);
  if (!session?.accessToken) redirect('/login');

  const data = await shopifyFetch<{
    customer: { firstName: string | null; lastName: string | null; email: string };
  }>(CUSTOMER_QUERY, { token: session.accessToken });

  const user = data.customer;
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <p>Name: {user.firstName} {user.lastName}</p>
      <p>Email: {user.email}</p>
    </main>
  );
}
