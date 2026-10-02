const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const PORT = process.env.PORT || 3000;
const root = path.join(__dirname, 'public');
const batches = [
  {id:'boards-10',name:'Class 10 Board Tests',category:'Boards Level Tests',exam:'BOARDS',count:12,paid:false},
  {id:'boards-12',name:'Class 12 Board Tests',category:'Boards Level Tests',exam:'BOARDS',count:18,paid:false},
  {id:'jee-2027',name:'JEE 2027 Target Batch',category:'JEE Tests',exam:'JEE',count:10,paid:true},
  {id:'jee-mains',name:'JEE Main Practice Series',category:'JEE Tests',exam:'JEE',count:16,paid:false},
  {id:'neet-2027',name:'NEET 2027 Target Batch',category:'NEET Tests',exam:'NEET',count:14,paid:true},
  {id:'neet-practice',name:'NEET Full Syllabus Practice',category:'NEET Tests',exam:'NEET',count:9,paid:false},
  {id:'dropper-2027',name:'Dropper 2027 Batch',category:'Dropper Tests',exam:'NEET',count:11,paid:true},
  {id:'other-foundation',name:'Foundation / Other Batches',category:'Other Batch Tests',exam:'OTHER',count:7,paid:false}
];
const testBank = {
  'boards-10':['Science Chapter Test 01','Mathematics Practice Test 01','Social Science Revision Test'],
  'boards-12':['Physics Board Test 01','Chemistry Board Test 01','Mathematics Board Test 01'],
  'jee-2027':['JEE Main Mock Test 01','JEE Advanced Practice 01','Physics + Chemistry Test 01'],
  'jee-mains':['Maths Speed Test','Organic Chemistry Drill','Full Syllabus Mock 01'],
  'neet-2027':['Biology NCERT Test 01','Physics NEET Mock 01','Full Syllabus Test 01'],
  'neet-practice':['Botany Practice 01','Zoology Practice 01','Human Physiology Test'],
  'dropper-2027':['Dropper Major Test 01','Dropper Minor Test 02','Grand Test 01'],
  'other-foundation':['Foundation Science Test','Foundation Maths Test','Foundation Mega Mock']
};
function testsFor(id){return (testBank[id]||[]).map((name,i)=>({id:`${id}-t${i+1}`,name,questions:30+i*10,date:`${String(10+i).padStart(2,'0')} Oct 2026`,duration:60+i*15,instructions:['Read every question carefully before selecting an answer.','Do not refresh or close the test while attempting it.','Submit the test before the timer reaches zero.']}));}
function json(res,data,status=200){const body=JSON.stringify(data);res.writeHead(status,{'Content-Type':'application/json; charset=utf-8','Cache-Control':'no-store'});res.end(body);}
function safeFile(p){const decoded=decodeURIComponent(p);if(decoded.includes('..')) return null;const f=path.join(root,decoded==='/'?'index.html':decoded.replace(/^\//,''));return f.startsWith(root)?f:null;}
const server=http.createServer((req,res)=>{const u=url.parse(req.url,true);const p=u.pathname;
  if(p==='/api/config') return json(res,{brand:'Zxsite',tagline:'Your Ultimate Exam Preparation Platform'});
  if(p==='/api/batches'){const q=(u.query.q||'').trim().toLowerCase();return json(res,q?batches.filter(b=>(b.name+' '+b.category).toLowerCase().includes(q)):batches);}
  let m=p.match(/^\/api\/batches\/([^/]+)\/tests$/);if(m)return json(res,testsFor(m[1]));
  m=p.match(/^\/api\/tests\/([^/]+)$/);if(m){for(const b of batches){const t=testsFor(b.id).find(x=>x.id===m[1]);if(t)return json(res,{...t,batch:b});}return json(res,{error:'Test not found'},404);}
  const f=safeFile(p);if(!f)return json(res,{error:'Not found'},404);
  fs.stat(f,(err,st)=>{if(err||!st.isFile())return json(res,{error:'Not found'},404);const ext=path.extname(f);const types={'.html':'text/html; charset=utf-8','.css':'text/css; charset=utf-8','.js':'application/javascript; charset=utf-8','.json':'application/json; charset=utf-8','.png':'image/png','.jpg':'image/jpeg','.svg':'image/svg+xml'};res.writeHead(200,{'Content-Type':types[ext]||'application/octet-stream'});fs.createReadStream(f).pipe(res);});
});
server.listen(PORT,()=>console.log(`Zxsite running on ${PORT}`));
