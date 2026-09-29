"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { BlogForm, type BlogFormValues } from "../../_components/blog-form";

export default function EditBlogPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [loading, setLoading] = useState(true);
  const [initialValues, setInitialValues] = useState<Partial<BlogFormValues>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/admin/blog/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Failed to load post");

        if (cancelled) return;
        setInitialValues({
          title: data.title ?? "",
          slug: data.slug ?? "",
          excerpt: data.excerpt ?? "",
          content: data.content ?? "",
          featuredImage: data.featuredImage ?? "",
          featuredImageAlt: data.featuredImageAlt ?? "",
          openGraphImage: data.openGraphImage ?? "",
          categoryId: data.categoryId ?? "",
          author: data.author ?? "Admin",
          authorRole: data.authorRole ?? "",
          authorBio: data.authorBio ?? "",
          authorImage: data.authorImage ?? "",
          status: data.status ?? "draft",
          publishedAt: data.publishedAt ? new Date(data.publishedAt).toISOString().slice(0, 16) : "",
          scheduledAt: data.scheduledAt ? new Date(data.scheduledAt).toISOString().slice(0, 16) : "",
          contentRevisedAt: data.contentRevisedAt ? new Date(data.contentRevisedAt).toISOString().slice(0, 16) : "",
          seoTitle: data.seoTitle ?? "",
          seoDescription: data.seoDescription ?? "",
          canonicalUrl: data.canonicalUrl ?? "",
          focusKeyword: data.focusKeyword ?? "",
          relatedKeywords: Array.isArray(data.relatedKeywords) ? data.relatedKeywords : [],
          relatedArticleIds: Array.isArray(data.relatedArticleIds) ? data.relatedArticleIds : [],
          relatedProductHandles: Array.isArray(data.relatedProductHandles) ? data.relatedProductHandles : [],
          isIndexable: data.isIndexable ?? true,
          tags: Array.isArray(data.tags) ? data.tags : [],
          isFeatured: data.isFeatured ?? false,
        });
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load post");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading) return <div className="p-8 text-sm text-[#5A5E55]">Loading...</div>;

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </div>
    );
  }

  return <BlogForm mode="edit" postId={id} initialValues={initialValues} />;
}

