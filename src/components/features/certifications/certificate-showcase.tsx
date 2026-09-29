"use client";

import Image from "next/image";
import Link from "next/link";
import { Award, ExternalLink, SearchCheck, ShieldCheck, X } from "@esmate/shadcn/pkgs/lucide-react";
import { useEffect, useState } from "react";

export type PublicCertificate = {
  id: string;
  title: string;
  shortDescription: string | null;
  organizationName: string;
  organizationLogo: string;
  certificateImage: string;
  orientation: string;
  issueDate: string;
  expiryDate: string | null;
  certificateNumber: string | null;
  verificationUrl: string | null;
  featured: boolean;
};

export function CertificateShowcase({ certificates }: { certificates: PublicCertificate[] }) {
  const [selected, setSelected] = useState<PublicCertificate | null>(null);
  const featured = certificates.find((certificate) => certificate.featured) || certificates[0];

  useEffect(() => {
    if (!selected) return;
    const close = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", close);
    return () => { document.body.style.overflow = previousOverflow; window.removeEventListener("keydown", close); };
  }, [selected]);

  return (
    <main className="bg-gray-50 text-gray-900">
      <section className="relative overflow-hidden border-b border-[#C6A24A]/35 bg-[#fcf5e8] px-5 py-20 sm:py-24">
        <div className="absolute right-0 top-0 -mr-32 -mt-32 h-80 w-80 rounded-full bg-[#C6A24A]/25 blur-3xl" /><div className="absolute bottom-0 left-0 -mb-32 -ml-32 h-80 w-80 rounded-full bg-[#f6a45d]/20 blur-3xl" />
        <div className="relative mx-auto max-w-5xl text-center"><span className="inline-flex items-center gap-2 rounded-full border border-[#C6A24A]/50 bg-[#C6A24A]/15 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-[#b57910]"><ShieldCheck className="h-4 w-4" /> Trust &amp; authenticity</span><h1 className="mt-6 font-serif text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl">Certificates you can verify</h1><p className="mx-auto mt-5 max-w-3xl text-base leading-7 text-gray-700 sm:text-lg">Our credentials reflect independent recognition, responsible standards and the transparent quality practices behind Auerviamaison.</p></div>
      </section>

      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-18">
        <div className="mx-auto max-w-3xl text-center"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a6911]">Built on confidence</p><h2 className="mt-2 font-serif text-3xl font-extrabold">Trust should be visible</h2><p className="mt-4 leading-7 text-[#5A5E55]">We publish our certificates so customers, wholesale partners and institutions can review the organizations, dates and verification details connected to our credentials.</p></div>

        {featured ? <article className="mt-12 grid overflow-hidden rounded-2xl border border-[#C6A24A]/20 bg-white text-gray-900 shadow-lg md:grid-cols-2">
          <button type="button" onClick={() => setSelected(featured)} className={`relative min-h-72 bg-white ${featured.orientation === "PORTRAIT" ? "md:min-h-[520px]" : "md:min-h-[390px]"}`} aria-label={`Open ${featured.title}`}><Image src={featured.certificateImage} alt={featured.title} fill className="object-contain p-4 sm:p-6" sizes="(max-width: 768px) 100vw, 50vw" /></button>
          <div className="flex flex-col justify-center p-7 sm:p-10"><span className="flex w-fit items-center gap-2 rounded-full bg-[#ffedd5] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#ea580c]"><Award className="h-4 w-4" /> Featured certificate</span><Organization certificate={featured} /><h2 className="mt-6 font-serif text-3xl font-extrabold text-gray-900">{featured.title}</h2><p className="mt-4 leading-7 text-gray-600">{featured.shortDescription || "A verified Auerviamaison credential supporting our commitment to quality and trust."}</p><CertificateMeta certificate={featured} />{featured.verificationUrl ? <a href={featured.verificationUrl} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-[#f6a45d] px-5 py-3 text-sm font-bold text-white hover:bg-[#d8861f]">Verify certificate <ExternalLink className="h-4 w-4" /></a> : null}</div>
        </article> : null}

        <div className="mt-14"><div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9a6911]">Credentials gallery</p><h2 className="mt-2 font-serif text-3xl font-extrabold">Our certificates</h2></div><p className="text-sm text-[#5A5E55]">Select any certificate to inspect it closely.</p></div>
          {certificates.length ? <div className="mt-7 grid items-start gap-6 sm:grid-cols-2 lg:grid-cols-3">{certificates.map((certificate) => <CertificateCard key={certificate.id} certificate={certificate} onOpen={() => setSelected(certificate)} />)}</div> : <div className="mt-8 rounded-xl border border-dashed border-[#C6A24A]/40 bg-white p-10 text-center text-[#5A5E55]">Certificate records are being prepared.</div>}
        </div>
      </section>

      <section className="border-y border-[#C6A24A]/20 bg-white px-5 py-14"><div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-3"><Credibility icon={ShieldCheck} title="Transparent credentials">Dates, numbers and issuing organizations are presented clearly.</Credibility><Credibility icon={SearchCheck} title="Verification ready">Where an issuer provides online verification, we link directly to it.</Credibility><Credibility icon={Award} title="Quality commitment">Our credentials reinforce ongoing product and service standards.</Credibility></div></section>

      <section className="bg-[#fcf5e8] px-5 py-16 text-center"><SearchCheck className="mx-auto h-10 w-10 text-[#f6a45d]" /><h2 className="mt-4 font-serif text-3xl font-extrabold text-gray-900">Need to verify a credential?</h2><p className="mx-auto mt-3 max-w-2xl text-gray-600">Open a certificate above, use its verification link, or contact our team for supporting information.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Link href="/contact" className="rounded-lg bg-[#f6a45d] px-6 py-3 text-sm font-bold text-white hover:bg-[#d8861f]">Contact Auerviamaison</Link><Link href="/products" className="rounded-lg border border-[#C6A24A]/40 bg-white px-6 py-3 text-sm font-bold text-gray-900">Explore our products</Link></div></section>

      {selected ? <CertificateLightbox certificate={selected} onClose={() => setSelected(null)} /> : null}
    </main>
  );
}

function CertificateCard({ certificate, onOpen }: { certificate: PublicCertificate; onOpen: () => void }) {
  return <article className="overflow-hidden rounded-2xl border border-[#C6A24A]/20 bg-white"><button type="button" onClick={onOpen} className={`relative block w-full bg-[#f4f1e8] ${certificate.orientation === "PORTRAIT" ? "aspect-[3/4]" : "aspect-[4/3]"}`}><Image src={certificate.certificateImage} alt={certificate.title} fill className="object-contain p-3 transition duration-500 hover:scale-[1.02]" sizes="(max-width: 640px) 100vw, 33vw" /></button><div className="p-5"><Organization certificate={certificate} /><h3 className="mt-4 font-serif text-xl font-bold">{certificate.title}</h3><p className="mt-2 line-clamp-2 text-sm leading-6 text-[#5A5E55]">{certificate.shortDescription || "Verified Auerviamaison credential."}</p><CertificateMeta certificate={certificate} /></div></article>;
}

function Organization({ certificate }: { certificate: PublicCertificate }) {
  return <div className="mt-5 flex items-center gap-3">{certificate.organizationLogo ? <div className="relative h-10 w-14 shrink-0 rounded bg-white"><Image src={certificate.organizationLogo} alt={`${certificate.organizationName} logo`} fill className="object-contain p-1" sizes="56px" /></div> : null}<span className="text-sm font-semibold">{certificate.organizationName}</span></div>;
}

function CertificateMeta({ certificate, light = false }: { certificate: PublicCertificate; light?: boolean }) {
  const color = light ? "text-white/65" : "text-[#5A5E55]";
  return <dl className={`mt-4 grid gap-1 text-xs ${color}`}><div><dt className="inline font-semibold">Issued: </dt><dd className="inline">{new Date(certificate.issueDate).toLocaleDateString()}</dd></div>{certificate.expiryDate ? <div><dt className="inline font-semibold">Expires: </dt><dd className="inline">{new Date(certificate.expiryDate).toLocaleDateString()}</dd></div> : null}{certificate.certificateNumber ? <div><dt className="inline font-semibold">Certificate no: </dt><dd className="inline">{certificate.certificateNumber}</dd></div> : null}</dl>;
}

function Credibility({ icon: Icon, title, children }: { icon: typeof ShieldCheck; title: string; children: React.ReactNode }) {
  return <div className="text-center"><Icon className="mx-auto h-8 w-8 text-[#b57910]" /><h3 className="mt-3 font-serif text-xl font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#5A5E55]">{children}</p></div>;
}

function CertificateLightbox({ certificate, onClose }: { certificate: PublicCertificate; onClose: () => void }) {
  return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-3 sm:p-8" role="dialog" aria-modal="true" aria-label={certificate.title} onClick={onClose}><button type="button" onClick={onClose} className="absolute right-4 top-4 z-10 rounded-full bg-white p-3 text-black" aria-label="Close certificate"><X className="h-5 w-5" /></button><div className="relative h-full w-full max-w-6xl" onClick={(event) => event.stopPropagation()}><Image src={certificate.certificateImage} alt={certificate.title} fill className="object-contain" sizes="100vw" priority /></div></div>;
}
