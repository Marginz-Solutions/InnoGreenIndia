export interface MapMarker {
  position: [number, number];
  popup: string;
  tooltip: string;
  color: string;       // CSS color for divIcon background or awesome-marker color
  icon?: 'home' | 'numbered';
  number?: number;     // for numbered divIcon stops
}

export interface MapPolyline {
  positions: [number, number][];
  color: string;
  tooltip: string;
}

export interface MapConfig {
  center: [number, number];
  zoom: number;
  markers: MapMarker[];
  polylines: MapPolyline[];
  fitBounds: [number, number][];
  legend?: string; // raw HTML for the legend panel
}

// Cluster Route Map

export const CLUSTER_MAP: MapConfig = {
  center: [12.755355948888889, 77.86235068666666],
  zoom: 12,
  fitBounds: [
    [12.734639, 77.832611],
    [12.6746976, 77.8267098],
    [12.8367809, 77.846441],
    [12.83391854, 77.86979348],
    [12.7795, 77.8686],
    [12.7567464, 77.8624545],
    [12.6835983, 77.85923],
    [12.6863228, 77.8803164],
    [12.812, 77.915],
  ],
  legend: `<b>Clustered Route Plan from Exact Hosur Point</b><br>
Green = South / South-West Beat<br>
Blue = Central / West Beat<br>
Purple = North / North-East Beat<br><br>
<b>Cluster A - South / South-West Beat</b><br>
<table style="width:100%;border-collapse:collapse;">
  <tr><td>1. Onnalvadi</td><td style="text-align:right">7.8 km</td><td style="text-align:right">17 min</td></tr>
  <tr><td>2. Thorapalli Agraharam</td><td style="text-align:right">2.8 km</td><td style="text-align:right">6 min</td></tr>
  <tr><td>3. Achettipalli</td><td style="text-align:right">7.3 km</td><td style="text-align:right">16 min</td></tr>
</table>
Total: <b>17.9 km</b>, <b>39 min</b><br><br>
<b>Cluster B - Central / West Beat</b><br>
<table style="width:100%;border-collapse:collapse;">
  <tr><td>1. Kelavarapalli</td><td style="text-align:right">5.0 km</td><td style="text-align:right">11 min</td></tr>
  <tr><td>2. Chennasandiram</td><td style="text-align:right">3.2 km</td><td style="text-align:right">7 min</td></tr>
</table>
Total: <b>8.2 km</b>, <b>18 min</b><br><br>
<b>Cluster C - North / North-East Beat</b><br>
<table style="width:100%;border-collapse:collapse;">
  <tr><td>1. Bagaloor / Bagalur</td><td style="text-align:right">14.0 km</td><td style="text-align:right">30 min</td></tr>
  <tr><td>2. Belathur</td><td style="text-align:right">3.1 km</td><td style="text-align:right">7 min</td></tr>
  <tr><td>3. Thummanapalli</td><td style="text-align:right">6.7 km</td><td style="text-align:right">14 min</td></tr>
</table>
Total: <b>23.8 km</b>, <b>51 min</b><br><br>
<span style="color:#555;">Approximate local-road planning for beat scheduling.</span>`,
  polylines: [
    {
      positions: [[12.734639, 77.832611], [12.6835983, 77.85923], [12.6863228, 77.8803164], [12.6746976, 77.8267098]],
      color: 'green',
      tooltip: 'Cluster A - South / South-West Beat',
    },
    {
      positions: [[12.734639, 77.832611], [12.7567464, 77.8624545], [12.7795, 77.8686]],
      color: 'blue',
      tooltip: 'Cluster B - Central / West Beat',
    },
    {
      positions: [[12.734639, 77.832611], [12.8367809, 77.846441], [12.83391854, 77.86979348], [12.812, 77.915]],
      color: 'purple',
      tooltip: 'Cluster C - North / North-East Beat',
    },
  ],
  markers: [
    {
      position: [12.734639, 77.832611],
      color: 'red',
      icon: 'home',
      popup: 'Start: Your exact Hosur location<br>12.734639, 77.832611',
      tooltip: 'Start: Your exact Hosur location',
    },
    // Cluster A
    {
      position: [12.6835983, 77.85923],
      color: 'green',
      popup: '<b>Cluster A - South / South-West Beat</b><br>Stop 1: Onnalvadi<br>From: Start: Your exact Hosur location<br>Approx road leg: 7.8 km<br>Approx time: 17 min',
      tooltip: 'Cluster A - South / South-West Beat: 1. Onnalvadi',
    },
    {
      position: [12.6863228, 77.8803164],
      color: 'green',
      popup: '<b>Cluster A - South / South-West Beat</b><br>Stop 2: Thorapalli Agraharam<br>From: Onnalvadi<br>Approx road leg: 2.8 km<br>Approx time: 6 min',
      tooltip: 'Cluster A - South / South-West Beat: 2. Thorapalli Agraharam',
    },
    {
      position: [12.6746976, 77.8267098],
      color: 'green',
      popup: '<b>Cluster A - South / South-West Beat</b><br>Stop 3: Achettipalli<br>From: Thorapalli Agraharam<br>Approx road leg: 7.3 km<br>Approx time: 16 min',
      tooltip: 'Cluster A - South / South-West Beat: 3. Achettipalli',
    },
    // Cluster B
    {
      position: [12.7567464, 77.8624545],
      color: 'blue',
      popup: '<b>Cluster B - Central / West Beat</b><br>Stop 1: Kelavarapalli<br>From: Start: Your exact Hosur location<br>Approx road leg: 5.0 km<br>Approx time: 11 min',
      tooltip: 'Cluster B - Central / West Beat: 1. Kelavarapalli',
    },
    {
      position: [12.7795, 77.8686],
      color: 'blue',
      popup: '<b>Cluster B - Central / West Beat</b><br>Stop 2: Chennasandiram<br>From: Kelavarapalli<br>Approx road leg: 3.2 km<br>Approx time: 7 min',
      tooltip: 'Cluster B - Central / West Beat: 2. Chennasandiram',
    },
    // Cluster C
    {
      position: [12.8367809, 77.846441],
      color: 'purple',
      popup: '<b>Cluster C - North / North-East Beat</b><br>Stop 1: Bagaloor / Bagalur<br>From: Start: Your exact Hosur location<br>Approx road leg: 14.0 km<br>Approx time: 30 min',
      tooltip: 'Cluster C - North / North-East Beat: 1. Bagaloor / Bagalur',
    },
    {
      position: [12.83391854, 77.86979348],
      color: 'purple',
      popup: '<b>Cluster C - North / North-East Beat</b><br>Stop 2: Belathur<br>From: Bagaloor / Bagalur<br>Approx road leg: 3.1 km<br>Approx time: 7 min',
      tooltip: 'Cluster C - North / North-East Beat: 2. Belathur',
    },
    {
      position: [12.812, 77.915],
      color: 'purple',
      popup: '<b>Cluster C - North / North-East Beat</b><br>Stop 3: Thummanapalli<br>From: Belathur<br>Approx road leg: 6.7 km<br>Approx time: 14 min',
      tooltip: 'Cluster C - North / North-East Beat: 3. Thummanapalli',
    },
  ],
};

// ─── Field Visit Route Map ────────────────────────────────────────────────────

export const FIELD_VISIT_MAP: MapConfig = {
  center: [12.755355948888889, 77.86235068666666],
  zoom: 12,
  fitBounds: [
    [12.734639, 77.832611],
    [12.7567464, 77.8624545],
    [12.7795, 77.8686],
    [12.83391854, 77.86979348],
    [12.8367809, 77.846441],
    [12.812, 77.915],
    [12.6863228, 77.8803164],
    [12.6835983, 77.85923],
    [12.6746976, 77.8267098],
  ],
  legend: `<b>Dealer / field-visit route order</b><br>
Start point: 12.734639, 77.832611<br>
<div style="margin-top:6px;max-height:250px;overflow:auto;">
<table style="width:100%;border-collapse:collapse;">
<tr><th>#</th><th>From</th><th>To</th><th style="text-align:right">Approx road km</th><th style="text-align:right">Time</th></tr>
<tr><td>1</td><td>Start: Your exact Hosur location</td><td>Kelavarapalli</td><td style="text-align:right">5.0 km</td><td style="text-align:right">11 min</td></tr>
<tr><td>2</td><td>Kelavarapalli</td><td>Chennasandiram</td><td style="text-align:right">3.2 km</td><td style="text-align:right">7 min</td></tr>
<tr><td>3</td><td>Chennasandiram</td><td>Belathur</td><td style="text-align:right">7.4 km</td><td style="text-align:right">16 min</td></tr>
<tr><td>4</td><td>Belathur</td><td>Bagaloor / Bagalur</td><td style="text-align:right">3.1 km</td><td style="text-align:right">7 min</td></tr>
<tr><td>5</td><td>Bagaloor / Bagalur</td><td>Thummanapalli</td><td style="text-align:right">9.7 km</td><td style="text-align:right">21 min</td></tr>
<tr><td>6</td><td>Thummanapalli</td><td>Thorapalli Agraharam</td><td style="text-align:right">17.7 km</td><td style="text-align:right">38 min</td></tr>
<tr><td>7</td><td>Thorapalli Agraharam</td><td>Onnalvadi</td><td style="text-align:right">2.8 km</td><td style="text-align:right">6 min</td></tr>
<tr><td>8</td><td>Onnalvadi</td><td>Achettipalli</td><td style="text-align:right">4.5 km</td><td style="text-align:right">10 min</td></tr>
</table>
</div>
<div style="margin-top:6px;">
Approx total local route length: <b>53.4 km</b><br>
Approx total driving time: <b>116 min</b><br>
<span style="color:#555;">This is a practical visit-order map, not turn-by-turn routing.</span>
</div>`,
  polylines: [
    {
      positions: [
        [12.734639, 77.832611],
        [12.7567464, 77.8624545],
        [12.7795, 77.8686],
        [12.83391854, 77.86979348],
        [12.8367809, 77.846441],
        [12.812, 77.915],
        [12.6863228, 77.8803164],
        [12.6835983, 77.85923],
        [12.6746976, 77.8267098],
      ],
      color: '#3388ff',
      tooltip: 'Field Visit Route',
    },
  ],
  markers: [
    {
      position: [12.734639, 77.832611],
      color: 'red',
      icon: 'home',
      popup: 'Start: Your exact Hosur location<br>12.734639, 77.832611',
      tooltip: 'Start: Your exact Hosur location',
    },
    {
      position: [12.7567464, 77.8624545],
      color: '#1f4e79',
      icon: 'numbered',
      number: 1,
      popup: '<b>Stop 1: Kelavarapalli</b><br>Approx local road leg: 5.0 km<br>Approx drive time: 11 min',
      tooltip: '1. Kelavarapalli',
    },
    {
      position: [12.7795, 77.8686],
      color: '#1f4e79',
      icon: 'numbered',
      number: 2,
      popup: '<b>Stop 2: Chennasandiram</b><br>Approx local road leg: 3.2 km<br>Approx drive time: 7 min',
      tooltip: '2. Chennasandiram',
    },
    {
      position: [12.83391854, 77.86979348],
      color: '#1f4e79',
      icon: 'numbered',
      number: 3,
      popup: '<b>Stop 3: Belathur</b><br>Approx local road leg: 7.4 km<br>Approx drive time: 16 min',
      tooltip: '3. Belathur',
    },
    {
      position: [12.8367809, 77.846441],
      color: '#1f4e79',
      icon: 'numbered',
      number: 4,
      popup: '<b>Stop 4: Bagaloor / Bagalur</b><br>Approx local road leg: 3.1 km<br>Approx drive time: 7 min',
      tooltip: '4. Bagaloor / Bagalur',
    },
    {
      position: [12.812, 77.915],
      color: '#1f4e79',
      icon: 'numbered',
      number: 5,
      popup: '<b>Stop 5: Thummanapalli</b><br>Approx local road leg: 9.7 km<br>Approx drive time: 21 min',
      tooltip: '5. Thummanapalli',
    },
    {
      position: [12.6863228, 77.8803164],
      color: '#1f4e79',
      icon: 'numbered',
      number: 6,
      popup: '<b>Stop 6: Thorapalli Agraharam</b><br>Approx local road leg: 17.7 km<br>Approx drive time: 38 min',
      tooltip: '6. Thorapalli Agraharam',
    },
    {
      position: [12.6835983, 77.85923],
      color: '#1f4e79',
      icon: 'numbered',
      number: 7,
      popup: '<b>Stop 7: Onnalvadi</b><br>Approx local road leg: 2.8 km<br>Approx drive time: 6 min',
      tooltip: '7. Onnalvadi',
    },
    {
      position: [12.6746976, 77.8267098],
      color: '#1f4e79',
      icon: 'numbered',
      number: 8,
      popup: '<b>Stop 8: Achettipalli</b><br>Approx local road leg: 4.5 km<br>Approx drive time: 10 min',
      tooltip: '8. Achettipalli',
    },
  ],
};
