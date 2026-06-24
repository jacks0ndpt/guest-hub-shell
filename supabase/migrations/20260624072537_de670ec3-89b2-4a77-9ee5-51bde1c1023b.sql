
INSERT INTO public.site_content (section_key, content) VALUES
('trust_strip', '{
  "eyebrow_ro":"De ce noi","eyebrow_en":"Why us",
  "title_ro":"Tot ce contează, inclus.","title_en":"Everything that matters, included.",
  "subtitle_ro":"Câteva motive simple pentru care oaspeții aleg să se întoarcă.","subtitle_en":"A few simple reasons guests come back.",
  "items_json":[
    {"icon_key":"coffee","label_ro":"Mic dejun inclus","label_en":"Breakfast included","description_ro":"Servit zilnic, 07:30–10:30.","description_en":"Served daily, 07:30–10:30.","is_active":true,"sort_order":0},
    {"icon_key":"parking","label_ro":"Parcare gratuită","label_en":"Free parking","description_ro":"Loc rezervat la sosire.","description_en":"Reserved spot on arrival.","is_active":true,"sort_order":1},
    {"icon_key":"wifi","label_ro":"Wi-Fi rapid","label_en":"Fast Wi-Fi","description_ro":"Stabil în toată proprietatea.","description_en":"Stable across the property.","is_active":true,"sort_order":2},
    {"icon_key":"map-pin","label_ro":"Aproape de centrul vechi","label_en":"Near the old town","description_ro":"6 minute pe jos.","description_en":"6 minutes on foot.","is_active":true,"sort_order":3},
    {"icon_key":"message-circle","label_ro":"Suport pe WhatsApp","label_en":"WhatsApp support","description_ro":"Răspundem rapid, în limba ta.","description_en":"We reply fast, in your language.","is_active":true,"sort_order":4}
  ]
}'::jsonb),
('why_us', '{
  "eyebrow_ro":"De ce ne aleg oaspeții","eyebrow_en":"Why guests love us",
  "title_ro":"Un sejur gândit până în cel mai mic detaliu.","title_en":"A stay thought through to the smallest detail.",
  "subtitle_ro":"Promitem puțin și ținem mult.","subtitle_en":"We promise little and deliver a lot.",
  "items_json":[
    {"icon_key":"heart","title_ro":"Confort ca acasă","title_en":"Comfort like home","description_ro":"Saltele bune, lenjerie curată, liniște garantată.","description_en":"Good mattresses, fresh linens, real quiet.","is_active":true,"sort_order":0},
    {"icon_key":"map-pin","title_ro":"Locație excelentă","title_en":"Excellent location","description_ro":"La pas de centrul vechi și restaurantele bune.","description_en":"A short walk from the old town and the best restaurants.","is_active":true,"sort_order":1},
    {"icon_key":"sparkles","title_ro":"Atmosferă primitoare","title_en":"Welcoming atmosphere","description_ro":"O echipă mică, atentă la oameni, nu la scenarii.","description_en":"A small team that cares about people, not scripts.","is_active":true,"sort_order":2},
    {"icon_key":"star","title_ro":"Raport bun calitate-preț","title_en":"Good value for money","description_ro":"Tarife corecte, fără surprize la plecare.","description_en":"Fair rates, no surprises at checkout.","is_active":true,"sort_order":3}
  ]
}'::jsonb),
('guest_convenience', '{
  "eyebrow_ro":"Pentru oaspeții noștri","eyebrow_en":"For our guests",
  "title_ro":"Tot ce ai nevoie, fără drumuri la recepție.","title_en":"Everything you need — without a trip to the front desk.",
  "subtitle_ro":"Cere ce ai nevoie, oricând, din camera ta.","subtitle_en":"Ask for what you need, anytime, from your room.",
  "body_ro":"De la prosoape în plus la o recomandare bună pentru cină, suntem doar la un mesaj distanță.","body_en":"From extra towels to a great dinner recommendation, we''re just a tap away.",
  "image_url":"",
  "primary_cta_label_ro":"Vezi cum funcționează","primary_cta_label_en":"See how it works","primary_cta_url":"/rooms",
  "items_json":[
    {"icon_key":"towel","title_ro":"Solicită prosoape","title_en":"Request towels","description_ro":"Aduse rapid în cameră.","description_en":"Delivered quickly to your room.","is_active":true,"sort_order":0},
    {"icon_key":"car","title_ro":"Rezervă taxi","title_en":"Request taxi","description_ro":"Cu un singur mesaj.","description_en":"With a single message.","is_active":true,"sort_order":1},
    {"icon_key":"map-pin","title_ro":"Recomandări locale","title_en":"Local recommendations","description_ro":"Sfaturi de la oameni care chiar trăiesc aici.","description_en":"Tips from people who actually live here.","is_active":true,"sort_order":2},
    {"icon_key":"clock","title_ro":"Check-out târziu","title_en":"Late check-out","description_ro":"Când programul îți permite o dimineață liniștită.","description_en":"When your day allows a slow morning.","is_active":true,"sort_order":3}
  ]
}'::jsonb),
('home_cta', '{
  "eyebrow_ro":"Rezervă direct","eyebrow_en":"Book direct",
  "title_ro":"Cel mai bun preț e mereu pe site-ul nostru.","title_en":"The best price is always on our website.",
  "subtitle_ro":"Rezervi în câteva secunde, fără comisioane intermediare.","subtitle_en":"Book in seconds, no middleman fees.",
  "body_ro":"","body_en":"",
  "primary_cta_label_ro":"Rezervă acum","primary_cta_label_en":"Book now","primary_cta_url":"",
  "secondary_cta_label_ro":"Vorbește cu noi","secondary_cta_label_en":"Talk to us","secondary_cta_url":"/contact",
  "items_json":[
    {"icon_key":"check-circle","label_ro":"Cel mai bun preț garantat","label_en":"Best direct rate","is_active":true,"sort_order":0},
    {"icon_key":"clock","label_ro":"Confirmare rapidă","label_en":"Fast confirmation","is_active":true,"sort_order":1},
    {"icon_key":"shield","label_ro":"Fără taxe ascunse","label_en":"No hidden fees","is_active":true,"sort_order":2},
    {"icon_key":"phone","label_ro":"Suport direct","label_en":"Direct support","is_active":true,"sort_order":3}
  ]
}'::jsonb)
ON CONFLICT (section_key) DO NOTHING;
