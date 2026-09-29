import Image from "next/image";
import Link from "next/link";

export type CertificateLogo = {
  id: string;
  title: string;
  organizationName: string;
  organizationLogo: string;
};

export function CertificationsSlider({ certificates }: { certificates: CertificateLogo[] }) {
  const logos = certificates.filter((certificate) => certificate.organizationLogo);
  if (!logos.length) return null;
  const repeatedLogos = [...logos, ...logos];

  return (
    <section className="overflow-hidden bg-[#fcf5e8] py-12 sm:py-14" aria-labelledby="verified-organizations-title">
      <div className="mx-auto mb-8 max-w-7xl px-5 text-center">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-[#9a6911]">Trusted credentials</p>
        <h2 id="verified-organizations-title" className="mt-2 font-serif text-2xl font-extrabold text-[#1a1308] sm:text-3xl">Verified By Organizations</h2>
        <p className="mx-auto mt-2 max-w-2xl text-sm leading-6 text-[#5A5E55]">Explore the independent organizations and credentials that support our commitment to quality and authenticity.</p>
      </div>

      <Link href="/certificates" className="group block" aria-label="View all Auerviamaison certificates">
        <div className="relative overflow-hidden">
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-[#fcf5e8] to-transparent sm:w-28" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-[#fcf5e8] to-transparent sm:w-28" />
          <div className="certificate-logo-marquee flex w-max items-center gap-8 pr-8 sm:gap-12 sm:pr-12">
            {repeatedLogos.map((certificate, index) => (
              <div key={`${certificate.id}-${index}`} className="flex h-24 w-40 shrink-0 items-center justify-center rounded-xl bg-white/80 px-5 transition group-hover:bg-white sm:h-28 sm:w-48">
                <Image src={certificate.organizationLogo} alt={`${certificate.organizationName} logo`} width={150} height={72} className="max-h-16 w-auto max-w-full object-contain grayscale transition duration-300 group-hover:grayscale-0" />
              </div>
            ))}
          </div>
        </div>
      </Link>
    </section>
  );
}
