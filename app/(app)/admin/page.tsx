'use client';

export default function WebsiteCustomizationPage() {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <h1 className="text-2xl font-bold text-[#102018] mb-1">Admin Dashboard</h1>
          <p className="muted text-sm">Use the sidebar to manage brands, products, dealers, contacts, and pulse listings.</p>
        </div>
      </div>

      <div className="rounded-3xl border border-dashed border-[#e2ece3] bg-[#fafdf9] p-8 text-center text-[#61756a]">
        <p className="text-base font-medium mb-2">Nothing selected yet.</p>
        <p className="max-w-2xl mx-auto">Choose a page from the admin sidebar to open an editor for that content section.</p>
      </div>
    </div>
  );
}
