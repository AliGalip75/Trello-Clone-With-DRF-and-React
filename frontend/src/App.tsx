// src/App.tsx

import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import PublicLayout from './layouts/PublicLayout';


// Pages
import HomePage from './pages/HomePage';

// import BoardPage from './pages/BoardPage'; // İleride kullanacağız

function App() {
  return (
    <Routes>
      
      {/* 1. GRUP: Public Layout (Header + Footer var) */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        {/* Hakkımızda, İletişim gibi sayfalar da buraya eklenebilir */}
      </Route>

      {/* 2. GRUP: Dashboard/Board Layout (İleride Yapacağız) */}
      {/* Kullanıcı giriş yaptığında burası çalışacak */}
      {/* <Route path="/boards" element={<DashboardLayout />}> ... </Route> */}

      {/* Hatalı URL girilirse anasayfaya yönlendir */}
      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;