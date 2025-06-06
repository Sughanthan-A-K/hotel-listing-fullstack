import { Routes, Route, Navigate } from 'react-router-dom';
import HotelList from '../pages/HotelList';
import HotelForm from '../pages/HotelForm';
import HotelDetail from '../pages/HotelDetail';

const AppRoutes = () => {
  return (
    <Routes>    
      <Route path="/" element={<Navigate to="/hotels" replace />} />    
      <Route path="/hotels" element={<HotelList />} />    
      <Route path="/hotels/add" element={<HotelForm />} />    
      <Route path="/hotels/edit/:id" element={<HotelForm />} />    
      <Route path="/hotels/:id" element={<HotelDetail />} />    
      <Route path="*" element={<Navigate to="/hotels" replace />} />
    </Routes>
  );
};

export default AppRoutes;
