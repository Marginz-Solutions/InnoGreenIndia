
const IGIM_AUTH_KEY = 'igim_auth_ok';
const IGIM_USER = 'SSFP';
const IGIM_PASS = 'Samrudhi@2026';

function isLoginPage(){ return /login\.html$/i.test(location.pathname); }
function ensureAuth(){
  if(isLoginPage()) return;
  const ok = localStorage.getItem(IGIM_AUTH_KEY) === '1';
  if(!ok){ location.replace('login.html'); }
}
function loginApp(ev){
  if(ev) ev.preventDefault();
  const u = (document.getElementById('userid')||{}).value || '';
  const p = (document.getElementById('password')||{}).value || '';
  const err = document.getElementById('login-error');
  if(u === IGIM_USER && p === IGIM_PASS){
    localStorage.setItem(IGIM_AUTH_KEY,'1');
    location.replace('index.html');
  }else if(err){
    err.style.display='block';
  }
  return false;
}
function logoutApp(){
  localStorage.removeItem(IGIM_AUTH_KEY);
  location.replace('login.html');
}
function filterTable(inputId, tableId){
  const q=(document.getElementById(inputId)?.value||'').toLowerCase();
  const rows=document.querySelectorAll(`#${tableId} tbody tr`);
  rows.forEach(tr=>{
    const txt=tr.innerText.toLowerCase();
    tr.style.display = txt.includes(q)?'':'none';
  });
}
function exportTableToCSV(tableId, filename){
  const rows=[...document.querySelectorAll(`#${tableId} tr`)];
  const csv=rows.map(r=>[...r.children].map(td=>`"${(td.innerText||'').replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a'); a.href=url; a.download=filename; a.click(); URL.revokeObjectURL(url);
}
window.addEventListener('DOMContentLoaded', ()=>{
  ensureAuth();
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav a').forEach(a=>{
    const href = a.getAttribute('href');
    if(href && href === current){ a.classList.add('active'); }
  });
});
