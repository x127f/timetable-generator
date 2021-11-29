## Kaynaklar (bir ders için):

-   Oda
-   Öğretmen
-   Sınıf
-   Öğrenci
-   Zaman
-   Ders

## Oda:

-   Tanıtıcı
-   Ad/tanım
-   Oda türü
-   Oda boyutu
-   Oda meşguliyet süresi (["xx:xx - xx:xx"])

## Zaman:

-   Ders saatleri arası boşluklar (oda değişimi, ara, havalandırma, tartışmalar)
-   Öğrenci ve öğretmenler uygun zamanlarda (veya sabit zamanlarda) ara vermelidirler

## Öğretmen:

-   Adı
-   Türü (Öğretmen, Profesör, Dışarıdan Gelen Eğitici)
-   Dersler
-   Uygunluk

## Öğrenci:

-   Adı
-   Dersler

## Action/query:

-   Kaynak (öğretmen, oda, ders) zaman aralığında uygun mu?
-   Öncelik ayarla
-   Sıkı/gevşek kısıtlar ayarla

## Örnek kısıtlar:

-   Öğretmen + ders + öğrenci aynı anda yalnız bir odada olabilir
-   Ders yalnız belli bir odada gerçekleşebilir
-   Dersler hafta boyunca belli bir sıra ile gerçekleşmeli
-   Ders saatleri arası boşluklar en aza indirgenmeli
-   Farklı odalar/tesisler arası yürüme süreleri en aza indirgenmeli

## Algoritma

Takvimleme için meta-sezgisel evrimsel bir algoritma

Değişkenler (G = Kuşak, P = Nüfus, T = Durma eşiği, S = Seçilim yüzdesi, M = Mutasyon olasılığı)

-   Tüm kaynakları yükle
-   Tüm kuralları yükle ve önceliklerine göre sırala
-   Başarım T tekrar sonrası iyileşmeyinceye veya kullanıcı elle durduruncaya dek tekrarla
    -   G kez tekrarla:
        -   P kez tekrarla:
            -   Rastgele bir tablo ile veya önceki tekrarın tablosu ile başla
            -   Bu tekrarın başarımına 0 ata
            -   Her kaynak için her kuralı işlet
                -   Kural tatmin edildiyse, önceliği başarıma eklenir
                -   Kural ihlal edildiyse, önceliği başarımdan düşülür
                -   Gerek koşul ihlal edildiyse, başarım sıfır olarak ayarlanır ve bu çevrim sonlanır
    -   Sonuçları kaydeder ve başarımlarına göre sıralar
    -   Seçim (En iyi tekrarların yüzde S'lik kısmı seçilir)
    -   Rekombinasyon (seçilen iki tekrar arasında kimi girdiler yer değişir)
    -   Mutasyon (kimi girdiler M olasılıkla değiştirilir)
    -   Doldurma (100% - S'lik kısmı ayrıca rastgele üretilen tablolarla doldurulur)

## Şema:

```json
[
	{
		"and": [
			{
				"or": [
					{
						"equals": "1==1"
					},
					{
						"equals": "1==0"
					}
				]
			},
			{
				"equals": "1==1"
			}
		]
	}
]
```

```json
{
	"ressources": {
		"lehrer": {}
	}
}
```
