import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';  // ייבוא ה-Provider
import store from './store/store';  // ייבוא ה-store

import Layout from './components/Layout';
import Login from './components/Login'; // וודאי שזה הנתיב הנכון
import Register from './components/Register'; // וודאי שזה הנתיב הנכון
import HomePage from './components/HomePage';
import ScheduleManagement from './components/schedule/ScheduleManagement';
import StudentManagement from './components/students/StudentManagement';
import LessonsManagement from './components/lessons/LessonsManagement';
import Attendance from './components/attendance/Attendance';

function App() {
    return (
        <Provider store={store}>
            <Router>
                <Routes>
                    {/* עמוד login ללא Layout */}
                    <Route path="/" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* דפים אחרים עם Layout */}
                    <Route
                        path="/schedule"
                        element={<Layout> <ScheduleManagement /> </Layout>}
                    />
                    <Route
                        path="/lessons"
                        element={<Layout> <LessonsManagement /> </Layout>}
                    />
                    <Route
                        path="/students"
                        element={<Layout> <StudentManagement /> </Layout>}
                    />
                    <Route
                        path="/homePage"
                        element={<Layout> <HomePage /> </Layout>}
                    />
                    <Route
                        path="/attendance"
                        element={<Layout> <Attendance /> </Layout>}
                    />
                </Routes>
            </Router>
        </Provider >
    );
}

export default App;
