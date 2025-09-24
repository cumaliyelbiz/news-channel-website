import WebLayout from "@/web-components/layout/Layout"

export default function Reklam() {
  return (
    <WebLayout>
      <div className="py-10">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-8">Reklam</h1>

          <div className="prose max-w-none">
            <p className="mb-4">
              XXXXX, Türkiye&rsquo;nin önde gelen bölgesel televizyon kanallarından biridir. Geniş bir izleyici kitlesine sahip olan kanalımızda reklam vermek markanız için önemli bir tanıtım fırsatıdır.
            </p>

            <h2 className="text-xl font-bold mt-8 mb-4">Reklam Fırsatları</h2>

            <ul className="list-disc pl-5 mb-6">
              <li>TV Reklamları</li>
              <li>Program Sponsorlukları</li>
              <li>Alt Bant Reklamları</li>
              <li>Logo Yerleştirme</li>
              <li>Ürün Yerleştirme</li>
              <li>Web Sitesi Banner Reklamları</li>
            </ul>
            <h2 className="text-xl font-bold mt-8 mb-4">Neden XXXXX&rsquo;de Reklam Vermelisiniz?</h2>

            <ul className="list-disc pl-5 mb-6">
              <li>Geniş bir izleyici kitlesine ulaşım</li>
              <li>Bölgesel ve ulusal tanıtım imkanı</li>
              <li>Rekabet edebilir fiyatlar</li>
              <li>Farklı reklam formatları</li>
              <li>Profesyonel destek</li>
            </ul>

            <h2 className="text-xl font-bold mt-8 mb-4">İletişim</h2>

            <p className="mb-2">
              Reklam fırsatları hakkında detaylı bilgi almak için lütfen bizimle iletişime geçin:
            </p>

            <p className="mb-2">
              <strong>Telefon:</strong> 444 0 444
            </p>

            <p className="mb-2">
              <strong>E-mail:</strong> reklam@XXXXX.com.tr
            </p>

            <p className="mt-8">
              Size özel reklam çözümleri için ekibimiz hizmetinizdedir.
            </p>
          </div>
        </div>
      </div>
    </WebLayout>
  );
}
