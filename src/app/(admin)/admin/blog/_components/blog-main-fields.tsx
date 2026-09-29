import { AdminImageUpload } from "@/components/admin/image-upload";
import type { BlogFormValues } from "./blog-form";

type Props = {
  values: BlogFormValues;
  setValues: React.Dispatch<React.SetStateAction<BlogFormValues>>;
  categories: Array<{ id: string; name: string; parentId?: string | null }>;
};

export function BlogMainFields({ values, setValues, categories }: Props) {
  return (
    <>
      <div className="grid gap-3 md:gap-4 lg:grid-cols-2">
        <Field label="Title" value={values.title} onChange={(value) => setValues((v) => ({ ...v, title: value }))} required />
        <Field label="Slug" value={values.slug} onChange={(value) => setValues((v) => ({ ...v, slug: value }))} mono required />
      </div>
      <div className="grid gap-3 md:gap-4 lg:grid-cols-3">
        <label className="block text-xs font-medium text-[#0a0a0a] md:text-sm">Status<select value={values.status} onChange={(e) => setValues((v) => ({ ...v, status: e.target.value as BlogFormValues["status"] }))} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-transparent focus:ring-2 focus:ring-[#C6A24A] md:py-2 md:text-sm"><option value="draft">Draft</option><option value="scheduled">Scheduled</option><option value="published">Published</option></select></label>
        <label className="block text-xs font-medium text-[#0a0a0a] md:text-sm lg:col-span-2">Category<select value={values.categoryId ?? ""} onChange={(e) => setValues((v) => ({ ...v, categoryId: e.target.value }))} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs md:py-2 md:text-sm"><option value="">Uncategorized</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
      </div>
      <label className="flex items-center gap-2"><input type="checkbox" id="isFeatured" checked={values.isFeatured ?? false} onChange={(e) => setValues((v) => ({ ...v, isFeatured: e.target.checked }))} className="h-4 w-4 rounded border-gray-300 text-[#f6a45d] focus:ring-[#C6A24A]" /><span className="text-sm font-medium text-[#0a0a0a]">Featured Blog (show on homepage)</span></label>
      <AdminImageUpload label="Featured Image" folder="auerviamaison/blogs" usedIn="blog" value={values.featuredImage} onChange={(url) => setValues((v) => ({ ...v, featuredImage: url }))} />
      <Field label="Featured image alt text" value={values.featuredImageAlt ?? ""} onChange={(value) => setValues((v) => ({ ...v, featuredImageAlt: value }))} />
      <div className="grid gap-3 lg:grid-cols-3">
        <Field label="Publish date" type="datetime-local" value={values.publishedAt ?? ""} onChange={(value) => setValues((v) => ({ ...v, publishedAt: value }))} />
        <Field label="Schedule date" type="datetime-local" value={values.scheduledAt ?? ""} onChange={(value) => setValues((v) => ({ ...v, scheduledAt: value }))} />
        <Field label="Meaningful revision date" type="datetime-local" value={values.contentRevisedAt ?? ""} onChange={(value) => setValues((v) => ({ ...v, contentRevisedAt: value }))} />
      </div>
    </>
  );
}

function Field({ label, value, onChange, mono, required, type = "text" }: { label: string; value: string; onChange: (value: string) => void; mono?: boolean; required?: boolean; type?: string }) {
  return <label className="block text-xs font-medium text-[#0a0a0a] md:text-sm">{label}<input type={type} value={value} onChange={(e) => onChange(e.target.value)} required={required} className={`mt-1 w-full rounded-lg border border-gray-300 px-3 py-1.5 text-xs focus:border-transparent focus:ring-2 focus:ring-[#C6A24A] md:py-2 md:text-sm ${mono ? "font-mono" : ""}`} /></label>;
}
