"""Builds the wedding site from wedding.src.html:
   - wedding.html            (single file with embedded photos, for the claude.ai preview)
   - glory-and-precious/     (Netlify site: index.html + images/, in the GitHub repo)"""
import base64, shutil, os
IMGS=[('HERO','hero.jpg'),('COUPLE','couple.jpg'),('TRADF','trad_full.jpg'),('TRADS','trad_sq.jpg')]
src=open('wedding.src.html').read()
# 1) preview
s=src
for k,f in IMGS: s=s.replace('{{'+k+'}}','data:image/jpeg;base64,'+base64.b64encode(open(f,'rb').read()).decode())
assert '{{' not in s; open('wedding.html','w').write(s)
# 2) netlify
R='glory-and-precious'
os.makedirs(R+'/images',exist_ok=True)
for _,f in IMGS: shutil.copy(f,R+'/images/'+f)
title_end=src.index('</title>')+len('</title>')
title,body=src[:title_end],src[title_end:]
for k,f in IMGS: body=body.replace('{{'+k+'}}','images/'+f)
hidden='''
<!-- Netlify Forms: these hidden forms let Netlify save every RSVP and gift note (see README) -->
<form name="rsvp" data-netlify="true" netlify-honeypot="bot-field" hidden>
  <input name="bot-field"><input name="name"><input name="phone"><input name="attending"><input name="guests"><textarea name="note"></textarea>
</form>
<form name="gift" data-netlify="true" netlify-honeypot="bot-field" hidden>
  <input name="bot-field"><input name="name"><input name="amount"><input name="account"><input name="towards"><textarea name="message"></textarea>
</form>
'''
body=body.replace('<div class="toast" id="toast"',hidden+'\n<div class="toast" id="toast"',1)
body=body.replace('/* ---------- RSVP ---------- */','''/* ---------- save a copy to Netlify Forms (works only on the Netlify site) ---------- */
function saveToNetlify(formName, fields){
  try { fetch("/", {method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded"}, body:new URLSearchParams({"form-name": formName, ...fields}).toString()}).catch(()=>{}); } catch(e) {}
}

/* ---------- RSVP ---------- */''',1)
a='  $("rWaBtns").innerHTML = waButtons(msg);'; assert a in body
body=body.replace(a,a+'''
  saveToNetlify("rsvp", {name, phone:$("rPhone").value.trim(), attending: mode==="yes"?"In Bida":mode==="online"?"Watching online":"Can't make it", guests: mode==="yes"?$("rGuests").value:"0", note:$("rNote").value.trim()});''',1)
a='  $("gWaBtns").innerHTML = waButtons(msg);'; assert a in body
body=body.replace(a,a+'''
  saveToNetlify("gift", {name, amount: amt>0?String(amt):"", account:$("gAcct").value, towards:$("gFor").value, message:$("gMsg").value.trim()});''',1)
head='''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
'''+title+'''
<meta name="description" content="You are invited to the Holy Matrimony of Glory & Precious, Sunday 25 October 2026, 5:00 pm, Bida, Niger State.">
<meta property="og:title" content="Glory & Precious · 25 October 2026">
<meta property="og:description" content="You are invited to our Holy Matrimony in Bida. RSVP, watch live and send a gift.">
<meta property="og:image" content="images/hero.jpg">
<meta property="og:type" content="website">
<style>[hidden]{display:none!important}body{margin:0}</style>
'''
i=body.index('<a class="livebar"')
open(R+'/index.html','w').write(head+body[:i]+'</head>\n<body>\n'+body[i:]+'\n</body>\n</html>\n')
print('built')
