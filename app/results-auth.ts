import {env} from 'cloudflare:workers';
const settings=()=>env as unknown as Record<string,string>;
export const getPassword=()=>settings().RESULTS_PASSWORD;
async function sign(value:string){const secret=settings().RESULTS_SESSION_SECRET;if(!secret)throw new Error('Results access unavailable');const key=await crypto.subtle.importKey('raw',new TextEncoder().encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);return Array.from(new Uint8Array(await crypto.subtle.sign('HMAC',key,new TextEncoder().encode(value)))).map(x=>x.toString(16).padStart(2,'0')).join('');}
export function equal(a:string,b:string){let v=a.length^b.length;for(let i=0;i<Math.max(a.length,b.length);i++)v|=(a.charCodeAt(i)||0)^(b.charCodeAt(i)||0);return v===0;}
export async function issueSession(){const expires=String(Date.now()+3600000),salt=crypto.randomUUID(),body=expires+'.'+salt;return body+'.'+await sign(body);}
export async function authorized(req:Request){const token=req.headers.get('cookie')?.split(';').map(s=>s.trim()).find(s=>s.startsWith('manoly_results='))?.slice(15);if(!token)return false;const p=token.split('.');if(p.length!==3||!Number.isFinite(Number(p[0]))||Number(p[0])<Date.now()||Number(p[0])>Date.now()+3600000)return false;return equal(p[2],await sign(p[0]+'.'+p[1]));}
export const accessCookie=(token:string,age=3600)=>`manoly_results=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${age}`;
export async function attemptKey(req:Request){return sign((req.headers.get('cf-connecting-ip')||'unknown')+':'+Math.floor(Date.now()/900000));}
