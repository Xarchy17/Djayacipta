/* ===== EDIT DI SINI ===== */
var CFG={nama:'Jasa Sumur Bos Djaya Cipta',wa:'6282116009146',tampil:'0821-1600-9146',area:'Cipatat, Kabupaten Bandung Barat, Jawa Barat',mapsKey:'',aiUrl:'/api/ai'}
/* aiUrl: '/api/ai' untuk Vercel, '/.netlify/functions/ai' untuk Netlify; alamat fungsi AI (kosongkan untuk mematikan fitur AI). mapsKey: isi API key Google Maps (Maps JavaScript API) supaya pin di Cek Titik bisa digeser/diklik */;
/* Portofolio: i=nama file di /img, t=judul, c=tantangan, k=kenapa metode ini */
var P=[
{i:'gang',t:'Sumur bor di gang sempit',c:'Lahan hanya selebar gang di antara dua bangunan.',k:'Mesin bor tegak yang ramping dipilih supaya muat dan tidak mengganggu bangunan sekitar.'},
{i:'rumah-1',t:'Pengeboran di area dalam bangunan',c:'Ruang kerja terbatas dan lantai harus tetap aman.',k:'Mesin diletakkan di atas balok kayu agar beban menyebar dan mata bor tetap lurus.'},
{i:'rumah-2',t:'Mesin hidrolik untuk lahan terbatas',c:'Tidak ada ruang untuk rig besar.',k:'Tenaga hidrolik memberi tekanan stabil dengan ukuran mesin yang ringkas.'},
{i:'lereng-1',t:'Pengeboran di dinding tebing',c:'Medan curam dan pekerjaan di ketinggian.',k:'Rangka perancah dan mesin bor ringan dipakai karena alat berat tidak bisa naik.'},
{i:'lereng-2',t:'Medan lereng, akses terbatas',c:'Mesin harus dibawa dan dipasang di kemiringan.',k:'Mesin bor portabel dengan rel miring bisa dipasang mengikuti kontur lereng.'}];
/* Zona untuk Cek Titik (PERKIRAAN AWAL, sesuaikan dengan pengalaman lapangan): lat,lng,r=radius km */
var Z=[
{n:'Cipatat & Rajamandala',lat:-6.83,lng:107.39,r:9,l:'Sulit',dp:'60–120 m',d:'Menyesuaikan kelancaran proses',t:'Banyak lapisan batu kapur yang keras, jadi pengeboran lebih lambat dan butuh survei titik yang teliti.'},
{n:'Padalarang & Ngamprah',lat:-6.84,lng:107.48,r:7,l:'Sedang',dp:'50–100 m',d:'Menyesuaikan kelancaran proses',t:'Lapisan tanah relatif beragam, umumnya pengerjaan berjalan normal.'},
{n:'Batujajar & Cimahi',lat:-6.89,lng:107.53,r:8,l:'Sedang',dp:'60–110 m',d:'Menyesuaikan kelancaran proses',t:'Kawasan padat, akses alat dan ruang kerja sering jadi pertimbangan utama.'},
{n:'Lembang & Cisarua',lat:-6.81,lng:107.6,r:9,l:'Sedang–Sulit',dp:'80–150 m',d:'Menyesuaikan kelancaran proses',t:'Dataran tinggi, air tanah biasanya lebih dalam sehingga pengeboran lebih lama.'},
{n:'Cililin & sekitarnya',lat:-6.96,lng:107.45,r:8,l:'Sedang',dp:'50–90 m',d:'Menyesuaikan kelancaran proses',t:'Kontur berbukit, akses alat perlu dicek lebih dulu.'}];
/* ======================== */
var $=function(s){return document.querySelector(s)},WA='https://wa.me/'+CFG.wa;
var pg=location.pathname.split('/').pop()||'index.html';
var N=[['index.html','Beranda'],['portofolio.html','Portofolio'],['layanan.html','Layanan'],['cek-titik.html','Cek Titik'],['kontak.html','Kontak']];
$('#h').innerHTML='<div class="nav"><a class="logo" href="index.html" aria-label="Djaya Cipta, beranda"><img src="img/logo.svg" alt=""><span class="brand-name">Djaya Cipta<small>SUMUR BOR</small></span></a><button class="menu-toggle" type="button" aria-label="Buka menu navigasi" aria-expanded="false" aria-controls="site-nav"><span aria-hidden="true"></span></button><nav id="site-nav">'+N.map(function(n){return'<a href="'+n[0]+'"'+(n[0]==pg?' class="on"':'')+'>'+n[1]+'</a>'}).join('')+'</nav></div>';
var menu=$('.menu-toggle'),siteNav=$('#site-nav');
menu.onclick=function(){var open=menu.getAttribute('aria-expanded')!=='true';menu.setAttribute('aria-expanded',open);siteNav.classList.toggle('open',open)};
document.addEventListener('click',function(e){if(!e.target.closest('.nav')){menu.setAttribute('aria-expanded','false');siteNav.classList.remove('open')}});
document.addEventListener('keydown',function(e){if(e.key==='Escape'){menu.setAttribute('aria-expanded','false');siteNav.classList.remove('open');menu.focus()}});
$('#f').innerHTML='<div class="w"><a class="footer-brand" href="index.html"><img src="img/logo.svg" alt=""><span>Djaya Cipta<small>SUMUR BOR</small></span></a><p>'+CFG.area+'</p><p>WhatsApp: <a href="'+WA+'">'+CFG.tampil+'</a></p></div><a class="btn wa" href="'+WA+'?text='+encodeURIComponent('Halo, saya mau tanya soal sumur bor.')+'">Chat WhatsApp</a>';
function card(p,j){return'<div class="c"><img src="img/'+p.i+'.jpg" alt="'+p.t+'" loading="lazy"><div class="b"><h3>'+p.t+'</h3><p><b>Tantangan:</b> '+p.c+'</p><p><b>Kenapa metode ini:</b> '+p.k+'</p></div></div>'}
if($('#pf'))$('#pf').innerHTML=P.slice(0,+$('#pf').dataset.n||99).map(card).join('');
var lb=document.createElement('div');lb.className='lb';document.body.appendChild(lb);lb.onclick=function(){lb.className='lb'};
document.addEventListener('click',function(e){if(e.target.matches('.c img')){lb.innerHTML='<img src="'+e.target.src+'">';lb.className='lb on'}});
var gm,mk;
function fill(la,ln){$('#la').value=la.toFixed(6);$('#ln').value=ln.toFixed(6)}
function show(la,ln){if(gm){var q={lat:la,lng:ln};gm.setCenter(q);gm.setZoom(19);mk.setPosition(q)}else $('#map').src='https://www.google.com/maps?q='+la+','+ln+'&z=18&t=h&output=embed'}
var aiN=0;
function ai(la,ln,b,ac){
 var o=$('#ai');if(!CFG.aiUrl||!o)return;var n=++aiN;o.innerHTML='<div class="aib"><b>Penjelasan AI</b><br><span>Sedang menganalisis titik Anda...</span></div>';
 var elevUrl='https://api.open-meteo.com/v1/elevation?latitude='+la+'&longitude='+ln;
 var placeUrl='https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat='+la+'&lon='+ln+'&zoom=10&addressdetails=1&accept-language=id';
 Promise.all([
  fetch(elevUrl).then(function(r){return r.ok?r.json():null}).then(function(d){return d&&d.elevation&&d.elevation[0]},function(){return null}),
  fetch(placeUrl).then(function(r){return r.ok?r.json():null}).then(function(d){var a=d&&d.address;if(!a)return null;var parts=[a.village||a.town||a.city||a.municipality,a.county||a.city_district,a.state].filter(function(v,i,x){return v&&x.indexOf(v)===i});return parts.join(', ').slice(0,160)||null},function(){return null})
 ]).then(function(data){return fetch(CFG.aiUrl,{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({lat:la,lng:ln,acc:ac||null,zona:b?b.n+' ('+b.l+', '+b.dp+')':null,elev:data[0],wilayah:data[1]})})})
 .then(function(r){if(!r.ok)throw 0;return r.json()})
 .then(function(d){if(n!=aiN)return;o.innerHTML='<div class="aib"><b>Penjelasan AI</b><br><span></span><br><small>Dibuat otomatis dari koordinat, bukan hasil survei.</small></div>';o.querySelector('span').textContent=d.text})
 .catch(function(){if(n==aiN)o.innerHTML='<div class="aib"><b>Penjelasan AI</b><br><span>AI belum dapat dihubungi. Silakan kirim titik ini lewat WhatsApp agar kami bantu cek.</span></div>'})
}
function cek(la,ln,ac){
 show(la,ln);var b=null,m=1e9;
 Z.forEach(function(z){var R=6371,a=Math.PI/180,dl=(z.lat-la)*a,dg=(z.lng-ln)*a,h=Math.sin(dl/2)*Math.sin(dl/2)+Math.cos(la*a)*Math.cos(z.lat*a)*Math.sin(dg/2)*Math.sin(dg/2),d=2*R*Math.asin(Math.sqrt(h));if(d<z.r&&d<m){m=d;b=z}});
 var xy=la.toFixed(6)+', '+ln.toFixed(6),msg='Halo, saya mau cek titik sumur bor.\nKoordinat: '+xy+(ac?' (akurasi ±'+Math.round(ac)+' m)':'')+'\nPeta: https://www.google.com/maps?q='+la+','+ln;
 $('#res').innerHTML='<div class="res"><p><b>Koordinat:</b> '+xy+(ac?' (±'+Math.round(ac)+' m)':'')+'</p>'+(b?'<h3>Wilayah '+b.n+'</h3><span class="tag">Kesulitan: '+b.l+'</span><span class="tag">Perkiraan kedalaman: '+b.dp+'</span><span class="tag">Waktu: '+b.d+'</span><p>'+b.t+'</p>':'<h3>Titik ini belum ada di data kami</h3><p>Tidak masalah, kirim titiknya lewat WhatsApp dan kami cek.</p>')+'<div id="ai"></div><p><small>Ini perkiraan awal dari koordinat Anda. Detailnya kami konfirmasi lewat WhatsApp.</small></p><div class="row"><a class="btn" href="'+WA+'?text='+encodeURIComponent(msg)+'">Kirim titik ini ke WhatsApp</a></div></div>';
 ai(la,ln,b,ac);
}
if($('#go')){
 $('#gps').onclick=function(){
  if(!navigator.geolocation)return alert('Browser tidak mendukung lokasi. Ketik koordinat manual.');
  var best,w,t,A=$('#acc');A.textContent='Meminta izin lokasi...';
  function done(){clearTimeout(t);navigator.geolocation.clearWatch(w);if(best){var c=best.coords;fill(c.latitude,c.longitude);A.textContent='Akurasi ±'+Math.round(c.accuracy)+' m'+(c.accuracy>100?'. Akurasi rendah: nyalakan GPS, pindah ke area terbuka, lalu ulangi, atau ketik koordinat manual.':'. Koordinat terisi otomatis.');cek(c.latitude,c.longitude,c.accuracy)}}
  t=setTimeout(done,15000);
  w=navigator.geolocation.watchPosition(function(p){if(!best||p.coords.accuracy<best.coords.accuracy)best=p;A.textContent='Mencari titik akurat... ±'+Math.round(p.coords.accuracy)+' m';fill(p.coords.latitude,p.coords.longitude);if(p.coords.accuracy<=20)done()},
  function(e){clearTimeout(t);navigator.geolocation.clearWatch(w);A.textContent='';alert(e.code==1?'Izin lokasi ditolak. Aktifkan izin lokasi untuk situs ini, atau ketik koordinat manual.':'Lokasi tidak terbaca. Pastikan GPS aktif dan situs dibuka lewat https, atau ketik koordinat manual.')},{enableHighAccuracy:true,maximumAge:0,timeout:20000});
 };
 $('#go').onclick=function(){var a=$('#la').value+' '+$('#ln').value,m=a.match(/@(-?\d+\.\d+),(-?\d+\.\d+)/)||a.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/)||a.match(/(-?\d+(?:\.\d+)?)\s*[, ]\s*(-?\d+(?:\.\d+)?)/);
  if(!m)return alert('Isi latitude dan longitude. Contoh: -6.83 dan 107.39');var la=+m[1],ln=+m[2];if(Math.abs(la)>90||Math.abs(ln)>180)return alert('Koordinat tidak valid.');fill(la,ln);$('#acc').textContent='Koordinat manual.';cek(la,ln)};
 window.initMap=function(){var c={lat:-6.83,lng:107.39},mv=function(la,ln){fill(la,ln);$('#acc').textContent='Pin digeser manual.';cek(la,ln)};gm=new google.maps.Map($('#mp'),{center:c,zoom:11,mapTypeId:'hybrid'});mk=new google.maps.Marker({map:gm,position:c,draggable:true});
  mk.addListener('dragend',function(){var p=mk.getPosition();mv(p.lat(),p.lng())});gm.addListener('click',function(e){mk.setPosition(e.latLng);mv(e.latLng.lat(),e.latLng.lng())})};
 if(CFG.mapsKey){var s=document.createElement('script');s.src='https://maps.googleapis.com/maps/api/js?key='+CFG.mapsKey+'&callback=initMap';document.head.appendChild(s)}else $('#map').src='https://www.google.com/maps?q=-6.83,107.39&z=11&output=embed';
}
if($('#kf'))$('#kf').onsubmit=function(e){e.preventDefault();var f=e.target;location.href=WA+'?text='+encodeURIComponent('Halo, saya '+f.nama.value+'. Kebutuhan: '+f.butuh.value+'. Lokasi/patokan: '+f.lok.value)};
