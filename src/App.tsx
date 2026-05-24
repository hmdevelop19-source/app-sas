import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AdminLayout from './layouts/AdminLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import AddStudent from './pages/AddStudent';
import StudentDetail from './pages/StudentDetail';
import Guardians from './pages/Guardians';
import GuardianDetail from './pages/GuardianDetail';
import Teachers from './pages/Teachers';
import AddTeacher from './pages/AddTeacher';
import TeacherDetail from './pages/TeacherDetail';
import Warnings from './pages/Warnings';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Admin Routes with Layout */}
        <Route path="/" element={<AdminLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="teachers" element={<Teachers />} />
          <Route path="teachers/add" element={<AddTeacher />} />
          <Route path="teachers/:id" element={<TeacherDetail />} />
          <Route path="students" element={<Students />} />
          <Route path="students/add" element={<AddStudent />} />
          <Route path="students/:id" element={<StudentDetail />} />
          <Route path="guardians" element={<Guardians />} />
          <Route path="guardians/:id" element={<GuardianDetail />} />
          <Route path="warnings" element={<Warnings />} />
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
