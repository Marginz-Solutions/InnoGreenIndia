# IGIM Portal — Next.js Migration Architecture Plan

## 1. Project Inventory & Analysis

### Pages Identified (15 HTML files → Routes)

| HTML File | Type | Complexity |
|---|---|---|
| `login.html` | Auth page | Low |
| `index.html` | Dashboard | Medium |
| `sheets.html` | Sheet index | Low |
| `clustered-route-map.html` | Map wrapper | Medium |
| `field-visit-route-map.html` | Map wrapper | Medium |
| `sheet-block-master.html` | Data sheet | Low |
| `sheet-cluster-master.html` | Data sheet | Low |
| `sheet-village-cluster-map.html` | Data sheet | Low |
| `sheet-cluster-opportunity.html` | Data sheet | Low |
| `sheet-cluster-map-view.html` | Data sheet | Low |
| `sheet-village-master.html` | Data sheet | Low |
| `sheet-village-scoring.html` | Data sheet | Low |
| `sheet-soil-guide.html` | Data sheet | Low |
| `sheet-igim-scoring.html` | Data sheet | Low |
| `sheet-crop-cluster-matrix.html` | Data sheet | Low |
| `sheet-cluster-product-priority.html` | Data sheet | Low |
| `sheet-crop-cluster-summary.html` | Data sheet | Low |
| `sheet-sources.html` | Placeholder | Trivial |
| `sheet-village-refs.html` | Placeholder | Trivial |
| `raw-clustered-route-map.html` | Leaflet map | High |
| `raw-field-visit-route-map.html` | Leaflet map | High |

---

## 2. Recommended Next.js Folder Structure

```
igim-portal/
├── app/
│   ├── layout.tsx                    # Root layout (topbar, footer, auth guard)
│   ├── page.tsx                      # → index.html (Dashboard)
│   ├── login/
│   │   └── page.tsx                  # → login.html
│   ├── sheets/
│   │   ├── page.tsx                  # → sheets.html (sheet index)
│   │   └── [sheetId]/
│   │       └── page.tsx              # → all sheet-*.html (dynamic route)
│   ├── maps/
│   │   ├── cluster/
│   │   │   └── page.tsx              # → clustered-route-map.html
│   │   └── field-route/
│   │       └── page.tsx              # → field-visit-route-map.html
│   └── globals.css
│
├── components/
│   ├── layout/
│   │   ├── Topbar.tsx                # Shared navigation header
│   │   ├── Footer.tsx                # Shared footer
│   │   └── AuthGuard.tsx             # Route protection wrapper
│   ├── ui/
│   │   ├── Button.tsx                # .btn, .btn.primary, .btn.secondary
│   │   ├── Badge.tsx                 # .badge
│   │   ├── Tag.tsx                   # .tag (inline-tags)
│   │   ├── Card.tsx                  # .card, .panel
│   │   ├── KpiCard.tsx               # .kpi
│   │   └── Note.tsx                  # .note
│   ├── sheets/
│   │   ├── SheetTable.tsx            # Table + search + CSV export
│   │   ├── SheetHeader.tsx           # Panel with title, description, row/col tags
│   │   └── SheetCard.tsx             # Card on sheets index page
│   ├── dashboard/
│   │   ├── HeroBanner.tsx            # .hero grid
│   │   ├── KpiRow.tsx                # .kpis grid
│   │   ├── ClusterSummaryTable.tsx   # summary-table on dashboard
│   │   └── PriorityActionList.tsx    # Priority action blocks
│   ├── maps/
│   │   ├── LeafletMapEmbed.tsx       # Iframe wrapper (SSR-safe)
│   │   └── LeafletMapDirect.tsx      # Direct Leaflet render (Phase 3)
│   └── auth/
│       └── LoginForm.tsx             # Login card form
│
├── sections/
│   ├── dashboard/
│   │   └── QuickNavSection.tsx       # Bottom quick navigation grid
│   └── sheets/
│       └── SheetGridSection.tsx      # Sheet card grid on /sheets
│
├── lib/
│   ├── auth.ts                       # Auth logic (localStorage wrapper)
│   ├── sheetData.ts                  # All hardcoded table data as typed arrays
│   ├── mapConfig.ts                  # Leaflet marker/polyline config data
│   └── constants.ts                  # IGIM_AUTH_KEY, routes, cluster names
│
├── hooks/
│   ├── useAuth.ts                    # Auth state, login, logout
│   ├── useTableFilter.ts             # filterTable() logic as hook
│   └── useTableExport.ts             # exportTableToCSV() logic as hook
│
├── services/
│   └── (empty for now)               # Future: API calls if backend added
│
├── context/
│   └── AuthContext.tsx               # Auth provider (wraps app layout)
│
├── utils/
│   ├── csvExport.ts                  # Pure CSV export utility
│   ├── tableFilter.ts                # Pure filter utility
│   └── formatters.ts                 # Any value formatting helpers
│
├── styles/
│   ├── variables.css                 # CSS custom properties (--bg, --brand, etc.)
│   └── components.css                # Any non-Tailwind overrides
│
└── public/
    ├── assets/
    │   └── igim-logo.png
    └── maps/
        ├── raw-clustered-route-map.html    # Kept as static HTML for iframe
        └── raw-field-visit-route-map.html  # Kept as static HTML for iframe
```

---

## 3. Component Breakdown & Route Mapping

### Routes

```
/               → app/page.tsx           (Dashboard)
/login          → app/login/page.tsx     (Login)
/sheets         → app/sheets/page.tsx    (Sheet index)
/sheets/[id]    → app/sheets/[id]/page.tsx  (Dynamic — all 13 data sheets)
/maps/cluster   → app/maps/cluster/page.tsx
/maps/field-route → app/maps/field-route/page.tsx
```

**Sheet ID mapping** (sheetId → data key):
```
block-master, cluster-master, village-cluster-map,
cluster-opportunity, cluster-map-view, village-master,
village-scoring, soil-guide, igim-scoring,
crop-cluster-matrix, cluster-product-priority,
crop-cluster-summary, read-me
```

All 13 sheet pages are structurally **identical** — a panel header, search bar, export button, and a scrollable table. This means **zero separate page files** are needed; one dynamic route `[sheetId]` handles all of them.

---

### Reusable Components Identified

**High reuse (used on every page):**
- `Topbar` — logo, brand text, nav links with active state
- `Footer` — single line text
- `AuthGuard` — wraps every non-login page

**Medium reuse (used on multiple pages):**
- `SheetTable` — search input + table + CSV export (used 13×)
- `SheetHeader` — title, description, row/col tag badges (used 13×)
- `Card` / `Panel` — layout containers (used everywhere)
- `Button` — primary, secondary, default variants

**Low reuse (dashboard-specific):**
- `KpiCard`, `KpiRow`
- `HeroBanner`
- `ClusterSummaryTable`
- `PriorityActionList`

---

## 4. JavaScript Logic → React Hooks

### `app.js` Function Migration

| Original Function | Migration Target | Notes |
|---|---|---|
| `ensureAuth()` | `AuthGuard.tsx` + `useAuth` hook | Runs on every protected route mount |
| `loginApp()` | `useAuth.login()` | Handles credential check + redirect |
| `logoutApp()` | `useAuth.logout()` | Clears storage + redirects |
| `filterTable()` | `useTableFilter` hook | Controlled input + filtered rows state |
| `exportTableToCSV()` | `useTableExport` hook + `csvExport.ts` util | Pure function, no DOM dependency |
| Active nav detection | Next.js `usePathname()` | Built-in, no manual logic needed |
| `DOMContentLoaded` | `useEffect` / Server Component hydration | Handled by React lifecycle |

### `useAuth` Hook Design

```typescript
// hooks/useAuth.ts
interface AuthState {
  isAuthenticated: boolean;
  login: (user: string, pass: string) => boolean;
  logout: () => void;
}
// Reads/writes localStorage, exposes state reactively
// AuthContext wraps app so any component can consume it
```

### `useTableFilter` Hook Design

```typescript
// hooks/useTableFilter.ts
function useTableFilter<T>(data: T[], searchFields: (keyof T)[]) {
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => /* filter logic */, [data, query]);
  return { query, setQuery, filtered };
}
```

### State Management Assessment

- **Auth state** → React Context (`AuthContext`) — lightweight, no Redux needed
- **Table filter state** → Local component state via `useTableFilter`
- **No global shared state** beyond auth is required at this scale
- **No server state/async** — all data is static/hardcoded currently

---

## 5. Third-Party & DOM Dependency Audit

### jQuery
- **Used only in**: `raw-clustered-route-map.html` and `raw-field-visit-route-map.html`
- **Usage pattern**: `$(\`<div ...>\`)[0]` — jQuery used purely to create DOM elements for Leaflet popups
- **Risk level**: Medium
- **Strategy**: These files are Folium-generated Python output. Keep them as **static HTML files** served from `/public/maps/`. Do NOT convert them to React. Embed via `<iframe>`.

### Leaflet.js
- **Used in**: Both raw map files
- **Version**: 1.9.3
- **Pattern**: Full Leaflet map initialization with markers, polylines, popups, tooltips, `fitBounds`
- **Risk level**: High for direct conversion
- **Strategy**: Phase 3 only — use `react-leaflet` if direct rendering is needed; for now, iframe approach is safe and correct

### Bootstrap
- **Used in**: Both raw map files only (JS bundle for potential tooltips)
- **NOT used** in main site CSS — the site has fully custom CSS
- **Strategy**: Do not install Bootstrap in Next.js project; it's only a Leaflet map dependency in static files

### Leaflet.awesome-markers
- **Used in**: Both raw map files
- **Strategy**: Stays in static files; not needed in Next.js

### Folium-generated HTML
- **Critical note**: `raw-clustered-route-map.html` and `raw-field-visit-route-map.html` are Python Folium outputs with auto-generated unique map IDs
- **Do NOT convert** these to React components in Phase 1 or 2
- These belong in `public/maps/` and are loaded via iframe

---

## 6. CSS Migration Strategy

### Current CSS Variables → Tailwind Config Extension

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      'brand':     '#1f7a36',
      'brand2':    '#5cab3d',
      'gold':      '#c9a646',
      'igim-bg':   '#07130b',
      'igim-bg2':  '#0e1f12',
      'panel':     '#102017',
      'muted':     '#61756a',
      'line':      '#dce8df',
    },
    borderRadius: {
      'card': '20px',
      'panel': '22px',
      'badge': '999px',
    },
  }
}
```

### CSS Migration Approach
- **Phase 1**: Keep `globals.css` with all existing CSS — zero Tailwind
- **Phase 2**: Add Tailwind, migrate UI components one-by-one
- **Phase 3**: Remove legacy CSS classes as components are fully migrated
- **Watermark effect** (body `::before`/`::after`) → keep in `globals.css`, difficult to replicate in Tailwind

### Component Naming Convention
```
PascalCase for components:     Topbar, SheetTable, KpiCard
camelCase for hooks:           useAuth, useTableFilter
camelCase for utils:           csvExport, tableFilter
kebab-case for routes/files:   /sheets/block-master
SCREAMING_SNAKE for constants: IGIM_AUTH_KEY, SHEET_ROUTE_MAP
```

---

## 7. SEO & Performance Structure

### Next.js Metadata
```typescript
// app/layout.tsx
export const metadata: Metadata = {
  title: 'IGIM Field & Retail Planning Portal',
  description: 'Operational portal for field execution, retail planning, and management review.',
}

// Per-page override example:
// app/sheets/[id]/page.tsx
export async function generateMetadata({ params }) {
  return { title: `${sheetTitle} | IGIM` }
}
```

### Rendering Strategy Per Route

| Route | Strategy | Reason |
|---|---|---|
| `/login` | Client Component | Uses localStorage, form state |
| `/` (Dashboard) | Server Component | Static data, no interactivity at layout level |
| `/sheets` | Server Component | Static list, no state |
| `/sheets/[id]` | Hybrid | Table is Client Component (filter/search); header is Server |
| `/maps/*` | Client Component | Iframe needs browser context |

### Performance Optimizations
- All 13 sheet data arrays extracted to `lib/sheetData.ts` — enables tree-shaking per route
- `next/image` for `igim-logo.png`
- Map pages: lazy-load iframe with `loading="lazy"` attribute
- `generateStaticParams()` for all sheet routes (fully static at build time)
- No external font imports needed (uses system `Inter, Segoe UI, Arial`)

---

## 8. Data Architecture

### Extracting Hardcoded Table Data

All table data is currently inline HTML. Extract to typed TypeScript:

```typescript
// lib/sheetData.ts

export interface BlockMasterRow {
  block: string;
  representativeVillages: string;
  majorCrops: string;
  horticultureStrength: string;
  // ... 16 more fields
}

export const BLOCK_MASTER_DATA: BlockMasterRow[] = [
  { block: 'Hosur', representativeVillages: 'Achettipalli; Bagaloor...', ... },
  // ... 9 more rows
];

export const SHEET_REGISTRY = {
  'block-master': {
    title: 'Block_Master',
    description: 'Krishnagiri block-wise master...',
    rows: 10,
    columns: 20,
    data: BLOCK_MASTER_DATA,
    columns: [...] // column definitions
  },
  // ... all 13 sheets
}
```

This unlocks `generateStaticParams`, typed filtering, and typed CSV export across all sheets.

---

## 9. Auth System Migration

### Current Implementation (Risk Area)
```javascript
// Current — credentials hardcoded in client-side JS
const IGIM_USER = 'SSFP';
const IGIM_PASS = 'Samrudhi@2026';
```

### Migration Approach
- **Short term**: Replicate exact same pattern in `lib/auth.ts` + `AuthContext` — same localStorage key, same credentials check
- **Critical warning**: Credentials remain visible in client bundle. This is acceptable only if this is an internal tool. Do not add sensitive data protection assumptions.
- **Long term** (Phase 4): Move to Next.js middleware-based auth or NextAuth.js with environment variables

```typescript
// lib/auth.ts
const CREDENTIALS = {
  user: process.env.NEXT_PUBLIC_IGIM_USER ?? 'SSFP',
  pass: process.env.NEXT_PUBLIC_IGIM_PASS ?? 'Samrudhi@2026'
}
// Move to .env.local for slight obfuscation — not true security
```

### Route Protection via Middleware
```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const isAuth = request.cookies.get('igim_auth')?.value === '1';
  const isLoginPage = request.nextUrl.pathname === '/login';
  if (!isAuth && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
}
export const config = { matcher: ['/((?!login|_next|public).*)'] };
```

---

## 10. Migration Phases

### Phase 1 — Foundation (Week 1)
**Goal**: Running Next.js app with existing CSS, no functionality broken

Tasks:
1. Initialize Next.js 14+ App Router project with TypeScript
2. Copy `assets/style.css` → `app/globals.css` (zero changes)
3. Copy `igim-logo.png` → `public/assets/`
4. Copy both raw map HTML files → `public/maps/`
5. Create `app/layout.tsx` with `Topbar` + `Footer` (plain HTML port)
6. Create `AuthContext` + `useAuth` hook (localStorage logic)
7. Create `AuthGuard` component
8. Port `login/page.tsx` — functional login with existing CSS classes
9. Port `app/page.tsx` — dashboard (static HTML port first)
10. Verify auth flow works end-to-end

**Complexity**: Low | **Risk**: Low

---

### Phase 2 — Sheet System (Week 2)
**Goal**: All 13 data sheets working via dynamic route

Tasks:
1. Extract all table data to `lib/sheetData.ts` with TypeScript types
2. Build `SheetTable` component with `useTableFilter` + `useTableExport`
3. Build `SheetHeader` component
4. Create `app/sheets/page.tsx` (sheet index)
5. Create `app/sheets/[id]/page.tsx` (dynamic route)
6. Add `generateStaticParams()` for all 13 sheet IDs
7. Verify search, export, and back-navigation work
8. Port `sheet-sources.html` and `sheet-village-refs.html` as simple stub pages

**Complexity**: Medium | **Risk**: Low

---

### Phase 3 — Map Pages (Week 2–3)
**Goal**: Both map pages render correctly

Tasks:
1. Create `app/maps/cluster/page.tsx` — iframe pointing to `/maps/raw-clustered-route-map.html`
2. Create `app/maps/field-route/page.tsx` — iframe wrapper
3. Ensure `next.config.js` does not interfere with serving static HTML from `public/`
4. Test iframe rendering in all target browsers
5. (Optional) Evaluate `react-leaflet` conversion for Phase 4

**Complexity**: Low (iframe approach) / High (direct Leaflet) | **Risk**: Medium

---

### Phase 4 — Component Refinement & Tailwind (Week 3–4)
**Goal**: Migrate CSS to Tailwind, extract all UI components

Tasks:
1. Install and configure Tailwind with IGIM color tokens
2. Migrate `Button`, `Badge`, `Tag`, `Card`, `KpiCard` to Tailwind
3. Migrate `Topbar`, `Footer` to Tailwind
4. Migrate `SheetTable`, `SheetHeader` to Tailwind
5. Migrate dashboard sections to Tailwind
6. Remove legacy CSS class dependencies progressively
7. Move credentials to `.env.local`

**Complexity**: Medium | **Risk**: Medium (visual regression risk)

---

### Phase 5 — Polish & Optimization (Week 4)
**Goal**: Production-ready build

Tasks:
1. Add `generateMetadata` for all routes
2. Add `next/image` for logo
3. Audit and remove unused CSS
4. Add loading states for map iframes
5. Verify mobile responsive behavior at all breakpoints
6. Add `middleware.ts` for server-side route protection
7. Run `next build` and fix any static generation issues
8. Performance audit

**Complexity**: Low | **Risk**: Low

---

## 11. Migration Risk Register

### High Risk

| Risk | Area | Mitigation |
|---|---|---|
| Leaflet SSR crash | Map pages | Mark map components `'use client'`, use dynamic import with `ssr: false` for any direct Leaflet usage |
| localStorage SSR crash | Auth | All localStorage access must be inside `useEffect` or checked with `typeof window !== 'undefined'` |
| Folium map unique IDs | Raw map HTML | Never rename or modify Folium-generated IDs; keep as static files |

### Medium Risk

| Risk | Area | Mitigation |
|---|---|---|
| iframe CSP headers | Maps | Ensure Next.js security headers don't block self-hosted iframes |
| Large table performance | Village_Cluster_Map (72 rows × 18 cols) | Use `useMemo` on filter, consider virtual scrolling for largest tables |
| CSS watermark effect | `body::before`/`::after` | Keep in `globals.css`; do not attempt Tailwind conversion |

### Low Risk

| Risk | Area | Mitigation |
|---|---|---|
| Active nav link | Topbar | Replace manual pathname detection with `usePathname()` from `next/navigation` |
| CSV export | SheetTable | `URL.createObjectURL` is client-only; wrap in `'use client'` component |

---

## 12. Do NOT Auto-Convert

The following should receive **manual attention only**:

1. **`raw-clustered-route-map.html`** and **`raw-field-visit-route-map.html`** — Folium-generated output with auto-generated unique DOM IDs and tightly coupled Leaflet initialization. Any automated conversion will break the map rendering. Keep as static files.

2. **Auth credential handling** — The hardcoded credentials in `app.js` must be manually reviewed and moved to environment variables before any deployment, not auto-generated into a component.

3. **`body::before` watermark pseudo-element** — The IGIM background watermark text effect uses `position: fixed` pseudo-elements on `body`. This cannot be expressed in Tailwind and must remain in `globals.css` with careful scoping in the Next.js layout.

4. **`exportTableToCSV` Blob logic** — The `URL.createObjectURL` + programmatic anchor click pattern is DOM-dependent. Must be manually wrapped in a `'use client'` component with proper cleanup (`URL.revokeObjectURL`).

5. **Dashboard KPI values** — The four KPI cards show hardcoded numbers (13 sheets, 6 clusters, 72 villages, 2 maps). These should be manually derived from `SHEET_REGISTRY` constants rather than hardcoded again.

---

## 13. Estimated Complexity Summary

| Module | Effort | Complexity |
|---|---|---|
| Auth system (login/logout/guard) | 0.5 day | Low |
| Topbar + Footer + Layout | 0.5 day | Low |
| Dashboard page | 1 day | Medium |
| Sheet data extraction (all 13) | 1.5 days | Medium |
| Dynamic sheet route + SheetTable | 1 day | Medium |
| Map pages (iframe approach) | 0.5 day | Low |
| Map pages (react-leaflet direct) | 3–4 days | High |
| Tailwind migration | 2 days | Medium |
| Auth hardening (env vars + middleware) | 0.5 day | Low |
| Testing + polish | 1 day | Low |
| **Total (iframe maps)** | **~8 days** | |
| **Total (direct Leaflet)** | **~13 days** | |
