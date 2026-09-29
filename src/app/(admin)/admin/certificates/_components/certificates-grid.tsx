import Image from "next/image";
import { ArrowDown, ArrowUp, Calendar, Pencil, Star, Trash2 } from "@esmate/shadcn/pkgs/lucide-react";
import type { Certificate } from "./types";

export function CertificatesGrid({ certificates, openModal, deleteCert, moveCertificate }: {
  certificates: Certificate[];
  openModal: (certificate: Certificate) => void;
  deleteCert: (id: string) => void;
  moveCertificate: (id: string, direction: -1 | 1) => void;
}) {
  if (!certificates.length) return <div className="rounded-xl border border-dashed border-[#C6A24A]/40 bg-white p-10 text-center text-sm text-[#5A5E55]">No certificates yet. Add the first certificate to begin.</div>;

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {certificates.map((certificate, index) => (
        <article key={certificate.id} className="flex min-w-0 gap-4 rounded-xl border border-[#C6A24A]/20 bg-white p-4 shadow-sm">
          <div className={`relative shrink-0 overflow-hidden rounded-lg bg-[#f4f1e8] ${certificate.orientation === "PORTRAIT" ? "h-32 w-24" : "h-24 w-32"}`}>
            <Image src={certificate.certificateImage} alt={certificate.title} fill className="object-cover" sizes="128px" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <div><h2 className="truncate font-semibold text-[#0a0a0a]">{certificate.title}</h2><p className="mt-0.5 truncate text-xs text-[#5A5E55]">{certificate.organizationName}</p></div>
              {certificate.featured ? <Star className="h-4 w-4 shrink-0 fill-[#C6A24A] text-[#C6A24A]" aria-label="Featured" /> : null}
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-medium"><span className={`rounded-full px-2 py-1 ${certificate.active ? "bg-emerald-50 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>{certificate.active ? "Active" : "Inactive"}</span><span className="rounded-full bg-orange-50 px-2 py-1 text-orange-700">{certificate.orientation.toLowerCase()}</span><span className="flex items-center gap-1 text-[#5A5E55]"><Calendar className="h-3 w-3" />{new Date(certificate.issueDate).toLocaleDateString()}</span></div>
            <div className="mt-4 flex items-center gap-1">
              <IconButton label="Move up" disabled={index === 0} onClick={() => moveCertificate(certificate.id, -1)}><ArrowUp className="h-4 w-4" /></IconButton>
              <IconButton label="Move down" disabled={index === certificates.length - 1} onClick={() => moveCertificate(certificate.id, 1)}><ArrowDown className="h-4 w-4" /></IconButton>
              <span className="mx-1 h-5 w-px bg-gray-200" />
              <IconButton label="Edit certificate" onClick={() => openModal(certificate)}><Pencil className="h-4 w-4" /></IconButton>
              <IconButton label="Delete certificate" danger onClick={() => deleteCert(certificate.id)}><Trash2 className="h-4 w-4" /></IconButton>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

function IconButton({ label, onClick, disabled, danger, children }: { label: string; onClick: () => void; disabled?: boolean; danger?: boolean; children: React.ReactNode }) {
  return <button type="button" onClick={onClick} disabled={disabled} aria-label={label} title={label} className={`rounded-md p-2 disabled:opacity-30 ${danger ? "text-red-600 hover:bg-red-50" : "text-[#6d541b] hover:bg-[#fcf5e8]"}`}>{children}</button>;
}
