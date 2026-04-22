import { redirect } from 'next/navigation';

export default function NodePage({ params }: { params: { id: string } }) {
  redirect(`/nodes/${params.id}/note`);
}
