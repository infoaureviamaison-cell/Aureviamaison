import { permanentRedirect } from "next/navigation";

export default async function LegacyArticlePage({
  params,
}: {
  params: Promise<{ blogHandle: string; articleHandle: string }>;
}) {
  const { articleHandle } = await params;
  permanentRedirect(`/blog/${articleHandle}`);
}
