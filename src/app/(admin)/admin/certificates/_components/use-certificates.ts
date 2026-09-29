"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { reorderCertificates } from "../actions";
import type { Certificate, CertificateFormData } from "./types";

const today = () => new Date().toISOString().slice(0, 10);
const emptyForm = (): CertificateFormData => ({
  title: "",
  shortDescription: "",
  organizationName: "",
  organizationLogo: "",
  certificateImage: "",
  orientation: "LANDSCAPE",
  issueDate: today(),
  expiryDate: "",
  certificateNumber: "",
  verificationUrl: "",
  displayOrder: 0,
  active: true,
  featured: false,
});

export function useCertificates() {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingCert, setEditingCert] = useState<Certificate | null>(null);
  const [formData, setFormData] = useState<CertificateFormData>(emptyForm);

  useEffect(() => { void fetchCertificates(); }, []);

  async function fetchCertificates() {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/certificates");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to load certificates");
      setCertificates(data.certificates || []);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to load certificates");
    } finally {
      setLoading(false);
    }
  }

  async function deleteCert(id: string) {
    if (!confirm("Delete this certificate? This cannot be undone.")) return;
    const res = await fetch(`/api/admin/certificates/${id}`, { method: "DELETE" });
    if (!res.ok) return toast.error("Failed to delete certificate");
    setCertificates((items) => items.filter((certificate) => certificate.id !== id));
    toast.success("Certificate deleted");
  }

  function openModal(cert?: Certificate) {
    setEditingCert(cert ?? null);
    setFormData(cert ? {
      title: cert.title,
      shortDescription: cert.shortDescription || "",
      organizationName: cert.organizationName,
      organizationLogo: cert.organizationLogo,
      certificateImage: cert.certificateImage,
      orientation: cert.orientation,
      issueDate: cert.issueDate.slice(0, 10),
      expiryDate: cert.expiryDate?.slice(0, 10) || "",
      certificateNumber: cert.certificateNumber || "",
      verificationUrl: cert.verificationUrl || "",
      displayOrder: cert.displayOrder,
      active: cert.active,
      featured: cert.featured,
    } : { ...emptyForm(), displayOrder: certificates.length });
    setShowModal(true);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(editingCert ? `/api/admin/certificates/${editingCert.id}` : "/api/admin/certificates", {
        method: editingCert ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to save certificate");
      setShowModal(false);
      await fetchCertificates();
      toast.success(editingCert ? "Certificate updated" : "Certificate created");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to save certificate");
    } finally {
      setSaving(false);
    }
  }

  async function moveCertificate(id: string, direction: -1 | 1) {
    const index = certificates.findIndex((certificate) => certificate.id === id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= certificates.length) return;
    const reordered = [...certificates];
    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];
    setCertificates(reordered.map((certificate, displayOrder) => ({ ...certificate, displayOrder })));
    try {
      await reorderCertificates(reordered.map((certificate) => certificate.id));
    } catch {
      toast.error("Unable to reorder certificates");
      await fetchCertificates();
    }
  }

  return { certificates, loading, saving, showModal, setShowModal, editingCert, formData, setFormData, openModal, onSubmit, deleteCert, moveCertificate };
}
