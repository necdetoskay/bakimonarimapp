# Bakım Onarım Uygulaması - Docker Kurulumu

Bu belge, Bakım Onarım uygulamasını Docker ortamında çalıştırmak için gerekli adımları içerir.

## Gereksinimler

- Docker
- Docker Compose

## Kurulum ve Çalıştırma

1. Projeyi klonlayın:
   ```bash
   git clone https://github.com/kullaniciadi/bakimonarimapp.git
   cd bakimonarimapp
   ```

2. Docker Compose ile uygulamayı başlatın:
   ```bash
   docker-compose up -d
   ```

   Bu komut:
   - PostgreSQL veritabanını başlatır
   - Uygulamayı derler ve başlatır
   - Veritabanı şemasını oluşturur
   - Dummy verileri yükler

3. Uygulama hazır olduğunda, tarayıcınızda aşağıdaki adresi açın:
   ```
   http://localhost:3000
   ```

## Giriş Bilgileri

Uygulama, seed işlemi sırasında aşağıdaki kullanıcıları oluşturur:

- **Admin Kullanıcı**
  - Email: admin@bakimonarim.com
  - Şifre: password123

- **Tekniker Kullanıcı**
  - Email: tekniker@bakimonarim.com
  - Şifre: password123

- **Yönetici Kullanıcı**
  - Email: yonetici@bakimonarim.com
  - Şifre: password123

## Veritabanı Bilgileri

- **Host**: localhost
- **Port**: 5432
- **Database**: bakimonarimapp
- **Username**: postgres
- **Password**: P@ssw0rd

## Uygulamayı Durdurma

Uygulamayı durdurmak için:
```bash
docker-compose down
```

Veritabanı verilerini de silmek için:
```bash
docker-compose down -v
```

## Sorun Giderme

- **Veritabanı Bağlantı Hatası**: Veritabanının başlaması birkaç saniye sürebilir. Uygulama otomatik olarak veritabanının hazır olmasını bekleyecektir.

- **Seed Hatası**: Eğer seed işlemi sırasında hata alırsanız, container loglarını kontrol edin:
  ```bash
  docker-compose logs nextjs
  ```

- **Uygulama Erişim Hatası**: Uygulamanın başlaması birkaç saniye sürebilir. Eğer erişim sorunu yaşıyorsanız, container durumunu kontrol edin:
  ```bash
  docker-compose ps
  ```

docker build -t bakimonarimapp .