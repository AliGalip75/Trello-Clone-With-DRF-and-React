# Project Context: Kanban Board (Trello Clone)

## 1.  Tech Stack
- **Frontend:** React (Vite ile), TypeScript, Tailwind CSS, Shadcn UI, Zustand (State Management), React Query.
- **Backend:** Python, Django, Django REST Framework (DRF).
- **Database:** PostgreSQL.
- **Caching/Queue:** Redis.
- **Auth:** JWT (Simple JWT).
- **Containerization:** Docker & Docker Compose.

## 2. 📍 Current Status (Güncel Durum)
- **Tamamlananlar:**
  - [x] Proje kurulumu (Docker olmadan venv ile kurulumu tamamlandı).
  - [x] Backend: Card, List, Card, Board modelleri yazıldı, bunların serlaizer'ları, view'leri ve testleri yazıldı.
  - [x] Backend: JWT ayarları yapıldı.
  - [x] Backend: User modeli yazıldı, bunun serlaizer'ı, view'ı ve testi yazıldı.
  - [x] Frontend: geçici landingpage yazıldı(homepage). BoardsPage yazıldı ve board'lar listelendi.
  - [ ] Frontend: BoardsDetailPage yüzeysel olarak tasarlandı fakat backend tarafında henüz board detayları alınamadı.


- **Üzerinde Çalıştığımız Son Dosya:**

- **Aktif Hata/Sorun:**
  - Yok.

## 3. 📂 Project Structure (Önemli Dosyalar)
TRELLOCLONE/
├── backend/
│   ├── core/ (settings.py burada)
│   ├── api/ (card, List, Comment gibi işlemleri burada)
│   └── users/ (user işlemleri burada)
└── frontend/
    ├── node_modules/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── services/ (api çağrıları)
    |       ├── api.ts
    |       ├── auth.service.ts
    |       └── board.service.ts
    |   ├── pages/
    |   |   ├── BoardDetailPage.tsx
    |   |   ├── HomePage.tsx
    |   |   └── BoardsPage.tsx
    |   ├── layouts/
    |       └── publicLayout.tsx
    |   ├── utils/
    |   ├── types/
    |       └── index.ts
    |   ├── hooks/
    |       └── useAuth.ts
    |   ├── assets/
    │   └── store/ (zustand)

## 4. 🎯 Immediate Goal (Şu anki Hedef)
- Spesifik bir board içindetay sayfasını yapalım, backend kodlarından yola çıkarak yazacaksın.


## Coding Guidelines
- **Dil:** Kod yorumları ve değişken isimlendirmeleri DAİMA İngilizce olsun. (Bana açıklamaları Türkçe yap).
- **Frontend:** Fonksiyonel component'ler kullan. "Any" tipi SAKIN KULLANMA, her şeyi strictly type yap.
- **Backend:** Class-based view'lar yerine mümkünse ViewSet'ler veya Function-based view'lar kullan (tercihine göre belirtebiliriz). Business logic'i "services" veya "selectors" dosyalarına ayır, view içinde boğulma.
- **Error Handling:** Hataları yutma, frontend'e anlamlı hata mesajları dön.

## User Experience Level
- Kullanıcı Junior seviyesinde ve öğrenme odaklı. Kodu direkt verme, önce mantığını anlat, sonra kodu parça parça ver. Best practice'leri (en iyi yöntemleri) vurgula. Trello hakkında bilgisi yok, arayüz ve çalışma mantığını bilmediğini göz önünde bulundur. Dosya yapısını profesyonelce kullan, gerektiğinde işlemleri gerekli dosyalara taşı ve kullanıcıyı bilgilendir.