'use client';

import Link from 'next/link';
import { AuthGuard } from '@/components/auth-guard';
import { Topbar } from '@/components/topbar';
import { Footer } from '@/components/footer';
import { CLUSTER_SUMMARY_DATA, PRIORITY_BLOCKS, KPI_VALUES } from '@/lib/sheet-registry';

export default function DashboardPage() {
  return (
    <AuthGuard>
      <Topbar />
      <div className="container">
        <div className="hero">
          <div className="panel dark">
            <h2>Branded IGIM operational command center</h2>
            <p>
              This web app is structured for daily field execution, retail territory planning, and management review. 
              Teams can browse planning sheets, open route maps, review commercial clusters, and use the portal as a single branded IGIM workspace.
            </p>
            <div className="inline-tags">
              <span className="tag">Field staff</span>
              <span className="tag">Retail planning</span>
              <span className="tag">Management review</span>
              <span className="tag">IGIM branded</span>
            </div>
            <div className="quick-actions">
              <Link className="btn primary" href="/sheets">Open planning sheets</Link>
              <Link className="btn" href="/maps/cluster">Open clustered route map</Link>
              <Link className="btn" href="/maps/field-visit">Open field route map</Link>
            </div>
          </div>
          <div className="panel">
            <h2>Management quick view</h2>
            <div className="list">
              <div className="item">
                <strong>Daily use</strong><br />
                <span className="muted">Field staff can search every planning sheet and export filtered views to CSV.</span>
              </div>
              <div className="item">
                <strong>Retail planning</strong><br />
                <span className="muted">Cluster opportunity and product-priority views support stocking and campaign decisions.</span>
              </div>
              <div className="item">
                <strong>Beat execution</strong><br />
                <span className="muted">Cluster and visit-route maps are available in branded portal pages.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="kpis">
          <div className="kpi">
            <div className="label">Planning sheets</div>
            <div className="value">{KPI_VALUES.sheets}</div>
          </div>
          <div className="kpi">
            <div className="label">Commercial clusters</div>
            <div className="value">{KPI_VALUES.clusters}</div>
          </div>
          <div className="kpi">
            <div className="label">Mapped villages</div>
            <div className="value">{KPI_VALUES.villages}</div>
          </div>
          <div className="kpi">
            <div className="label">Operational maps</div>
            <div className="value">{KPI_VALUES.maps}</div>
          </div>
        </div>

        <div className="grid1">
          <div className="card col-8">
            <h2>Cluster commercial summary</h2>
            <p className="muted">Quick management view of commercial focus by cluster.</p>
            <div className="table-wrap">
              <table id="summary-table">
                <thead>
                  <tr>
                    <th>Cluster</th>
                    <th>No. of mapped villages</th>
                    <th>Dominant crops</th>
                    <th>Top product buckets</th>
                    <th>Best commercial crop groups</th>
                    <th>Avg input intensity</th>
                    <th>Avg risk-adjusted business score</th>
                    <th>Top channel strategy</th>
                    <th>Priority season/campaign</th>
                    <th>Remarks</th>
                  </tr>
                </thead>
                <tbody>
                  {CLUSTER_SUMMARY_DATA.map((row) => (
                    <tr key={row.cluster}>
                      <td>{row.cluster}</td>
                      <td>{row.villages}</td>
                      <td>{row.crops}</td>
                      <td>{row.products}</td>
                      <td>{row.bestCrops}</td>
                      <td>{row.inputIntensity}</td>
                      <td>{row.riskScore}</td>
                      <td>{row.strategy}</td>
                      <td>{row.season}</td>
                      <td>{row.remarks}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card col-4">
            <h2>Priority action blocks</h2>
            <div className="list">
              {PRIORITY_BLOCKS.map((block) => (
                <div className="item" key={block.name}>
                  <strong>{block.name}</strong><br />
                  <span className="badge">{block.score} dealer opportunity</span>
                  <div className="muted" style={{ marginTop: '8px' }}>{block.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="card col-12">
            <h2>Quick navigation</h2>
            <div className="sheet-grid">
              <div className="sheet-card">
                <h3>Planning Sheets</h3>
                <p className="muted">Open all sheet pages converted from the workbook for search and export.</p>
                <div style={{ marginTop: '14px' }}>
                  <Link className="btn primary" href="/sheets">Open sheet center</Link>
                </div>
              </div>
              <div className="sheet-card">
                <h3>Cluster Route Map</h3>
                <p className="muted">Branded route page for cluster-based field movement and beat planning.</p>
                <div style={{ marginTop: '14px' }}>
                  <Link className="btn primary" href="/maps/cluster">Open cluster map</Link>
                </div>
              </div>
              <div className="sheet-card">
                <h3>Field Visit Route Map</h3>
                <p className="muted">Practical visit-order route page for field staff execution planning.</p>
                <div style={{ marginTop: '14px' }}>
                  <Link className="btn primary" href="/maps/field-visit">Open field route map</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </AuthGuard>
  );
}
