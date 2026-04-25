module.exports=[974730,e=>{"use strict";let t=process.env.EVOLUTION_URL||"https://evolution.sunstein.cloud",a=process.env.EVOLUTION_API_KEY||"a53c00ff3726d2ced6bbfeba8d1a1e90";async function n(e,n,o){try{let s=await fetch(`${t}${n}`,{method:e,headers:{"Content-Type":"application/json",apiKey:a},body:o?JSON.stringify(o):void 0}),r=await s.json();return{status:s.status,data:r}}catch(e){return{status:0,error:String(e)}}}async function o(e){return n("POST","/instance/create",{instanceName:e,qrcode:!0,integration:"WHATSAPP-BAI",reject_call:!1,msg_call:!1,groups_ignore:!0,always_online:!1,read_messages:!0,read_status:!0,sync_full_history:!1})}async function s(e,t,a){return n("POST",`/message/sendText/${e}`,{number:t.replace(/\D/g,""),text:a,delay:1200})}async function r(e,t,a,n,o){return s(e,t,`⏰ *Recordatorio de cita*

Hola ${a}! Te recordamos que tenes una cita ma\xf1ana:

📅 ${n}
⏰ ${o}

Si necesitas cancelar o reprogramar, avisanos con anticipacion.

Gracias!`)}async function i(e,t,a){let n=`🆕 *Nueva reserva* en tu negocio!

👤 Cliente: ${a.customerName}
📞 Tel: ${a.customerPhone}
💇 Servicio: ${a.service}
📅 Fecha: ${a.date}
⏰ Hora: ${a.time}

Gestiona desde: https://paragu-ai.com/admin/bookings`;return s(e,t.replace(/\D/g,""),n)}async function l(e,t){return n("POST",`/catalog/create/${e}`,{products:t.map(e=>({name:e.name,description:e.description,price:e.price,imageUrl:e.imageUrl||""})),currency:"PYG"})}e.s(["createInstance",0,o,"notifyNewBooking",0,i,"sendBookingReminder",0,r,"sendText",0,s,"syncCatalog",0,l])},868366,e=>{"use strict";var t=e.i(779326),a=e.i(974730);let n=null;function o(){return n||(n=(0,t.createClient)("https://qyvokpribmbrosafntqa.supabase.co",process.env.SUPABASE_SERVICE_ROLE_KEY)),n}async function s(){let{data:e}=await supabase.from("businesses").select("id, name, phone, whatsapp_instance, slug").not("whatsapp_instance","is",null).not("phone","is",null);return e||[]}async function r(e){let t=new Date().toISOString().split("T")[0],[a,n]=await Promise.all([o().from("bookings").select("id, customer_name, booking_time, status").eq("business_id",e).eq("booking_date",t),o().from("orders").select("id, total_cents, status").eq("business_id",e).gte("created_at",t)]);return{bookings:a.data||[],bookingCount:a.data?.length||0,pendingCount:a.data?.filter(e=>"pending"===e.status).length||0,confirmedCount:a.data?.filter(e=>"confirmed"===e.status).length||0,orders:n.data||[],orderCount:n.data?.length||0,revenueCents:n.data?.reduce((e,t)=>e+(t.total_cents||0),0)||0}}async function i(e){let t=new Date(Date.now()-6048e5).toISOString().split("T")[0],a=new Date().toISOString().split("T")[0],[n,s]=await Promise.all([o().from("bookings").select("id, status").eq("business_id",e).gte("booking_date",t).lte("booking_date",a),o().from("orders").select("id, total_cents, status").eq("business_id",e).gte("created_at",t)]);return{totalBookings:n.data?.length||0,completedBookings:n.data?.filter(e=>"completed"===e.status).length||0,cancelledBookings:n.data?.filter(e=>"cancelled"===e.status).length||0,noShow:n.data?.filter(e=>"no_show"===e.status).length||0,totalOrders:s.data?.length||0,revenueCents:s.data?.reduce((e,t)=>e+(t.total_cents||0),0)||0}}async function l(e){let t=new Date(Date.now()-2592e6).toISOString().split("T")[0],a=new Date().toISOString().split("T")[0],[n,s]=await Promise.all([o().from("bookings").select("id, status").eq("business_id",e).gte("booking_date",t).lte("booking_date",a),o().from("orders").select("id, total_cents, status").eq("business_id",e).gte("created_at",t)]),r=n.data||[];return{totalBookings:r.length,confirmedBookings:r.filter(e=>"confirmed"===e.status).length,completedBookings:r.filter(e=>"completed"===e.status).length,cancelledBookings:r.filter(e=>"cancelled"===e.status).length,noShow:r.filter(e=>"no_show"===e.status).length,totalOrders:s.data?.length||0,revenueCents:s.data?.reduce((e,t)=>e+(t.total_cents||0),0)||0,avgBookingPerDay:(r.length/30).toFixed(1),conversionRate:r.length>0?(r.filter(e=>"completed"===e.status).length/r.length*100).toFixed(0):"0"}}function c(e){return`Gs. ${(e/100).toLocaleString("es-PY")}`}async function d(){let e=await s(),t=0,n=0,o=new Date,i=o.toLocaleDateString("es-PY",{weekday:"long"}),l=o.toLocaleDateString("es-PY",{day:"numeric",month:"long",year:"numeric"});for(let o of e){if(!o.whatsapp_instance){n++;continue}try{let e=await r(o.id),n=e.bookings.slice(0,8).map(e=>`  ${e.booking_time?.slice(0,5)} - ${e.customer_name} (${e.status})`).join("\n"),s=`📋 *Resumen diario - ${i}*
${o.name}
${l}

━━━━━━━━━━━━━━━━━━
*Reservas de hoy:* ${e.bookingCount}
${e.bookingCount>0?`
${n}`:"  No hay reservas para hoy"}
${e.pendingCount>0?`
⚠️ ${e.pendingCount} pendiente(s) de confirmar`:""}

*Pedidos:* ${e.orderCount}
*Ingresos:* ${c(e.revenueCents)}

━━━━━━━━━━━━━━━━━━
Ver mas en: https://paragu-ai.com/dashboard/${o.slug}`;await (0,a.sendText)(o.whatsapp_instance,o.phone||o.phone,s),t++}catch{n++}}return{sent:t,skipped:n}}async function u(){let e=await s(),t=0,n=0,o=`${new Date(Date.now()-6048e5).toLocaleDateString("es-PY")} - ${new Date().toLocaleDateString("es-PY")}`;for(let s of e){if(!s.whatsapp_instance){n++;continue}try{let e=await i(s.id),n=`📊 *Informe semanal*
${s.name}
${o}

━━━━━━━━━━━━━━━━━━
📅 *Reservas*
  Total: ${e.totalBookings}
  Completadas: ${e.completedBookings}
  Canceladas: ${e.cancelledBookings}
  No asistieron: ${e.noShow}

💰 *Ingresos*
  Pedidos: ${e.totalOrders}
  Total: ${c(e.revenueCents)}

━━━━━━━━━━━━━━━━━━
Gracias por confiar en Paragu-AI!`;await (0,a.sendText)(s.whatsapp_instance,s.phone||s.phone,n),t++}catch{n++}}return{sent:t,skipped:n}}async function p(){let e=await s(),t=0,n=0,o=new Date().toLocaleDateString("es-PY",{month:"long",year:"numeric"});for(let s of e){if(!s.whatsapp_instance){n++;continue}try{let e=await l(s.id),n=`📈 *Informe mensual - ${o}*
${s.name}

━━━━━━━━━━━━━━━━━━
📅 *Reservas del mes*
  Total: ${e.totalBookings}
  Confirmadas: ${e.confirmedBookings}
  Completadas: ${e.completedBookings}
  Canceladas: ${e.cancelledBookings}
  No asistieron: ${e.noShow}
  Promedio diario: ${e.avgBookingPerDay}
  Conversion: ${e.conversionRate}%

💰 *Ingresos*
  Pedidos: ${e.totalOrders}
  Total mes: ${c(e.revenueCents)}

━━━━━━━━━━━━━━━━━━
Consejo del mes:
  Responder rapido a las consultas de WhatsApp
  aumenta tus ventas hasta 40%! 🚀

Seguimos trabajando para tu negocio!
Paragu-AI`;await (0,a.sendText)(s.whatsapp_instance,s.phone||s.phone,n),t++}catch{n++}}return{sent:t,skipped:n}}async function g(e,t){let n=await s();t&&(n=n.filter(e=>e.id===t));let o=0;for(let t of n)if(t.whatsapp_instance)try{let n=`${e}

— Paragu-AI 🤖`;await (0,a.sendText)(t.whatsapp_instance,t.phone||t.phone,n),o++}catch{continue}return{sent:o}}e.s(["sendBusinessMessage",0,g,"sendDailyDigest",0,d,"sendMonthlyReport",0,p,"sendWeeklyReport",0,u])},844925,e=>{"use strict";var t=e.i(698490),a=e.i(618006),n=e.i(258914),o=e.i(772560),s=e.i(976852),r=e.i(738533),i=e.i(455822),l=e.i(754068),c=e.i(266843),d=e.i(699385),u=e.i(903050),p=e.i(475293),g=e.i(502144),h=e.i(833599),f=e.i(536497),m=e.i(193695);e.i(779178);var w=e.i(396717),v=e.i(23480);e.i(425449);var y=e.i(848399),R=e.i(868366);async function _(e){let t=process.env.CRON_SECRET;if(t&&e.headers.get("x-cron-secret")!==t)return v.NextResponse.json({error:"forbidden"},{status:403});try{let{sent:e,skipped:t}=await (0,R.sendDailyDigest)();return y.logger.info("Daily digest sent",{sent:e,skipped:t}),v.NextResponse.json({ok:!0,sent:e,skipped:t})}catch(e){return y.logger.error("Daily digest failed",{error:String(e)}),v.NextResponse.json({ok:!1,reason:"failed"},{status:200})}}e.s(["POST",0,_,"runtime",0,"nodejs"],805276);var C=e.i(805276);let b=new t.AppRouteRouteModule({definition:{kind:a.RouteKind.APP_ROUTE,page:"/api/cron/daily-digest/route",pathname:"/api/cron/daily-digest",filename:"route",bundlePath:""},distDir:".next",relativeProjectDir:"",resolvedPagePath:"[project]/web/app/api/cron/daily-digest/route.ts",nextConfigOutput:"standalone",userland:C,...{}}),{workAsyncStorage:$,workUnitAsyncStorage:S,serverHooks:k}=b;async function P(e,t,n){n.requestMeta&&(0,o.setRequestMeta)(e,n.requestMeta),b.isDev&&(0,o.addRequestMeta)(e,"devRequestTimingInternalsEnd",process.hrtime.bigint());let v="/api/cron/daily-digest/route";v=v.replace(/\/index$/,"")||"/";let y=await b.prepare(e,t,{srcPage:v,multiZoneDraftMode:!1});if(!y)return t.statusCode=400,t.end("Bad Request"),null==n.waitUntil||n.waitUntil.call(n,Promise.resolve()),null;let{buildId:R,params:_,nextConfig:C,parsedUrl:$,isDraftMode:S,prerenderManifest:k,routerServerContext:P,isOnDemandRevalidate:E,revalidateOnlyGenerated:T,resolvedPathname:x,clientReferenceManifest:A,serverActionsManifest:O}=y,D=(0,i.normalizeAppPath)(v),N=!!(k.dynamicRoutes[D]||k.routes[x]),I=async()=>((null==P?void 0:P.render404)?await P.render404(e,t,$,!1):t.end("This page could not be found"),null);if(N&&!S){let e=!!k.routes[x],t=k.dynamicRoutes[D];if(t&&!1===t.fallback&&!e){if(C.adapterPath)return await I();throw new m.NoFallbackError}}let q=null;!N||b.isDev||S||(q="/index"===(q=x)?"/":q);let B=!0===b.isDev||!N,U=N&&!B;O&&A&&(0,r.setManifestsSingleton)({page:v,clientReferenceManifest:A,serverActionsManifest:O});let H=e.method||"GET",j=(0,s.getTracer)(),M=j.getActiveScopeSpan(),L=!!(null==P?void 0:P.isWrappedByNextServer),F=!!(0,o.getRequestMeta)(e,"minimalMode"),K=(0,o.getRequestMeta)(e,"incrementalCache")||await b.getIncrementalCache(e,C,k,F);null==K||K.resetRequestCache(),globalThis.__incrementalCache=K;let Y={params:_,previewProps:k.preview,renderOpts:{experimental:{authInterrupts:!!C.experimental.authInterrupts},cacheComponents:!!C.cacheComponents,supportsDynamicResponse:B,incrementalCache:K,cacheLifeProfiles:C.cacheLife,waitUntil:n.waitUntil,onClose:e=>{t.on("close",e)},onAfterTaskError:void 0,onInstrumentationRequestError:(t,a,n,o)=>b.onRequestError(e,t,n,o,P)},sharedContext:{buildId:R}},G=new l.NodeNextRequest(e),V=new l.NodeNextResponse(t),W=c.NextRequestAdapter.fromNodeNextRequest(G,(0,c.signalFromNodeResponse)(t));try{let o,r=async e=>b.handle(W,Y).finally(()=>{if(!e)return;e.setAttributes({"http.status_code":t.statusCode,"next.rsc":!1});let a=j.getRootSpanAttributes();if(!a)return;if(a.get("next.span_type")!==d.BaseServerSpan.handleRequest)return void console.warn(`Unexpected root span type '${a.get("next.span_type")}'. Please report this Next.js issue https://github.com/vercel/next.js`);let n=a.get("next.route");if(n){let t=`${H} ${n}`;e.setAttributes({"next.route":n,"http.route":n,"next.span_name":t}),e.updateName(t),o&&o!==e&&(o.setAttribute("http.route",n),o.updateName(t))}else e.updateName(`${H} ${v}`)}),i=async o=>{var s,i;let l=async({previousCacheEntry:a})=>{try{if(!F&&E&&T&&!a)return t.statusCode=404,t.setHeader("x-nextjs-cache","REVALIDATED"),t.end("This page could not be found"),null;let s=await r(o);e.fetchMetrics=Y.renderOpts.fetchMetrics;let i=Y.renderOpts.pendingWaitUntil;i&&n.waitUntil&&(n.waitUntil(i),i=void 0);let l=Y.renderOpts.collectedTags;if(!N)return await (0,p.sendResponse)(G,V,s,Y.renderOpts.pendingWaitUntil),null;{let e=await s.blob(),t=(0,g.toNodeOutgoingHttpHeaders)(s.headers);l&&(t[f.NEXT_CACHE_TAGS_HEADER]=l),!t["content-type"]&&e.type&&(t["content-type"]=e.type);let a=void 0!==Y.renderOpts.collectedRevalidate&&!(Y.renderOpts.collectedRevalidate>=f.INFINITE_CACHE)&&Y.renderOpts.collectedRevalidate,n=void 0===Y.renderOpts.collectedExpire||Y.renderOpts.collectedExpire>=f.INFINITE_CACHE?void 0:Y.renderOpts.collectedExpire;return{value:{kind:w.CachedRouteKind.APP_ROUTE,status:s.status,body:Buffer.from(await e.arrayBuffer()),headers:t},cacheControl:{revalidate:a,expire:n}}}}catch(t){throw(null==a?void 0:a.isStale)&&await b.onRequestError(e,t,{routerKind:"App Router",routePath:v,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:E})},!1,P),t}},c=await b.handleResponse({req:e,nextConfig:C,cacheKey:q,routeKind:a.RouteKind.APP_ROUTE,isFallback:!1,prerenderManifest:k,isRoutePPREnabled:!1,isOnDemandRevalidate:E,revalidateOnlyGenerated:T,responseGenerator:l,waitUntil:n.waitUntil,isMinimalMode:F});if(!N)return null;if((null==c||null==(s=c.value)?void 0:s.kind)!==w.CachedRouteKind.APP_ROUTE)throw Object.defineProperty(Error(`Invariant: app-route received invalid cache entry ${null==c||null==(i=c.value)?void 0:i.kind}`),"__NEXT_ERROR_CODE",{value:"E701",enumerable:!1,configurable:!0});F||t.setHeader("x-nextjs-cache",E?"REVALIDATED":c.isMiss?"MISS":c.isStale?"STALE":"HIT"),S&&t.setHeader("Cache-Control","private, no-cache, no-store, max-age=0, must-revalidate");let d=(0,g.fromNodeOutgoingHttpHeaders)(c.value.headers);return F&&N||d.delete(f.NEXT_CACHE_TAGS_HEADER),!c.cacheControl||t.getHeader("Cache-Control")||d.get("Cache-Control")||d.set("Cache-Control",(0,h.getCacheControlHeader)(c.cacheControl)),await (0,p.sendResponse)(G,V,new Response(c.value.body,{headers:d,status:c.value.status||200})),null};L&&M?await i(M):(o=j.getActiveScopeSpan(),await j.withPropagatedContext(e.headers,()=>j.trace(d.BaseServerSpan.handleRequest,{spanName:`${H} ${v}`,kind:s.SpanKind.SERVER,attributes:{"http.method":H,"http.target":e.url}},i),void 0,!L))}catch(t){if(t instanceof m.NoFallbackError||await b.onRequestError(e,t,{routerKind:"App Router",routePath:D,routeType:"route",revalidateReason:(0,u.getRevalidateReason)({isStaticGeneration:U,isOnDemandRevalidate:E})},!1,P),N)throw t;return await (0,p.sendResponse)(G,V,new Response(null,{status:500})),null}}e.s(["handler",0,P,"patchFetch",0,function(){return(0,n.patchFetch)({workAsyncStorage:$,workUnitAsyncStorage:S})},"routeModule",0,b,"serverHooks",0,k,"workAsyncStorage",0,$,"workUnitAsyncStorage",0,S],844925)}];

//# sourceMappingURL=web_0lic_2i._.js.map