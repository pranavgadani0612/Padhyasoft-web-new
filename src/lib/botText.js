/* =====================================================================
   Padhya Assistant – reply texts in 5 languages
   en = English · gu = ગુજરાતી · hi = हिन्दी · gujlish = Gujarati in English letters · hinglish = Hindi in English letters
   Service names, technologies and button labels stay in English on purpose (that's how clients search for them).
   ===================================================================== */
import { P } from "../data/site.js";

const PH = P.phoneDisp;

const TEXT = {
  pricing: {
    en: "Pricing depends on your project's scope, so we don't quote fixed prices in chat. You can work with us as a **Fixed-price Project**, a **Monthly Retainer** or a **Dedicated Development Team**.\n\nBook a free 20-minute consultation and you'll get a customised cost estimate within 24 hours.",
    gu: "કિંમત તમારા પ્રોજેક્ટના scope પર આધાર રાખે છે, એટલે અમે chat માં fixed કિંમત નથી કહેતા. તમે અમારી સાથે **Fixed-price Project**, **Monthly Retainer** અથવા **Dedicated Development Team** તરીકે કામ કરી શકો.\n\nફ્રી 20 મિનિટની consultation બુક કરો – 24 કલાકમાં તમને customised cost estimate મળશે.",
    hi: "कीमत आपके प्रोजेक्ट के scope पर निर्भर करती है, इसलिए हम chat में fixed कीमत नहीं बताते। आप हमारे साथ **Fixed-price Project**, **Monthly Retainer** या **Dedicated Development Team** के रूप में काम कर सकते हैं।\n\nफ्री 20 मिनट की consultation बुक कीजिए – 24 घंटे में आपको customised cost estimate मिलेगा।",
    gujlish: "Kimat tamara project na scope par aadhar rakhe che, etle ame chat ma fixed price nathi kaheta. Tame amari sathe **Fixed-price Project**, **Monthly Retainer** ke **Dedicated Development Team** tarike kaam kari shako.\n\nFree 20 minute ni consultation book karo – 24 kalak ma tamne customised cost estimate malshe.",
    hinglish: "Price aapke project ke scope par depend karti hai, isliye hum chat mein fixed price nahi batate. Aap humare saath **Fixed-price Project**, **Monthly Retainer** ya **Dedicated Development Team** ke roop mein kaam kar sakte hain.\n\nFree 20 minute ki consultation book kijiye – 24 ghante mein aapko customised cost estimate milega.",
  },
  timeline: {
    en: "Timelines depend on scope: a business website usually takes a few weeks, while ERP or mobile app projects are planned in phases over a few months. We share a clear plan and timeline after the free consultation.",
    gu: "સમય પ્રોજેક્ટ પર આધાર રાખે છે: સામાન્ય બિઝનેસ વેબસાઇટ થોડા અઠવાડિયામાં બને છે, જ્યારે ERP કે મોબાઇલ એપ થોડા મહિનામાં તબક્કાવાર બને છે. ફ્રી consultation પછી અમે ચોક્કસ plan અને timeline આપીએ છીએ.",
    hi: "समय प्रोजेक्ट पर निर्भर करता है: एक सामान्य बिज़नेस वेबसाइट कुछ हफ़्तों में बनती है, जबकि ERP या मोबाइल ऐप कुछ महीनों में चरणों में बनते हैं। फ्री consultation के बाद हम सटीक plan और timeline देते हैं।",
    gujlish: "Samay project par aadhar rakhe che: samanya business website thoda athvadiya ma bane che, jyare ERP ke mobile app thoda mahina ma step-by-step bane che. Free consultation pachhi ame clear plan ane timeline aapiye chiye.",
    hinglish: "Time project par depend karta hai: ek normal business website kuch hafton mein ban jaati hai, jabki ERP ya mobile app kuch mahino mein phases mein bante hain. Free consultation ke baad hum clear plan aur timeline dete hain.",
  },
  contactHead: { en: "", gu: "અમારો સંપર્ક:\n", hi: "हमसे संपर्क करें:\n", gujlish: "Amaro sampark:\n", hinglish: "Humse contact karein:\n" },
  locIN: { en: "Ahmedabad (head office)", gu: "અમદાવાદ (મુખ્ય ઓફિસ)", hi: "अहमदाबाद (मुख्य ऑफिस)", gujlish: "Ahmedabad (head office)", hinglish: "Ahmedabad (head office)" },
  locDK: { en: "Denmark office", gu: "ડેનમાર્ક ઓફિસ", hi: "डेनमार्क ऑफिस", gujlish: "Denmark office", hinglish: "Denmark office" },
  hoursOpen: {
    en: "Our team is available Mon – Sat, 10 AM – 7 PM IST (closed on Sundays). We're open right now!",
    gu: "અમારી ટીમ સોમ–શનિ, સવારે 10 થી સાંજે 7 (IST) ઉપલબ્ધ છે, રવિવારે રજા. અત્યારે અમે ઓનલાઇન છીએ!",
    hi: "हमारी टीम सोम–शनि, सुबह 10 से शाम 7 (IST) उपलब्ध है, रविवार को छुट्टी। अभी हम ऑनलाइन हैं!",
    gujlish: "Amari team Som–Shani, 10 AM thi 7 PM (IST) available che, Ravivare raja. Atyare ame online chiye!",
    hinglish: "Humari team Mon–Sat, 10 AM se 7 PM (IST) available hai, Sunday ko chhutti. Abhi hum online hain!",
  },
  hoursClosed: {
    en: "Our team is available Mon – Sat, 10 AM – 7 PM IST (closed on Sundays). We're outside office hours right now – leave your details and we'll reply on the next working day.",
    gu: "અમારી ટીમ સોમ–શનિ, સવારે 10 થી સાંજે 7 (IST) ઉપલબ્ધ છે, રવિવારે રજા. અત્યારે ઓફિસ સમય નથી – તમારી વિગત મૂકો, અમે આગલા કામકાજના દિવસે જવાબ આપીશું.",
    hi: "हमारी टीम सोम–शनि, सुबह 10 से शाम 7 (IST) उपलब्ध है, रविवार को छुट्टी। अभी ऑफिस का समय नहीं है – अपनी जानकारी छोड़िए, हम अगले कामकाजी दिन जवाब देंगे।",
    gujlish: "Amari team Som–Shani, 10 AM thi 7 PM (IST) available che, Ravivare raja. Atyare office samay nathi – tamari details muko, ame aagla working day e jawab aapishu.",
    hinglish: "Humari team Mon–Sat, 10 AM se 7 PM (IST) available hai, Sunday ko chhutti. Abhi office time nahi hai – apni details chhodiye, hum agle working day jawab denge.",
  },
  whatsapp: {
    en: "Sure! Tap below to continue on WhatsApp with our team.",
    gu: "ચોક્કસ! નીચે ટેપ કરો અને WhatsApp પર અમારી ટીમ સાથે વાત કરો.",
    hi: "ज़रूर! नीचे टैप कीजिए और WhatsApp पर हमारी टीम से बात कीजिए।",
    gujlish: "Chokkas! Niche tap karo ane WhatsApp par amari team sathe vaat karo.",
    hinglish: "Zaroor! Neeche tap kijiye aur WhatsApp par humari team se baat kijiye.",
  },
  call: {
    en: `You can call us on ${PH} (Mon – Sat, 10 AM – 7 PM IST).`,
    gu: `અમને ${PH} પર કૉલ કરો (સોમ–શનિ, 10 AM – 7 PM IST).`,
    hi: `हमें ${PH} पर कॉल कीजिए (सोम–शनि, 10 AM – 7 PM IST)।`,
    gujlish: `Amne ${PH} par call karo (Som–Shani, 10 AM – 7 PM IST).`,
    hinglish: `Humein ${PH} par call kijiye (Mon–Sat, 10 AM – 7 PM IST).`,
  },
  thanks: {
    en: "You're welcome! Anything else I can help you with? 😊",
    gu: "તમારું સ્વાગત છે! 😊 બીજી કોઈ મદદ કરી શકું?",
    hi: "आपका स्वागत है! 😊 और कोई मदद कर सकता हूँ?",
    gujlish: "Tamaru swagat che! 😊 Biji koi madad kari shaku?",
    hinglish: "Aapka swagat hai! 😊 Aur koi madad kar sakta hoon?",
  },
  bye: {
    en: "Thank you for visiting Padhya Software Technologies. Have a great day! 👋",
    gu: "Padhya Software Technologies ની મુલાકાત લેવા બદલ આભાર. તમારો દિવસ શુભ રહે! 👋",
    hi: "Padhya Software Technologies पर आने के लिए धन्यवाद। आपका दिन शुभ हो! 👋",
    gujlish: "Padhya ni mulakat leva badal aabhar. Tamaro divas saro jay! 👋",
    hinglish: "Padhya par aane ke liye shukriya. Aapka din achha ho! 👋",
  },
  about: {
    en: "Padhya Software Technologies has **7+ years** of experience, **150+ clients worldwide**, **50+ enterprise projects** and clients in **5+ countries** – India, UAE, Denmark, USA and Canada. We work with enterprises, government & PSU bodies and growing companies.",
    gu: "Padhya Software Technologies પાસે **7+ વર્ષ**નો અનુભવ, **150+ ક્લાયન્ટ્સ**, **50+ enterprise પ્રોજેક્ટ્સ** અને **5+ દેશો** (ભારત, UAE, ડેનમાર્ક, USA, કેનેડા) માં ક્લાયન્ટ્સ છે. અમે મોટી કંપનીઓ, સરકારી/PSU સંસ્થાઓ અને વધતા બિઝનેસ સાથે કામ કરીએ છીએ.",
    hi: "Padhya Software Technologies के पास **7+ साल** का अनुभव, **150+ क्लाइंट्स**, **50+ enterprise प्रोजेक्ट्स** और **5+ देशों** (भारत, UAE, डेनमार्क, USA, कनाडा) में क्लाइंट्स हैं। हम बड़ी कंपनियों, सरकारी/PSU संस्थाओं और बढ़ते बिज़नेस के साथ काम करते हैं।",
    gujlish: "Padhya pase **7+ varsh** no anubhav, **150+ clients**, **50+ enterprise projects** ane **5+ desh** (India, UAE, Denmark, USA, Canada) ma clients che. Ame moti companies, government/PSU ane growing business sathe kaam kariye chiye.",
    hinglish: "Padhya ke paas **7+ saal** ka experience, **150+ clients**, **50+ enterprise projects** aur **5+ deshon** (India, UAE, Denmark, USA, Canada) mein clients hain. Hum badi companies, government/PSU aur growing business ke saath kaam karte hain.",
  },
  portfolio: {
    en: "Here are a few examples of our work:\n• **IFFCO & large corporations** – custom ERP, CRM and enterprise automation\n• **Manufacturing & logistics** – QR/RFID track & trace and IoT factory dashboards\n• **Government & PSU** – secure, high-traffic platforms\n• **USA & Canada clients** – web and mobile products from MVP to launch\n\nIn a free consultation we can show you case studies close to your industry.",
    gu: "અમારા કામના થોડા ઉદાહરણ:\n• **IFFCO અને મોટી કંપનીઓ** – custom ERP, CRM અને automation\n• **Manufacturing & logistics** – QR/RFID track & trace અને IoT factory dashboards\n• **સરકારી & PSU** – સુરક્ષિત, high-traffic platforms\n• **USA & કેનેડાના ક્લાયન્ટ્સ** – web અને mobile products\n\nફ્રી consultation માં અમે તમારા ઉદ્યોગને લગતા case studies બતાવી શકીએ.",
    hi: "हमारे काम के कुछ उदाहरण:\n• **IFFCO और बड़ी कंपनियाँ** – custom ERP, CRM और automation\n• **Manufacturing & logistics** – QR/RFID track & trace और IoT factory dashboards\n• **सरकारी & PSU** – सुरक्षित, high-traffic platforms\n• **USA & कनाडा के क्लाइंट्स** – web और mobile products\n\nफ्री consultation में हम आपकी इंडस्ट्री से जुड़े case studies दिखा सकते हैं।",
    gujlish: "Amara kaam na thoda udaharan:\n• **IFFCO ane moti companies** – custom ERP, CRM ane automation\n• **Manufacturing & logistics** – QR/RFID track & trace ane IoT dashboards\n• **Government & PSU** – secure, high-traffic platforms\n• **USA & Canada na clients** – web ane mobile products\n\nFree consultation ma ame tamara industry ne lagta case studies batavi shakiye.",
    hinglish: "Humare kaam ke kuch examples:\n• **IFFCO aur badi companies** – custom ERP, CRM aur automation\n• **Manufacturing & logistics** – QR/RFID track & trace aur IoT dashboards\n• **Government & PSU** – secure, high-traffic platforms\n• **USA & Canada ke clients** – web aur mobile products\n\nFree consultation mein hum aapki industry se jude case studies dikha sakte hain.",
  },
  hosting: {
    en: "Yes – we can set up and manage **hosting, domain and SSL** for your website or app (cloud such as AWS / Azure, or regular web hosting) and take care of deployment and maintenance. Third-party hosting and domain charges are billed separately at actual cost.",
    gu: "હા – અમે તમારી વેબસાઇટ કે એપ માટે **hosting, domain અને SSL** સેટઅપ અને મેનેજ કરી શકીએ (AWS / Azure જેવું cloud અથવા સામાન્ય web hosting), અને deployment તથા maintenance પણ સંભાળીએ. Hosting અને domain નો ખર્ચ અલગથી, જે થાય તે મુજબ લાગે છે.",
    hi: "हाँ – हम आपकी वेबसाइट या ऐप के लिए **hosting, domain और SSL** सेटअप और मैनेज कर सकते हैं (AWS / Azure जैसा cloud या सामान्य web hosting), और deployment व maintenance भी संभालते हैं। Hosting और domain का खर्च अलग से, जितना लगे उतना होता है।",
    gujlish: "Ha – ame tamari website ke app mate **hosting, domain ane SSL** setup ane manage kari shakiye (AWS / Azure jevu cloud ke normal web hosting), ane deployment ane maintenance pan sambhaliye. Hosting ane domain no kharch alag thi, je thay te mujab lage che.",
    hinglish: "Haan – hum aapki website ya app ke liye **hosting, domain aur SSL** setup aur manage kar sakte hain (AWS / Azure jaisa cloud ya normal web hosting), aur deployment aur maintenance bhi sambhalte hain. Hosting aur domain ka kharcha alag se, jitna lage utna hota hai.",
  },
  erp: {
    en: "We build **custom ERP, CRM and automation software** for growing companies – including large corporations like IFFCO. Typical modules: finance, inventory, purchase, sales, HR and production, plus integrations with your existing tools.",
    gu: "અમે વધતી કંપનીઓ માટે **custom ERP, CRM અને automation software** બનાવીએ છીએ – IFFCO જેવી મોટી કંપનીઓ માટે પણ. સામાન્ય modules: finance, inventory, purchase, sales, HR અને production, સાથે તમારા હાલના tools સાથે integration.",
    hi: "हम बढ़ती कंपनियों के लिए **custom ERP, CRM और automation software** बनाते हैं – IFFCO जैसी बड़ी कंपनियों के लिए भी। आम modules: finance, inventory, purchase, sales, HR और production, साथ में आपके मौजूदा tools के साथ integration।",
    gujlish: "Ame growing companies mate **custom ERP, CRM ane automation software** banaviye chiye – IFFCO jevi moti companies mate pan. Modules: finance, inventory, purchase, sales, HR ane production, sathe tamara existing tools sathe integration.",
    hinglish: "Hum growing companies ke liye **custom ERP, CRM aur automation software** banate hain – IFFCO jaisi badi companies ke liye bhi. Modules: finance, inventory, purchase, sales, HR aur production, saath mein aapke existing tools ke saath integration.",
  },
  trace: {
    en: "Our QR code & track-and-trace software is our specialty: **production tracking** with QR/RFID at each station, **inventory & warehouse** automation, and **quality & compliance** with digital signatures at every checkpoint. Used by manufacturers across India, UAE and Europe.",
    gu: "QR code અને track & trace software અમારી ખાસિયત છે: દરેક સ્ટેશન પર QR/RFID થી **production tracking**, **inventory & warehouse** automation, અને દરેક checkpoint પર digital signature સાથે **quality & compliance**. ભારત, UAE અને યુરોપના manufacturers વાપરે છે.",
    hi: "QR code और track & trace software हमारी खासियत है: हर स्टेशन पर QR/RFID से **production tracking**, **inventory & warehouse** automation, और हर checkpoint पर digital signature के साथ **quality & compliance**। भारत, UAE और यूरोप के manufacturers इस्तेमाल करते हैं।",
    gujlish: "QR code ane track & trace software amari khasiyat che: darek station par QR/RFID thi **production tracking**, **inventory & warehouse** automation, ane darek checkpoint par digital signature sathe **quality & compliance**. India, UAE ane Europe na manufacturers vapre che.",
    hinglish: "QR code aur track & trace software humari khasiyat hai: har station par QR/RFID se **production tracking**, **inventory & warehouse** automation, aur har checkpoint par digital signature ke saath **quality & compliance**. India, UAE aur Europe ke manufacturers use karte hain.",
  },
  process: {
    en: "Our process has 4 steps:\n1. Understanding your requirements\n2. Planning and strategy\n3. Design and development\n4. Deployment and ongoing support",
    gu: "અમારી પ્રક્રિયા 4 પગલાંની છે:\n1. તમારી જરૂરિયાત સમજવી\n2. Planning અને strategy\n3. Design અને development\n4. Deployment અને સતત support",
    hi: "हमारी प्रक्रिया के 4 चरण हैं:\n1. आपकी ज़रूरत समझना\n2. Planning और strategy\n3. Design और development\n4. Deployment और लगातार support",
    gujlish: "Amari process 4 step ni che:\n1. Tamari jaruriyat samajvi\n2. Planning ane strategy\n3. Design ane development\n4. Deployment ane satat support",
    hinglish: "Humara process 4 steps ka hai:\n1. Aapki requirement samajhna\n2. Planning aur strategy\n3. Design aur development\n4. Deployment aur lagatar support",
  },
  hire: {
    en: "Yes – you can hire a **dedicated development team** from us on a monthly basis. It's ideal for ongoing products or long-term work. Tell us what skills you need.",
    gu: "હા – તમે અમારી પાસેથી મહિનાના ધોરણે **dedicated development team** રાખી શકો. ચાલુ products કે લાંબા ગાળાના કામ માટે આ શ્રેષ્ઠ છે. તમને કઈ skills જોઈએ છે તે કહો.",
    hi: "हाँ – आप हमसे महीने के आधार पर **dedicated development team** रख सकते हैं। चल रहे products या लंबे समय के काम के लिए यह सबसे अच्छा है। आपको कौन-सी skills चाहिए, बताइए।",
    gujlish: "Ha – tame amari pase thi monthly basis par **dedicated development team** rakhi shako. Chalu products ke lamba gala na kaam mate aa best che. Tamne kai skills joie che te kaho.",
    hinglish: "Haan – aap humse monthly basis par **dedicated development team** hire kar sakte hain. Ongoing products ya long-term kaam ke liye yeh best hai. Aapko kaun-si skills chahiye, bataiye.",
  },
  support: {
    en: "Yes, we provide ongoing support and maintenance after launch – bug fixes, updates, monitoring and new features, usually on a monthly retainer.",
    gu: "હા, launch પછી પણ અમે support અને maintenance આપીએ છીએ – bug fix, updates, monitoring અને નવા features, સામાન્ય રીતે monthly retainer પર.",
    hi: "हाँ, launch के बाद भी हम support और maintenance देते हैं – bug fix, updates, monitoring और नए features, आमतौर पर monthly retainer पर।",
    gujlish: "Ha, launch pachhi pan ame support ane maintenance aapiye chiye – bug fix, updates, monitoring ane nava features, mostly monthly retainer par.",
    hinglish: "Haan, launch ke baad bhi hum support aur maintenance dete hain – bug fix, updates, monitoring aur naye features, mostly monthly retainer par.",
  },
  servicesIntro: {
    en: "We offer these services – tap one to learn more:",
    gu: "અમે આ સેવાઓ આપીએ છીએ – વધુ જાણવા માટે એક પસંદ કરો:",
    hi: "हम ये सेवाएँ देते हैं – और जानने के लिए एक चुनिए:",
    gujlish: "Ame aa services aapiye chiye – vadhu janva ek pasand karo:",
    hinglish: "Hum ye services dete hain – aur jaanne ke liye ek chuniye:",
  },
  menu: { en: "What would you like to know?", gu: "તમે શું જાણવા માંગો છો?", hi: "आप क्या जानना चाहेंगे?", gujlish: "Tame shu janva mango cho?", hinglish: "Aap kya jaanna chahenge?" },
  faqLead: { en: "", gu: "આ રહ્યો જવાબ 👇\n\n", hi: "यह रहा जवाब 👇\n\n", gujlish: "Aa rahyo jawab 👇\n\n", hinglish: "Yeh raha jawab 👇\n\n" },
  blogsLead: {
    en: "We have articles on this that may help:",
    gu: "આ વિષય પર અમારા લેખ:",
    hi: "इस विषय पर हमारे लेख:",
    gujlish: "Aa vishay par amara articles:",
    hinglish: "Is topic par humare articles:",
  },
  /* lead-capture flow */
  bookStart: {
    en: "Great – let's book your **free 20-minute consultation**. It only takes a minute.\n\nWhat's your full name?",
    gu: "સરસ – ચાલો તમારી **ફ્રી 20 મિનિટની consultation** બુક કરીએ. ફક્ત એક મિનિટ લાગશે.\n\nતમારું પૂરું નામ શું છે?",
    hi: "बढ़िया – चलिए आपकी **फ्री 20 मिनट की consultation** बुक करते हैं। बस एक मिनट लगेगा।\n\nआपका पूरा नाम क्या है?",
    gujlish: "Saras – chalo tamari **free 20 minute ni consultation** book kariye. Fakt ek minute lagshe.\n\nTamaru puru naam shu che?",
    hinglish: "Badhiya – chaliye aapki **free 20 minute ki consultation** book karte hain. Bas ek minute lagega.\n\nAapka poora naam kya hai?",
  },
  askNameAgain: { en: "Please enter your full name.", gu: "કૃપા કરીને તમારું પૂરું નામ લખો.", hi: "कृपया अपना पूरा नाम लिखिए।", gujlish: "Krupa kari tamaru puru naam lakho.", hinglish: "Kripya apna poora naam likhiye." },
  askEmail: {
    en: "Nice to meet you, {name}! What's your email address?",
    gu: "તમને મળીને આનંદ થયો, {name}! તમારું email address શું છે?",
    hi: "आपसे मिलकर खुशी हुई, {name}! आपका email address क्या है?",
    gujlish: "Tamne mali ne aanand thayo, {name}! Tamaru email address shu che?",
    hinglish: "Aapse milkar khushi hui, {name}! Aapka email address kya hai?",
  },
  badEmail: {
    en: "That email doesn't look right. Please check and type it again (e.g. name@company.com).",
    gu: "આ email બરાબર નથી લાગતો. ફરી ચેક કરીને લખો (જેમ કે name@company.com).",
    hi: "यह email सही नहीं लग रहा। दोबारा चेक करके लिखिए (जैसे name@company.com)।",
    gujlish: "Aa email barabar nathi lagto. Fari check kari ne lakho (jem ke name@company.com).",
    hinglish: "Yeh email sahi nahi lag raha. Dobara check karke likhiye (jaise name@company.com).",
  },
  askPhone: {
    en: "Thanks! And your phone number (with country code)?",
    gu: "આભાર! હવે તમારો ફોન નંબર (country code સાથે)?",
    hi: "धन्यवाद! अब आपका फ़ोन नंबर (country code के साथ)?",
    gujlish: "Aabhar! Have tamaro phone number (country code sathe)?",
    hinglish: "Shukriya! Ab aapka phone number (country code ke saath)?",
  },
  badPhone: {
    en: "Please enter a valid phone number, e.g. +91 98765 43210.",
    gu: "કૃપા કરીને સાચો ફોન નંબર લખો, જેમ કે +91 98765 43210.",
    hi: "कृपया सही फ़ोन नंबर लिखिए, जैसे +91 98765 43210।",
    gujlish: "Krupa kari sacho phone number lakho, jem ke +91 98765 43210.",
    hinglish: "Kripya sahi phone number likhiye, jaise +91 98765 43210.",
  },
  askServiceKnown: {
    en: "Got it. You're interested in **{service}**. Briefly, what would you like to build?",
    gu: "સમજાયું. તમને **{service}** માં રસ છે. ટૂંકમાં, તમારે શું બનાવવું છે?",
    hi: "समझ गया। आपको **{service}** में रुचि है। संक्षेप में, आप क्या बनवाना चाहते हैं?",
    gujlish: "Samjayu. Tamne **{service}** ma ras che. Tunk ma, tamare shu banavvu che?",
    hinglish: "Samajh gaya. Aapko **{service}** mein interest hai. Short mein, aap kya banwana chahte hain?",
  },
  askService: { en: "Which service are you interested in?", gu: "તમને કઈ સેવામાં રસ છે?", hi: "आपको किस सेवा में रुचि है?", gujlish: "Tamne kai service ma ras che?", hinglish: "Aapko kis service mein interest hai?" },
  askMessage: {
    en: "Briefly, what would you like to build? (or tap Skip)",
    gu: "ટૂંકમાં, તમારે શું બનાવવું છે? (અથવા Skip દબાવો)",
    hi: "संक्षेप में, आप क्या बनवाना चाहते हैं? (या Skip दबाइए)",
    gujlish: "Tunk ma, tamare shu banavvu che? (athva Skip dabavo)",
    hinglish: "Short mein, aap kya banwana chahte hain? (ya Skip dabaiye)",
  },
  confirm: { en: "Please confirm your details:", gu: "કૃપા કરીને તમારી વિગત ચકાસો:", hi: "कृपया अपनी जानकारी की पुष्टि कीजिए:", gujlish: "Krupa kari tamari details check karo:", hinglish: "Kripya apni details confirm kijiye:" },
  sent: {
    en: "Thank you, {name}! ✅ Your consultation request has been sent. Our team will contact you within 24 hours with a customised cost estimate.",
    gu: "આભાર, {name}! ✅ તમારી consultation request મોકલાઈ ગઈ છે. અમારી ટીમ 24 કલાકમાં customised cost estimate સાથે તમારો સંપર્ક કરશે.",
    hi: "धन्यवाद, {name}! ✅ आपकी consultation request भेज दी गई है। हमारी टीम 24 घंटे में customised cost estimate के साथ आपसे संपर्क करेगी।",
    gujlish: "Aabhar, {name}! ✅ Tamari consultation request mokalai gai che. Amari team 24 kalak ma customised cost estimate sathe tamaro sampark karshe.",
    hinglish: "Shukriya, {name}! ✅ Aapki consultation request bhej di gayi hai. Humari team 24 ghante mein customised cost estimate ke saath aapse contact karegi.",
  },
  ready: {
    en: "Thank you, {name}! ✅ Your consultation request is ready.\n\nTap below to send it to our team on WhatsApp right away.",
    gu: "આભાર, {name}! ✅ તમારી consultation request તૈયાર છે.\n\nનીચે ટેપ કરીને તરત WhatsApp પર અમારી ટીમને મોકલો.",
    hi: "धन्यवाद, {name}! ✅ आपकी consultation request तैयार है।\n\nनीचे टैप करके तुरंत WhatsApp पर हमारी टीम को भेजिए।",
    gujlish: "Aabhar, {name}! ✅ Tamari consultation request taiyar che.\n\nNiche tap kari ne tarat WhatsApp par amari team ne moklo.",
    hinglish: "Shukriya, {name}! ✅ Aapki consultation request taiyar hai.\n\nNeeche tap karke turant WhatsApp par humari team ko bhejiye.",
  },
  cancelled: {
    en: "No problem, I've cancelled that. Anything else I can help with?",
    gu: "કોઈ વાંધો નહીં, મેં રદ કર્યું. બીજી કોઈ મદદ કરી શકું?",
    hi: "कोई बात नहीं, मैंने रद्द कर दिया। और कोई मदद कर सकता हूँ?",
    gujlish: "Koi vandho nahi, me cancel karyu. Biji koi madad kari shaku?",
    hinglish: "Koi baat nahi, maine cancel kar diya. Aur koi madad kar sakta hoon?",
  },
  /* lead-in shown above English service details */
  svcLead: {
    en: "",
    gu: "હા, અમે **{service}** ની સેવા આપીએ છીએ 👍 વિગત:\n\n",
    hi: "हाँ, हम **{service}** की सेवा देते हैं 👍 विवरण:\n\n",
    gujlish: "Ha, ame **{service}** ni service aapiye chiye 👍 Vigat:\n\n",
    hinglish: "Haan, hum **{service}** ki service dete hain 👍 Details:\n\n",
  },
};

/* T("pricing", "gu", { name }) → text in that language (falls back to English) */
export function T(key, lang = "en", vars = {}) {
  const row = TEXT[key] || {};
  let s = row[lang] ?? row.en ?? "";
  for (const [k, v] of Object.entries(vars)) s = s.split(`{${k}}`).join(v);
  return s;
}
