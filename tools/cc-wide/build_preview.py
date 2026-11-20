import json,base64,re
P=json.load(open('/home/claude/ccl/wide_patches.json'))
W='/home/claude/weaselwonder/public/assets/'
s=open('/home/claude/ccl/r6.html',encoding='utf-8').read()
for a,b in P: assert s.count(a)==1, a[:40]; s=s.replace(a,b)
s=s.replace('<script src="/assets/cc-streamer.js"></script>','').replace('<script src="/assets/dual-stream.js" defer></script>','')
s=s.replace('location.pathname==="/corpsecrafter/weasel"?"host":"landing"','"host"')
imgs={k:'data:image/webp;base64,'+base64.b64encode(open(W+'cambg/'+k+'.webp','rb').read()).decode() for k in ['chess','zombierats','corpse','sub-red','sub-ww2']}
cambg=open(W+'ww-cambg.js').read().replace("const url = id => `${BASE}/assets/cambg/${id}.webp`;","const IMG = "+json.dumps(imgs)+"; const url = id => IMG[id];")
pre='''<script>/* LOCAL PREVIEW: Corpse Crafter wide layout. No live server here, so the game runs solo as Weasel. */
window.CC_LAYOUT_V2=true;try{localStorage.setItem("ww_host_pw","preview")}catch(e){}
(function(){const R=window.WebSocket;window.WebSocket=function(u,p){if(/^wss:\\/\\/irc-ws\\.chat\\.twitch\\.tv/.test(String(u)))return p?new R(u,p):new R(u);return {readyState:0,bufferedAmount:0,send(){},close(){},addEventListener(){}}};window.WebSocket.OPEN=1;window.WebSocket.prototype=R.prototype})();
</script><script>'''+cambg+'''</script><script>'''+open(W+'cc-layout-v2.js').read()+'''</script>
<script>addEventListener("DOMContentLoaded",()=>{const grid=document.getElementById("dFrame")&&document.getElementById("dFrame").parentElement;if(grid&&window.WWCamBg){const w=document.createElement("label");w.style.cssText="grid-column:1/-1;display:flex;gap:8px;align-items:center;font-size:13px";w.textContent="Camera background ";const sel=WWCamBg.select({game:"corpse-crafter"});sel.style.flex="1";w.appendChild(sel);grid.appendChild(w)}});</script>'''
s=re.sub(r'<head>',lambda m:'<head>'+pre,s,count=1)
open('/home/claude/ccl/CorpseCrafter-wide-preview.html','w',encoding='utf-8').write(s)
# worker: refresh the CCWIDE list
w=open('/home/claude/weaselwonder/src/worker.js').read()
i=w.find('const CCWIDE='); j=w.find(';for(',0)  # placeholder
k=w.find(']];',i)+3
w=w[:i]+'const CCWIDE='+json.dumps(P)+';'+w[k:]
open('/home/claude/weaselwonder/src/worker.js','w').write(w)
print('built', len(s))
