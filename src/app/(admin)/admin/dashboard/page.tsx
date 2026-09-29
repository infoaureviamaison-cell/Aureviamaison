import { redirect } from "next/navigation";
import { DashboardHeader } from "./_components/dashboard-header";
import { LowStockAlerts } from "./_components/low-stock-alerts";
import { RecentInquiriesWidget } from "./_components/recent-inquiries-widget";
import { RecentOrdersWidget } from "./_components/recent-orders-widget";
import { StatsCards } from "./_components/stats-cards";
import { getAdminUser, getDashboardData } from "./service";

export const dynamic = "force-dynamic";

const weeklyTrend = [42, 58, 47, 76, 68, 92, 89];
const revenueByChannel = [
  { label: "Website", value: 68, color: "#f6a45d" },
  { label: "Instagram", value: 46, color: "#C6A24A" },
  { label: "WhatsApp", value: 82, color: "#1f2937" },
  { label: "Marketplace", value: 33, color: "#d1d5db" },
];
const projectHealth = [
  { label: "Catalog health", value: 92, tone: "bg-[#f6a45d]" },
  { label: "Order fulfillment", value: 76, tone: "bg-[#C6A24A]" },
  { label: "Customer support", value: 88, tone: "bg-[#1a1308]" },
  { label: "Campaign readiness", value: 67, tone: "bg-[#d1d5db]" },
];
const topCategories = [
  { name: "Skin Care", amount: 28, accent: "#f6a45d" },
  { name: "Makeup", amount: 24, accent: "#C6A24A" },
  { name: "Accessories", amount: 18, accent: "#1a1308" },
  { name: "Wellness", amount: 14, accent: "#d6d3d1" },
];
const quickActions = [
  { name: "Review pending orders", href: "/admin/orders" },
  { name: "Update product catalog", href: "/admin/products" },
  { name: "Manage homepage hero", href: "/admin/hero" },
  { name: "Check customer inquiries", href: "/admin/inquiries" },
];

export default async function AdminDashboardPage() {
  const admin = await getAdminUser();
  if (!admin) redirect("/admin/login");

  const data = await getDashboardData();

  return (
    <main className="min-h-screen bg-[#fcf5e8] px-3 py-6 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-7xl space-y-6">
        <DashboardHeader />
        <StatsCards stats={data.stats} />

        <div className="grid gap-6 xl:grid-cols-[1.6fr_0.9fr]">
          <section className="rounded-[28px] border border-black/5 bg-white p-4 shadow-sm sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#5A5E55]">Performance</p>
                <h2 className="mt-2 text-xl font-semibold text-[#0a0a0a] sm:text-2xl">Sales overview</h2>
              </div>
              <div className="rounded-full border border-[#f6a45d]/30 bg-[#fff7ed] px-3 py-1.5 text-xs font-medium text-[#b25a00]">
                +18.4% vs last week
              </div>
            </div>

            <div className="mt-8 flex h-52 items-end gap-2 rounded-2xl bg-[#fffaf5] p-4">
              {weeklyTrend.map((value, index) => (
                <div key={index} className="flex flex-1 flex-col items-center justify-end gap-2">
                  <span className="text-[10px] text-[#5A5E55]">{value}k</span>
                  <div
                    className="w-full rounded-t-2xl bg-gradient-to-t from-[#f6a45d] via-[#f8bf7b] to-[#fbe4c5]"
                    style={{ height: `${value}%` }}
                  />
                  <span className="text-[10px] font-medium text-[#5A5E55]">
                    {"MTWTFSS".slice(index, index + 1)}
                  </span>
                </div>
              ))}
            </div>
          </section>

          <aside className="rounded-[28px] border border-black/5 bg-white p-4 shadow-sm sm:p-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#5A5E55]">Channels</p>
            <h3 className="mt-2 text-xl font-semibold text-[#0a0a0a]">Traffic mix</h3>
            <div className="mt-6 space-y-5">
              {revenueByChannel.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm text-[#0a0a0a]">
                    <span>{item.label}</span>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#f3f4f6]">
                    <div className="h-full rounded-full" style={{ width: `${item.value}%`, backgroundColor: item.color }} />
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <section className="rounded-[28px] border border-black/5 bg-white p-4 shadow-sm sm:p-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#5A5E55]">Health</p>
            <h3 className="mt-2 text-xl font-semibold text-[#0a0a0a]">Project health</h3>
            <div className="mt-6 space-y-4">
              {projectHealth.map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm text-[#0a0a0a]">
                    <span>{item.label}</span>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#f3f4f6]">
                    <div className={`h-full rounded-full ${item.tone}`} style={{ width: `${item.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-black/5 bg-white p-4 shadow-sm sm:p-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#5A5E55]">Categories</p>
            <h3 className="mt-2 text-xl font-semibold text-[#0a0a0a]">Best sellers</h3>
            <div className="mt-6 space-y-4">
              {topCategories.map((category) => (
                <div key={category.name}>
                  <div className="mb-2 flex items-center justify-between text-sm text-[#0a0a0a]">
                    <span>{category.name}</span>
                    <span className="font-medium">{category.amount}%</span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#f3f4f6]">
                    <div className="h-full rounded-full" style={{ width: `${category.amount}%`, backgroundColor: category.accent }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-black/5 bg-white p-4 shadow-sm sm:p-6">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-[#5A5E55]">Actions</p>
            <h3 className="mt-2 text-xl font-semibold text-[#0a0a0a]">Quick tasks</h3>
            <div className="mt-6 space-y-3">
              {quickActions.map((action) => (
                <a
                  key={action.name}
                  href={action.href}
                  className="flex items-center justify-between rounded-2xl border border-black/5 bg-[#faf9f7] px-3 py-3 text-sm font-medium text-[#0a0a0a] transition hover:border-[#f6a45d]/40 hover:bg-[#fff7ed]"
                >
                  <span>{action.name}</span>
                  <span aria-hidden="true">→</span>
                </a>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:mt-8 sm:gap-6 lg:grid-cols-2">
          <RecentOrdersWidget orders={data.recentOrders} />
          <RecentInquiriesWidget inquiries={data.recentInquiries} />
        </div>
        <LowStockAlerts products={data.lowStockProducts} />
      </div>
    </main>
  );
}
