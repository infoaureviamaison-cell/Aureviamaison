import { notFound } from "next/navigation";
import Link from "next/link";
import { publishedBlogWhere } from "@/lib/blog";
import { prisma } from "@/lib/prisma";
import { createSeoMetadata } from "@/lib/seo";

export const revalidate = 900;

async function findAuthor(slug: string) {
  const author = await prisma.author.findUnique({ where: { slug } });
  const posts = await prisma.blogPost.findMany({ where: { ...publishedBlogWhere(), ...(author ? { authorId: author.id } : { author: { equals: slug.replace(/-/g, " "), mode: "insensitive" } }) }, orderBy: { publishedAt: "desc" }, select: { author: true, authorRole: true, authorBio: true, authorImage: true, title: true, slug: true } });
  const legacy = posts[0];
  return { profile: author ? { author: author.name, authorRole: author.role, authorBio: author.bio, authorImage: author.image } : legacy, posts };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const { profile } = await findAuthor(slug);
  return createSeoMetadata({ title: profile ? `${profile.author} – Author` : "Author Not Found", description: profile?.authorBio || "Meet the people who write Auerviamaison product and beauty guides.", path: `/blog/author/${slug}`, noIndex: !profile });
}

export default async function AuthorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params; const { profile, posts } = await findAuthor(slug); if (!profile) notFound();
  return <main className="mx-auto max-w-4xl px-4 py-12"><nav aria-label="Breadcrumb"><Link href="/blog">Blog</Link> / Authors</nav><h1 className="mt-8 text-4xl font-bold">{profile.author}</h1>{profile.authorRole && <p className="mt-2 text-lg">{profile.authorRole}</p>}<p className="mt-4 text-muted-foreground">{profile.authorBio || `${profile.author} contributes practical product and beauty guides to Auerviamaison.`}</p><h2 className="mt-12 text-2xl font-semibold">Published articles</h2><ul className="mt-5 space-y-3">{posts.map((post) => <li key={post.slug}><Link href={`/blog/${post.slug}`}>{post.title}</Link></li>)}</ul></main>;
}
