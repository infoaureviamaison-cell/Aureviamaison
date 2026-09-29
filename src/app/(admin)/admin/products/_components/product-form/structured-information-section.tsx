"use client";

import { Plus, Trash2 } from "@esmate/shadcn/pkgs/lucide-react";
import type { ProductFaq } from "./types";
import type { ProductSectionProps } from "./section-types";
import { generateId } from "./utils";

const inputClass = "mt-1.5 w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm focus:border-[#f6a45d] focus:outline-none focus:ring-2 focus:ring-[#f6a45d]/40";
const smallButtonClass = "inline-flex items-center gap-1.5 rounded-lg border border-[#C6A24A]/30 bg-white px-3 py-2 text-xs font-semibold text-gray-800 hover:bg-[#fcf5e8]";

export function StructuredInformationSection({ values, setValues }: ProductSectionProps) {
  const specificationRows = Object.entries(values.specifications);

  const updateSpecification = (oldLabel: string, label: string, value: string) => {
    setValues((current) => {
      const entries = Object.entries(current.specifications).map(([key, existingValue]) =>
        key === oldLabel ? [label, value] : [key, existingValue],
      );
      return { ...current, specifications: Object.fromEntries(entries) };
    });
  };

  const updateFaq = (id: string, patch: Partial<ProductFaq>) => {
    setValues((current) => ({
      ...current,
      faqs: current.faqs.map((faq) => (faq.id === id ? { ...faq, ...patch } : faq)),
    }));
  };

  return (
    <section className="space-y-6 rounded-xl border border-[#C6A24A]/25 bg-[#fcf5e8]/50 p-4 lg:col-span-2 md:p-6">
      <div>
        <h2 className="font-bold text-gray-950">Structured Product Information</h2>
        <p className="mt-1 text-xs text-gray-500">Use Additional Details for benefits, ingredients, usage, stories, materials, and other flexible content.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <TextField label="Net Weight" value={values.netWeight || ""} placeholder="e.g., 500 g" onChange={(netWeight) => setValues((current) => ({ ...current, netWeight }))} />
        <TextField label="Origin" value={values.origin || ""} placeholder="e.g., Himalayan region, Pakistan" onChange={(origin) => setValues((current) => ({ ...current, origin }))} />
        <TextField label="Shelf Life" value={values.shelfLife || ""} placeholder="e.g., 24 months" onChange={(shelfLife) => setValues((current) => ({ ...current, shelfLife }))} />
      </div>

      <EditorGroup title="Packaging Sizes" description="Add each available pack or trade size as a separate row.">
        <div className="space-y-2">
          {values.packagingSizes.map((size, index) => (
            <div key={index} className="flex gap-2">
              <input
                aria-label={`Packaging size ${index + 1}`}
                className={inputClass.replace("mt-1.5 ", "")}
                value={size}
                placeholder="e.g., 250 g pouch"
                onChange={(event) => setValues((current) => ({ ...current, packagingSizes: current.packagingSizes.map((item, itemIndex) => itemIndex === index ? event.target.value : item) }))}
              />
              <RemoveButton label={`Remove packaging size ${index + 1}`} onClick={() => setValues((current) => ({ ...current, packagingSizes: current.packagingSizes.filter((_, itemIndex) => itemIndex !== index) }))} />
            </div>
          ))}
          <button type="button" className={smallButtonClass} onClick={() => setValues((current) => ({ ...current, packagingSizes: [...current.packagingSizes, ""] }))}>
            <Plus className="h-3.5 w-3.5" /> Add Packaging Size
          </button>
        </div>
      </EditorGroup>

      <EditorGroup title="Specifications" description="Reusable label and value rows displayed as a consistent table.">
        <div className="space-y-2">
          {specificationRows.map(([label, value], index) => (
            <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <input aria-label={`Specification ${index + 1} label`} className={inputClass.replace("mt-1.5 ", "")} value={label} placeholder="Label" onChange={(event) => updateSpecification(label, event.target.value, value)} />
              <input aria-label={`Specification ${index + 1} value`} className={inputClass.replace("mt-1.5 ", "")} value={value} placeholder="Value" onChange={(event) => updateSpecification(label, label, event.target.value)} />
              <RemoveButton label={`Remove specification ${index + 1}`} onClick={() => setValues((current) => ({ ...current, specifications: Object.fromEntries(Object.entries(current.specifications).filter(([key]) => key !== label)) }))} />
            </div>
          ))}
          <button type="button" className={smallButtonClass} onClick={() => {
            let label = "New specification";
            let suffix = 2;
            while (label in values.specifications) label = `New specification ${suffix++}`;
            setValues((current) => ({ ...current, specifications: { ...current.specifications, [label]: "" } }));
          }}>
            <Plus className="h-3.5 w-3.5" /> Add Specification
          </button>
        </div>
      </EditorGroup>

      <EditorGroup title="Frequently Asked Questions" description="Questions appear in an accessible accordion on the product page.">
        <div className="space-y-3">
          {values.faqs.map((faq, index) => (
            <div key={faq.id} className="relative rounded-lg border border-[#C6A24A]/20 bg-white p-4">
              <div className="absolute right-3 top-3"><RemoveButton label={`Remove FAQ ${index + 1}`} onClick={() => setValues((current) => ({ ...current, faqs: current.faqs.filter((item) => item.id !== faq.id) }))} /></div>
              <p className="mb-3 pr-12 text-xs font-semibold text-gray-500">FAQ {index + 1}</p>
              <div className="space-y-3">
                <TextField label="Question" value={faq.question} placeholder="What would customers like to know?" onChange={(question) => updateFaq(faq.id, { question })} />
                <label className="block text-xs font-semibold text-gray-700">Answer<textarea className={`${inputClass} resize-y`} rows={3} value={faq.answer} placeholder="Provide a clear answer" onChange={(event) => updateFaq(faq.id, { answer: event.target.value })} /></label>
              </div>
            </div>
          ))}
          <button type="button" className={smallButtonClass} onClick={() => setValues((current) => ({ ...current, faqs: [...current.faqs, { id: generateId(), question: "", answer: "" }] }))}>
            <Plus className="h-3.5 w-3.5" /> Add FAQ
          </button>
        </div>
      </EditorGroup>

      <label className="flex items-start gap-3 rounded-lg border border-[#C6A24A]/25 bg-white p-4">
        <input type="checkbox" className="mt-0.5 h-4 w-4 accent-[#f6a45d]" checked={values.wholesaleQuoteEnabled} onChange={(event) => setValues((current) => ({ ...current, wholesaleQuoteEnabled: event.target.checked }))} />
        <span><span className="block text-sm font-semibold text-gray-900">Enable Request Wholesale Quote</span><span className="mt-1 block text-xs text-gray-500">Shows product-aware WhatsApp and contact options on the public product page.</span></span>
      </label>
    </section>
  );
}

function TextField({ label, value, placeholder, onChange }: { label: string; value: string; placeholder: string; onChange: (value: string) => void }) {
  return <label className="block text-xs font-semibold text-gray-700">{label}<input className={inputClass} value={value} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} /></label>;
}

function EditorGroup({ title, description, children }: { title: string; description: string; children: React.ReactNode }) {
  return <div className="space-y-3 rounded-lg border border-[#C6A24A]/20 bg-white/70 p-4"><div><h3 className="text-sm font-semibold text-gray-900">{title}</h3><p className="mt-0.5 text-xs text-gray-500">{description}</p></div>{children}</div>;
}

function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return <button type="button" aria-label={label} title={label} onClick={onClick} className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600 hover:bg-red-100"><Trash2 className="h-4 w-4" /></button>;
}
