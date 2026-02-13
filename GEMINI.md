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
  - [ ] Backend: Kullanıcı giriş çıkış işlemleri hiç yapılmadı.
  - [ ] Frontend: Login ve Register için sayfalar oluşturuldu ama düzenleme gerekli.


- **Üzerinde Çalıştığımız Son Dosya:**
  - `frontend/src/pages/LoginPage.tsx`
  - `frontend/src/pages/RegisterPage.tsx`
  - `frontend/src/pages/HomePage.tsx`
  - `frontend/src/pages/BoardPage.tsx`

- **Aktif Hata/Sorun:**
  - Yok.

## 3. 📂 Project Structure (Önemli Dosyalar)
TRELLOCLONE/
├── backend/
│   ├── core/ (settings.py burada)
│   ├── api/ (card, List, Comment gibi işlemleri burada)
└── frontend/
    ├── node_modules/
    ├── public/
    ├── src/
    │   ├── components/
    │   ├── services/ (api çağrıları)
    |   ├── pages/
    |   |   ├── LoginPage.tsx
    |   |   ├── RegisterPage.tsx
    |   |   ├── HomePage.tsx
    |   |   └── BoardPage.tsx
    |   ├── layouts/
    |   ├── types/
    |   ├── hooks/
    |   ├── assets/
    │   └── store/ (zustand)

## 4. 🎯 Immediate Goal (Şu anki Hedef)
- Trello için bir anasayfa ve daha sonra login ve register sayfaları düzenleyelim ve backendi oluşturalım.


## Coding Guidelines
- **Dil:** Kod yorumları ve değişken isimlendirmeleri İngilizce olsun. (Bana açıklamaları Türkçe yap).
- **Frontend:** Fonksiyonel component'ler kullan. "Any" tipi kullanmaktan kaçın, her şeyi strictly type yap.
- **Backend:** Class-based view'lar yerine mümkünse ViewSet'ler veya Function-based view'lar kullan (tercihine göre belirtebiliriz). Business logic'i "services" veya "selectors" dosyalarına ayır, view içinde boğulma.
- **Error Handling:** Hataları yutma, frontend'e anlamlı hata mesajları dön.

## User Experience Level
- Kullanıcı Junior seviyesinde ve öğrenme odaklı. Kodu direkt verme, önce mantığını anlat, sonra kodu parça parça ver. Best practice'leri (en iyi yöntemleri) vurgula. Trello hakkında bilgisi yok, arayüz ve çalışma mantığını bilmediğini göz önünde bulundur. Dosya yapısını profesyonelce kullan, gerektiğinde işlemleri gerekli dosyalara taşı ve kullanıcıyı bilgilendir.