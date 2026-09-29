import { AdminImageUpload } from "@/components/admin/image-upload";
import { X } from "@esmate/shadcn/pkgs/lucide-react";
import type { Certificate, CertificateFormData } from "./types";

export function CertificateModal({ editingCert, formData, setFormData, onSubmit, onClose, saving }: {
  editingCert: Certificate | null;
  formData: CertificateFormData;
  setFormData: React.Dispatch<React.SetStateAction<CertificateFormData>>;
  onSubmit: (event: React.FormEvent) => Promise<void>;
  onClose: () => void;
  saving: boolean;
}) {
  const update = <Key extends keyof CertificateFormData>(key: Key, value: CertificateFormData[Key]) =>
    setFormData((current) => ({ ...current, [key]: value }));

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/55 p-3 sm:p-6">
      <div className="mx-auto w-full max-w-3xl rounded-2xl bg-white p-5 shadow-2xl sm:p-7">
        <div className="mb-6 flex items-center justify-between">
          <div><h2 className="text-xl font-bold text-[#0a0a0a]">{editingCert ? "Edit Certificate" : "Add Certificate"}</h2><p className="mt-1 text-sm text-[#5A5E55]">Certificate and organization details shown across the storefront.</p></div>
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-gray-100" aria-label="Close"><X className="h-5 w-5" /></button>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Title" value={formData.title} onChange={(value) => update("title", value)} required />
            <Input label="Organization Name" value={formData.organizationName} onChange={(value) => update("organizationName", value)} required />
          </div>
          <label className="block text-sm font-medium text-[#0a0a0a]">Short Description<textarea value={formData.shortDescription} onChange={(event) => update("shortDescription", event.target.value)} rows={3} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#C6A24A] focus:outline-none focus:ring-2 focus:ring-[#C6A24A]/20" /></label>

          <div className="grid gap-5 sm:grid-cols-2">
            <AdminImageUpload label="Organization Logo" folder="auerviamaison/certificates/logos" usedIn="certificate organization logo" value={formData.organizationLogo} onChange={(url) => update("organizationLogo", url)} />
            <AdminImageUpload label="Certificate Image" folder="auerviamaison/certificates/documents" usedIn="certificate image" value={formData.certificateImage} onChange={(url) => update("certificateImage", url)} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Select label="Orientation" value={formData.orientation} onChange={(value) => update("orientation", value as CertificateFormData["orientation"])} options={["LANDSCAPE", "PORTRAIT"]} />
            <Input label="Issue Date" type="date" value={formData.issueDate} onChange={(value) => update("issueDate", value)} required />
            <Input label="Expiry Date (optional)" type="date" value={formData.expiryDate} onChange={(value) => update("expiryDate", value)} />
            <Input label="Certificate Number" value={formData.certificateNumber} onChange={(value) => update("certificateNumber", value)} />
            <Input label="Verification URL" type="url" value={formData.verificationUrl} onChange={(value) => update("verificationUrl", value)} placeholder="https://" />
            <Input label="Display Order" type="number" value={String(formData.displayOrder)} onChange={(value) => update("displayOrder", Math.max(0, Number(value) || 0))} />
          </div>

          <div className="flex flex-wrap gap-5 rounded-xl bg-[#fcf5e8] p-4">
            <Check label="Active" checked={formData.active} onChange={(value) => update("active", value)} />
            <Check label="Featured" checked={formData.featured} onChange={(value) => update("featured", value)} />
          </div>
          {(!formData.organizationLogo || !formData.certificateImage) ? <p className="text-sm font-medium text-amber-700">Upload both the organization logo and certificate image before saving.</p> : null}
          <div className="flex justify-end gap-3 border-t pt-5"><button type="button" onClick={onClose} className="rounded-lg border border-gray-300 px-4 py-2 text-sm">Cancel</button><button type="submit" disabled={saving || !formData.organizationLogo || !formData.certificateImage} className="rounded-lg bg-[#C6A24A] px-5 py-2 text-sm font-semibold text-white disabled:opacity-50">{saving ? "Saving..." : "Save Certificate"}</button></div>
        </form>
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text", required, placeholder }: { label: string; value: string; onChange: (value: string) => void; type?: string; required?: boolean; placeholder?: string }) {
  return <label className="block text-sm font-medium text-[#0a0a0a]">{label}<input type={type} value={value} onChange={(event) => onChange(event.target.value)} required={required} placeholder={placeholder} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-[#C6A24A] focus:outline-none focus:ring-2 focus:ring-[#C6A24A]/20" /></label>;
}

function Select({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: string[] }) {
  return <label className="block text-sm font-medium text-[#0a0a0a]">{label}<select value={value} onChange={(event) => onChange(event.target.value)} className="mt-1 w-full rounded-lg border border-gray-300 px-3 py-2">{options.map((option) => <option key={option} value={option}>{option.charAt(0) + option.slice(1).toLowerCase()}</option>)}</select></label>;
}

function Check({ label, checked, onChange }: { label: string; checked: boolean; onChange: (value: boolean) => void }) {
  return <label className="flex items-center gap-2"><input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-[#C6A24A]" /><span className="text-sm font-medium">{label}</span></label>;
}
