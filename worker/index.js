export default {
 async fetch(request, env) {
  const origin=request.headers.get("Origin")||"";
  const allowed=(env.ALLOWED_ORIGIN||"").split(",").map(x=>x.trim()).filter(Boolean);
  const ok=allowed.includes("*")||allowed.includes(origin);
  const cors={"Access-Control-Allow-Origin":ok?origin:(allowed[0]||"null"),"Access-Control-Allow-Methods":"POST, OPTIONS","Access-Control-Allow-Headers":"Content-Type","Vary":"Origin"};
  if(request.method==="OPTIONS") return new Response(null,{status:204,headers:cors});
  const url=new URL(request.url);
  if(url.pathname!=="/api/chat"||request.method!=="POST") return new Response("Personal AI Studio API is running.",{status:200,headers:cors});
  if(!ok) return json({error:"Origin not allowed. Set ALLOWED_ORIGIN to your GitHub Pages origin."},403,cors);
  if(!env.OPENAI_API_KEY) return json({error:"Backend AI key is not configured."},503,cors);
  try{
   const body=await request.json();
   if(!Array.isArray(body.messages)||!body.messages.length) return json({error:"A non-empty messages array is required."},400,cors);
   const messages=body.messages.slice(-24).map(m=>({role:["system","user","assistant"].includes(m.role)?m.role:"user",content:String(m.content||"").slice(0,16000)}));
   const upstream=await fetch(env.OPENAI_API_URL||"https://api.openai.com/v1/chat/completions",{method:"POST",headers:{"Authorization":"Bearer "+env.OPENAI_API_KEY,"Content-Type":"application/json"},body:JSON.stringify({model:env.OPENAI_MODEL||"gpt-4o-mini",messages,temperature:0.7})});
   const data=await upstream.json().catch(()=>({}));
   if(!upstream.ok)return json({error:data.error?.message||"AI provider returned "+upstream.status},502,cors);
   return json({reply:data.choices?.[0]?.message?.content||"Empty response from provider."},200,cors);
  }catch(e){return json({error:e.message||"Unexpected backend error."},500,cors)}
 }
};
function json(data,status,headers){return new Response(JSON.stringify(data),{status,headers:{...headers,"Content-Type":"application/json; charset=utf-8"}})}
