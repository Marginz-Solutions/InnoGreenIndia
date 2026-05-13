
function isLoginPage(){ return /login\.html$/i.test(location.pathname); }
function ensureAuth(){
  if(isLoginPage()) return;
  location.replace('/login');
}
function loginApp(ev){
  if(ev) ev.preventDefault();
  location.replace('/login');
  return false;
}
function logoutApp(){
  location.replace('/login');
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
