# Walkthrough: az okumayla proje ve tecrübe devri

Walkthrough'un amacı, yeni ajana en az token harcatarak projenin bugününü ve bugüne taşınan tecrübeleri kavratmaktır. Başarı ölçütü, ajanın önemli geçmişi yeniden araştırmadan doğru yerden ve öğrenilmiş dersleri kullanarak devam edebilmesidir.

**İlk benimsemede bu rehberin tamamını oku.** Token tasarrufu, çalışma yöntemini öğrenmeyi atlama gerekçesi değildir. Bu oturumun bağlamında aynı rehberin veya eşdeğerinin tamamı zaten okunmuş ve değişmemişse tekrar okumak gerekmez. Aşağıdaki dosya adından seçme yöntemi tarihli olay kayıtları içindir; rehberin ilk okunmasına uygulanmaz.

## Token tasarrufunun kapsamı ve uygulaması

**Bu rehberdeki token tasarrufu hedefi yalnızca Walkthrough'u okuma, yazma ve bakım sürecine aittir.** Walkthrough dışındaki işlerde token tasarrufu yapılması veya yapılmaması hakkında bir hüküm içermez. Diğer işlerin token kullanımı kendi bağlamı ve geçerli kullanıcı talimatlarıyla değerlendirilir; bu rehberden o alanlara yönelik bir sonuç çıkarılmaz. Bu sınır, başka bir token talimatını genişletmez veya geçersiz kılmaz.

Walkthrough için her okuma ve yazma adımında en az tokenla doğru aktarımı hedefle:

- **Elindeki bilgiyi kullan:** Kayıt yazarken zaten öğrendiğin bulguları, yapılan doğrulamayı ve güncel bağlamı esas al. Aynı sonucu yeniden okumak veya aynı testi tekrarlamak için kayıt yazımını gerekçe yapma. Sırf kaydı doldurmak için bütün depoyu, Git tarihini veya sohbet arşivini tarama. Eksik bir olgu gerekiyorsa yalnızca onu kontrol et; elde olmayan geçmişi uydurma.
- **İçeriği açmadan seç:** Önce sınırlı sayıda dosya adı gör; ilgisiz kayıtların içeriklerini modele taşıma. Bir araç çağrısıyla bütün dosyaları okumak, az çağrı yapılmış olsa da token tasarrufu değildir. Dosya adlarıyla çözülemeyen belirli bir boşluk varsa ilgili kayıt veya bölüme geç.
- **Aynı bilgiyi yeniden yükleme:** Önce rehberin tamamını okuyarak yöntemi öğren. Ancak bu oturumun bağlamında bütünüyle okunmuş ve değişmemiş metnin tekrarını atla. Beceri referansı ile projeye yerleştirilmiş eşdeğer rehberden birini tam okumak yeterlidir. Genel çerçeve ve gerekli deneyim edinildiğinde ek olay kaydı okumayı durdur.
- **Doğrudan özü yaz:** Önce uzun bir anlatı yazıp ardından defalarca kısaltmak yerine, baştan yalnızca durumu, yaklaşımı değiştiren bulguyu ve sonucu yaz. Boş başlıklar, dosya envanterleri, uzun alıntılar, loglar, kod farkları ve aynı bilginin farklı biçimlerde tekrarları bulunmasın. Ayrıntıya bağlantı ver; her bağlantıyı okuma zorunluluğuna dönüştürme.
- **Bakımın kendisini büyütme:** Sırf kısaltma veya düzeltme için eski kayıtları dolaşma. Yeni birikim kaydı ancak sonraki okumaları gerçekten azaltıyorsa oluşturulsun. Salt bu süreç için token sayacı, yeni arama altyapısı veya tekrar eden analiz düzeni kurma.
- **Anlamı koru:** Kısa yazmak için anlaşılmaz kısaltmalar kullanma, önemli bir koşulu silme veya yanlış bir genelleme yapma. Sonraki ajan eksik bırakılan bilgiyi yeniden araştıracaksa görünüşte kısa metin toplam tüketimi artırır. Sabit bir sözcük sınırını doldurmak yerine, doğru kavrayış için gereken en kısa anlatımı seç.

## Neyin kaydı tutulur?

Sonraki çalışmayı etkileyen olayın nedenini, sonucunu ve öğrenilen dersi koru. Yanlış varsayımı değiştiren bulgu, sonuç veren yaklaşım, gerekçeli bir yön değişikliği veya devamı etkileyen bir durum bu kapsama girebilir. Konuları projenin gerçek işlerinden çıkar; sabit bir kategori listesi uygulama.

Git değişen kodun ve dosyaların tarihidir; Walkthrough bu tarihin cümleleştirilmiş hâli değildir. Dosya ve commit listelerini, bütün denemelerin sırasını, araç çağrılarını veya çalışma gününü anlatma. Genel internet bilgisini tekrarlama.

Docs, tekrar kullanılabilir kalıcı bilgiyi gerektiği derinlikte anlatır; bu rehber onun token kullanımını belirlemez. Walkthrough ise yaşananlardan süzülen bağlamı ve tecrübeyi en az okumayla devreder. Yöntemin uygulama ayrıntıları Docs'taysa burada denemeye neden ihtiyaç duyulduğunu, yaklaşımı değiştiren bulguyu ve sonucu anlatıp ilgili belgeye bağlan. İkisini birbirinin kopyası yapma.

## Yeni dosyalarla ilerle

Her anlamlı kayıt yeni bir Markdown dosyasıdır. Tecrübe veya devralmayı etkileyen bir sonuç oluştuğunda ve işi bırakmadan önce, ayrıca istenmesini beklemeden kaydet; bütün proje görevinin tamamlanmasını bekleme. Yeni bilgi yoksa boş kayıt açma, doğrulanmamış bir denemeyi çözüm gibi sunma. Temel kurarken eldeki doğrulanmış güncel bilgiden bir başlangıç kaydı oluştur; bilinmeyen eski tecrübeleri uydurma.

Dosya adı şu biçimdedir:

```text
2026.09.28 22.18.46 - Çifte işleme sorununun durum kontrolüyle giderilmesi.md
```

Bu ad varsayımsal bir örnektir. Gerçekte kaydın oluşturulduğu yerel tarih ve saati saniyesiyle kullan. PowerShell'de biçim `Get-Date -Format 'yyyy.MM.dd HH.mm.ss'` ile alınabilir. Geçmiş bir olay sonradan yazılıyorsa dosya adı yazım zamanını taşır; olayın zamanı anlamı etkiliyorsa içerikte belirtilir.

Başlık, okuyucuya konuyu ve ne olduğunu söylemelidir: belirti veya neden, yaklaşım ve sonucu anlamı koruyan kısa bir ifadede birleştir. “Güncelleme”, “çeşitli düzeltmeler” ve “çalışma özeti” gibi seçim yaptırmayan adlar kullanma. Anlaşılmaz kısaltmalarla yer kazanmaya çalışma. Dosya adına uygun karakterler kullan; aynı ad varsa üzerine yazma, başlığı ayırt edici hâle getir.

## Kısa fakat devralınabilir yaz

Normal kayıt için birkaç kısa paragraf çoğunlukla yeterlidir. Başlıkları içerik gerektiriyorsa kullan; her dosyada boş bir form doldurma. Şunları taşı:

- **Güncel çerçeve:** Projenin amacı veya ana bağlamı, geldiği durum, geçerli çalışma yönü ve varsa devamı etkileyen açık meseleler. En yeni dosyadan genel durumu anlayacak kadar kısa ve kendi başına anlaşılır olsun. Önceki çerçevedeki hâlâ geçerli önemli bilgiyi sıkıştırarak devret; son olay bütün proje sanılmasın. Çözüldüğüne dair bilgi olmayan bir engeli kendiliğinden düşürme.
- **Olay ve tecrübe:** Ne yanlış varsayılmıştı veya hangi sorun vardı? Hangi gözlem yaklaşımı değiştirdi? Ne yapıldı ve sonuç ne oldu? Yalnızca anlamı olan halkaları yaz; ham düşünme dökümünü ve denemelerin kronolojisini taşıma.
- **Devam için anlamı:** Sonraki ajan bu bilgiden dolayı neyi farklı yapmalı veya neyi yeniden denememeli? Gerekliyse ayrıntı belgesine, ilgili eski kayda veya son birikim kaydına bağlantı ver.

Bu parçalar birlikte tek kısa anlatım da olabilir. Aynı bilgiyi hem paragrafta hem maddelerde tekrarlama. Güncel çerçeveyi geçmiş olaylarla büyütme; yaşanan olayın tarihiyle bugünkü talimatı karıştırma. Bir durum iddiasını bildiğin son doğrulamaya dayandır, varsayımı doğrulanmış sonuç gibi yazma. Özür, kendini övme, duygu anlatısı ve konuşma dökümü ekleme.

## Önce dosya adından seç, sonra içeriği oku

1. Dosya adlarından en yeni kaydı ve varsa adında “Birikim” geçen en yeni birikim kaydını bul. Birikimi bulmak için son kayıttan bağlantı verilmiş olmasına güvenme. En yeni güncel çerçeveyi oku; birikimin kapsamından gereken genel geçmişi edin. Aynı dosyayı iki kez okuma.
2. Birikimin kapsadığı son kayıttan sonra eklenen kayıtların adlarından, bugünkü kavrayışa veya göreve katkı yapan deneyimleri seç; yalnız seçilen içerikleri aç. En son olay ve birikim arasındaki dersleri atlama. Birikim yoksa yakın kayıt adları ve belirli bilgi boşluklarıyla başla; bütün arşivi okuma zorunluluğu çıkarma. Uzun ad listesini parçalar hâlinde incele.
3. Eski bir konu gerekiyorsa dosya adlarında konu sözcüklerini ara ve eşleşmeleri en yeniden değerlendir. Eski bir dersi uygulamadan önce, aynı konuda onu değiştiren daha yeni kayıt bulunup bulunmadığına adlardan bak; varsa ilgili içeriği oku. Bu kontrolü her dosya okumasında tekrarlama.
4. Amaç, son durum, ilgili kararlar ve deneyimler anlaşılınca dur. Sırf bir bağlantı var diye hedef dosyayı açma. Kayıt sonrasında değişmiş olabilecek gerçek durumu, mevcut iş için gerektiği kadar kontrol et.

Yönlendirmeyi tarihli, anlamlı dosya adları sağlar. Her yeni kayıtta düzenlenmesi gereken zorunlu bir içindekiler dosyasına veya merkezî durum dosyasına bağımlı olma. Mevcut bir gezinme aracı varsa kullan, sırf bu iş için yeni altyapı kurma.

## Birikimi gerektiğinde yeni bir kayıtta süz

Yeni ajanın aynı bağlamı kurmak için giderek çok sayıda dosya açması gerekiyorsa yeni tarihli bir birikim kaydı yaz. Başlıkta “Birikim” ile birlikte kapsanan konuları ve varılan durumu belirt; tek başına “Özet” deme. Bu, eski dosyaları düzenlemek veya silmek değildir.

Bilinen başlangıçtan bugüne ana yön değişikliklerini, tekrar edilmemesi gereken deneyimleri ve bugünkü çerçeveyi kısa bir bütün hâlinde aktar. Kapsadığı konuları ve son kaydı başta bir cümlede belirt; kapsanmayan geçmişi öğrenilmiş saydırma. Önceki birikim varsa onu temel al; sonrasında eklenen anlamlı dersleri birleştir. Her seferinde tüm arşivi yeniden okuma. Yeni normal kayıtlar son birikime doğrudan bağlanabilir; bütün ara kayıtları açtıran zorunlu bir bağlantı zinciri oluşturma.

Süzmek, yalnızca en yeni bilgiyi bırakmak değildir. Önceki kararı değiştiren bulgu ve başka bir sorunda da işe yarayacak deneyim korunur; tekrarlar ve bugünkü kavrayışa katkısı olmayan işlem ayrıntıları çıkarılır. Kaynak kayıtlar ayrıntı gerektiğinde adlarından bulunabilir kalır. Sırf takvim ilerledi veya belirli dosya sayısına ulaşıldı diye sentez üretme.

## Yanlışlanan bilgiyi düzelt

Düzeltmeyi öncelikle yeni kayıtta açıkça anlat: hangi eski çıkarım, hangi bulgu nedeniyle değişti ve doğru bilgi ne? Yeni dosya başlığında eski konunun aranabilir adını ve değişen sonucu koru; aynı konu araması düzeltmeyi de bulabilsin. Yanlışlanmış yaklaşımı hâlâ geçerli bir ders gibi devretme. Mümkünse ilgili eski kayda doğrudan bağlantı ver.

İlgili eski kayıt zaten biliniyorsa veya çalışma sırasında karşılaşılmışsa, ayrı araştırma ve bakım turu yapmadan ona da zaman damgalı kısa bir düzeltme eklenebilir. Bu isteğe bağlıdır; yeni kaydın doğru anlaşılması eski kaydın düzenlenmesine bağlı kalmaz. Düzeltilecek ifadeyi silip yeniden yazma. Gerçekten yanlış olduğu gösterilen ifadede Markdown üstünü çizme biçimi `~~yanlış ifade~~` kullanılabilir; özgün metin okunabilir kalsın.

Eklenen açıklama `Düzeltme — YYYY.MM.DD HH.mm.ss` başlığında gerçek zamanı, doğru bilgiyi ve onu gösteren bulguyu taşısın; gerekirse yeni kayda bağlansın. Eski ifade yazıldığı anda doğruysa ve durum sonradan değiştiyse üstünü çizme; tarihli bir geçerlilik değişikliği açıklaması ekle. Eski kayıtları düzeltmek için arşiv taraması başlatma.

Yazdığın kaydın adının seçim yaptırdığını, güncel çerçevenin dayanaklarla tutarlı olduğunu ve eklediğin gerçek bağlantıların hedefe ulaştığını kontrol et. Kontrolü yeni kayda ve varsa yaptığın küçük düzeltmeye sınırla.
