/**
 * NIV'Pop — Base de datos local completa
 */
const NivDB = (() => {
  const K = { results:'nivpop_results', flavors:'nivpop_flavors', config:'nivpop_config', kiosko:'nivpop_kiosko' };

  const FLAVORS_DEFAULT = [
    {id:'fresa',name:'Frambesa y Fresa',persona:'La Corazón Abierto',emoji:'🍓',color:'#c4786a',base:'leche',activo:true,pop:0},
    {id:'vainilla',name:'Vainilla y Coco',persona:'El Alma Serena',emoji:'🍦',color:'#a07828',base:'agua',activo:true,pop:0},
    {id:'menta',name:'Menta y Lima',persona:'La Mente Brillante',emoji:'🌿',color:'#3a8858',base:'agua',activo:true,pop:0},
    {id:'choco',name:'Chocolate y Café',persona:'La Profundidad Elegante',emoji:'🍫',color:'#7a5030',base:'leche',activo:true,pop:0},
    {id:'mango',name:'Mango Solar',persona:'La Energía Solar',emoji:'🥭',color:'#f09233',base:'agua',activo:true,pop:0},
    {id:'lavanda',name:'Lavanda y Arándano',persona:'La Sensibilidad Creativa',emoji:'💜',color:'#7050b0',base:'ambas',activo:true,pop:0},
    {id:'matcha',name:'Matcha y Pistache',persona:'La Mente Consciente',emoji:'🍵',color:'#4a9068',base:'leche',activo:true,pop:0},
    {id:'miel',name:'Miel y Jengibre',persona:'La Calidez Reparadora',emoji:'🍯',color:'#b87018',base:'agua',activo:true,pop:0},
    {id:'higo',name:'Higo y Queso Crema',persona:'La Tradición Evolucionada',emoji:'🫐',color:'#884038',base:'leche',activo:true,pop:0},
    {id:'caramelo',name:'Caramelo Salado',persona:'La Dualidad Dinámica',emoji:'🧁',color:'#a86818',base:'leche',activo:true,pop:0},
    {id:'yuzu',name:'Yuzu y Albahaca',persona:'El Espíritu Eléctrico',emoji:'🍋',color:'#648818',base:'agua',activo:true,pop:0},
    {id:'earl',name:'Té Earl Grey y Limón',persona:'La Serenidad Intelectual',emoji:'☕',color:'#385898',base:'leche',activo:true,pop:0},
    {id:'chai',name:'Chai y Canela',persona:'El Alma Especiada',emoji:'🌶',color:'#884020',base:'leche',activo:true,pop:0},
    {id:'platano',name:'Plátano y Nuez',persona:'El Confort Nostálgico',emoji:'🍌',color:'#786018',base:'leche',activo:true,pop:0},
    {id:'vino',name:'Vino y Frutos Negros',persona:'La Pasión Madura',emoji:'🍷',color:'#582858',base:'agua',activo:true,pop:0},
    {id:'carda',name:'Cardamomo y Rosa',persona:'La Elegancia Mística',emoji:'🌹',color:'#885070',base:'leche',activo:true,pop:0},
  ];

  const CONFIG_DEFAULT = {
    negocio:'Heladería Demo',ciudad:'Ciudad de México',email:'hola@nivpop.mx',
    telefono:'+52 55 1234 5678',descripcion:'Una heladería artesanal con productos únicos para cada personalidad.',
    color:'#c4786a',iniciales:'NP',plan:'starter',
    notif_nuevos:true,notif_resumen:true,notif_papel:true,notif_semanales:false,
  };

  const KIOSKO_DEFAULT = {
    activo:true,impresion:true,duo:true,reposo:true,sonidos:false,pausado:false,brillo:80,papel_pct:72,
  };

  function _get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d;}catch{return d;}}
  function _set(k,v){try{localStorage.setItem(k,JSON.stringify(v));}catch(e){console.error('[NivDB]',e);}}

  // ── RESULTADOS ──
  function saveResult(r){
    const all=getResults(),now=new Date();
    const entry={
      id:Date.now(),fecha:now.toLocaleDateString('es-MX'),
      hora:now.getHours(),min:now.getMinutes(),sec:now.getSeconds(),
      timeStr:`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`,
      modo:r.modo,flavorId:r.flavorId,sabor:r.sabor,flavorColor:r.flavorColor||'#c4786a',
      nombre1:r.nombre1||'Anónimo',nombre2:r.nombre2||null,compat:r.compat||null,
    };
    all.unshift(entry);_set(K.results,all.slice(0,500));
    window.dispatchEvent(new CustomEvent('nivpop:nuevo',{detail:entry}));
    const fl=getFlavors(),f=fl.find(x=>x.id===entry.flavorId);
    if(f){f.pop=(f.pop||0)+1;_set(K.flavors,fl);}
    return entry;
  }
  function getResults(){return _get(K.results,[]);}
  function getHoy(){const h=new Date().toLocaleDateString('es-MX');return getResults().filter(r=>r.fecha===h);}
  function deleteResult(id){_set(K.results,getResults().filter(r=>r.id!==id));}
  function clearResults(){_set(K.results,[]);}

  // ── SABORES ──
  function getFlavors(){return _get(K.flavors,FLAVORS_DEFAULT);}
  function saveFlavors(list){_set(K.flavors,list);}
  function updateFlavor(id,changes){
    const list=getFlavors(),idx=list.findIndex(f=>f.id===id);
    if(idx===-1)return false;list[idx]={...list[idx],...changes};saveFlavors(list);return true;
  }
  function toggleFlavor(id){
    const list=getFlavors(),f=list.find(x=>x.id===id);
    if(!f)return;f.activo=!f.activo;saveFlavors(list);
  }
  function resetFlavors(){_set(K.flavors,JSON.parse(JSON.stringify(FLAVORS_DEFAULT)));}

  // ── CONFIG ──
  function getConfig(){return _get(K.config,CONFIG_DEFAULT);}
  function saveConfig(d){_set(K.config,{...getConfig(),...d});}

  // ── KIOSKO ──
  function getKiosko(){return _get(K.kiosko,KIOSKO_DEFAULT);}
  function saveKiosko(d){_set(K.kiosko,{...getKiosko(),...d});}

  // ── STATS ──
  function getStats(data){
    const D=data||getResults();
    if(!D.length)return{total:0,solos:0,duos:0,estados:0,avgCompat:0,uniqueFlavors:0,topFlavor:null,peakHour:'—',topCompat:0,flavorCounts:{}};
    const duos=D.filter(r=>r.modo==='duo'),solos=D.filter(r=>r.modo==='solo'),estados=D.filter(r=>r.modo==='estado');
    const avgCompat=duos.length?Math.round(duos.reduce((s,r)=>s+(r.compat||0),0)/duos.length):0;
    const uniqueFlavors=new Set(D.map(r=>r.flavorId)).size;
    const fc={};D.forEach(r=>{fc[r.flavorId]=(fc[r.flavorId]||0)+1;});
    const topFlavorId=Object.entries(fc).sort((a,b)=>b[1]-a[1])[0]?.[0];
    const topFlavor=getFlavors().find(f=>f.id===topFlavorId);
    const hc={};D.forEach(r=>{hc[r.hora]=(hc[r.hora]||0)+1;});
    const peakEntry=Object.entries(hc).sort((a,b)=>b[1]-a[1])[0];
    const peakHour=peakEntry?peakEntry[0]+':00':'—';
    const topCompat=duos.length?Math.max(...duos.map(r=>r.compat||0)):0;
    return{total:D.length,solos:solos.length,duos:duos.length,estados:estados.length,avgCompat,uniqueFlavors,topFlavor,peakHour,topCompat,flavorCounts:fc};
  }

  // ── EXPORT CSV ──
  function exportCSV(data){
    const D=data||getResults();
    const rows=[['ID','Fecha','Hora','Modo','Sabor','Flavor ID','Nombre 1','Nombre 2','Compatibilidad'],
      ...D.map(r=>[r.id,r.fecha,r.timeStr||`${r.hora}:${String(r.min).padStart(2,'0')}`,r.modo,r.sabor,r.flavorId,r.nombre1,r.nombre2||'',r.compat||''])];
    const csv=rows.map(r=>r.map(v=>`"${v}"`).join(',')).join('\n');
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob(['\ufeff'+csv],{type:'text/csv;charset=utf-8'}));
    a.download=`nivpop-${new Date().toISOString().slice(0,10)}.csv`;a.click();
  }

  // ── SEED ──
  function seedIfEmpty(n=50){
    if(getResults().length>0)return;
    const FL=getFlavors(),NAMES=['Ana','Carlos','Laura','Diego','Sofía','Emilio','Valentina','Miguel','Camila','Andrés','Isabella','Rodrigo','Fernanda','Lucía'],
      DUO=['Matcha Mango Harmony','Fresa Lavanda Dream','Choco Vino Deep','Caramelo Solar Blend'],
      MODOS=['solo','solo','solo','duo','estado'],HW=[0,1,2,4,3,5,7,9,8,11,9,6,3],now=new Date(),res=[];
    for(let i=0;i<n;i++){
      const fl=FL[Math.floor(Math.random()*FL.length)],modo=MODOS[Math.floor(Math.random()*MODOS.length)];
      let hora=9,rnd=Math.random()*HW.reduce((a,b)=>a+b,0),cum=0;
      for(let h=0;h<HW.length;h++){cum+=HW[h];if(rnd<=cum){hora=9+h;break;}}
      const min=Math.floor(Math.random()*60),n1=NAMES[Math.floor(Math.random()*NAMES.length)],
        n2=modo==='duo'?NAMES[Math.floor(Math.random()*NAMES.length)]:null,
        compat=modo==='duo'?Math.floor(Math.random()*55)+40:null,
        sabor=modo==='duo'?DUO[Math.floor(Math.random()*DUO.length)]:fl.name;
      res.push({id:now.getTime()-i*180000,fecha:now.toLocaleDateString('es-MX'),hora,min,sec:Math.floor(Math.random()*60),
        timeStr:`${String(hora).padStart(2,'0')}:${String(min).padStart(2,'0')}`,modo,flavorId:fl.id,sabor,flavorColor:fl.color,nombre1:n1,nombre2:n2,compat});
    }
    _set(K.results,res);
    console.log(`[NivDB] Seed: ${n} registros demo`);
  }

  return{saveResult,getResults,getHoy,deleteResult,clearResults,
    getFlavors,saveFlavors,updateFlavor,toggleFlavor,resetFlavors,
    getConfig,saveConfig,getKiosko,saveKiosko,getStats,exportCSV,seedIfEmpty};
})();
