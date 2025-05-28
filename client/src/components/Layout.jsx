import React, { useRef } from 'react'; // ייבוא של React ו־useRef לניהול הפניות לרכיבים
import { TabMenu } from 'primereact/tabmenu'; // ייבוא תפריט טאב של PrimeReact
import { useNavigate, useLocation } from 'react-router-dom'; // ניווט והבנת המיקום הנוכחי ב־URL
import { Avatar } from 'primereact/avatar'; // קומפוננטת Avatar (עיגול עם ראשי תיבות)
import { Menu } from 'primereact/menu'; // קומפוננטת תפריט קופץ
import { useSelector } from 'react-redux'; // לקריאת מידע מה־Redux store
import logo from "../assets/logo.png"; // ייבוא של הלוגו שבתחתית העמוד
import '../layout.css'; // קובץ CSS חיצוני לעיצוב מותאם

const Layout = ({ children }) => { // קומפוננטת Layout שמקבלת children (תוכן פנימי)
    const navigate = useNavigate(); // פונקציה לניווט בין דפים
    const location = useLocation(); // מיקום נוכחי ב־URL
    const menuRef = useRef(null); // יצירת רפרנס עבור תפריט המשתמש

    const purple = "#542468"; // צבע סגול - צבע עיקרי
    const gray = "#58585a"; // צבע אפור - עבור רקע ה־Avatar

    const username = useSelector(state => state.user?.username);

    if (!username) {
        return (
            <div style={{ color: 'red', padding: '1rem' }}>
                Error: Username is missing. Please login again.
            </div>
        );
    }

    const initials = username
        .split(' ')
        .map(word => word[0])
        .join('')
        .toLowerCase();


    const items = [ // הגדרת פריטי ה־TabMenu (לשוניות)
        { label: 'home page', icon: 'pi pi-home', path: '/homePage' },
        { label: 'students', icon: 'pi pi-users', path: '/students' },
        { label: 'lessons', icon: 'pi pi-book', path: '/lessons' },
        { label: 'schedule', icon: 'pi pi-calendar', path: '/schedule' },
        { label: 'attendance', icon: 'pi pi-list-check', path: '/attendance' }
    ];

    const activeIndex = items.findIndex(item => item.path === location.pathname); // קביעת הלשונית הפעילה לפי הנתיב הנוכחי

    const handleLogout = () => {
        localStorage.removeItem('token'); // הסרת הטוקן מה־LocalStorage
        localStorage.removeItem('username'); // הסרת שם המשתמש
        navigate('/'); // ניווט לדף הכניסה
    };

    const userMenuItems = [ // תפריט קופץ של המשתמש
        {
            label: username, // הצגת שם המשתמש המלא (לא לחיץ)
            disabled: true
        },
        {
            label: 'Logout', // לחצן התנתקות
            icon: 'pi pi-sign-out',
            command: handleLogout // פעולה שתתבצע בעת לחיצה
        }
    ];

    const tabMenuStyles = {
        '--tabmenu-active-color': purple, // צבע טאב פעיל
        '--tabmenu-color': gray // צבע טקסט רגיל
    };

    return (
        <div className="flex flex-column min-h-screen"> {/* קונטיינר ראשי פרוס לאורך כל גובה המסך */}

            {/* סרגל עליון */}
            <div className="surface-100 px-3 py-2 flex justify-between align-items-center shadow-1">
                <TabMenu
                    model={items} // העברת הפריטים לטאב
                    activeIndex={activeIndex >= 0 ? activeIndex : 0} // טאב פעיל
                    onTabChange={(e) => navigate(items[e.index].path)} // פעולה בעת לחיצה על טאב - ניווט
                    className="border-none" // הסרת גבול
                    style={tabMenuStyles} // עיצוב מותאם
                />

                {/* Avatar + תפריט קופץ */}
                <div className="relative ml-auto"
                    onMouseEnter={e => menuRef.current?.show(e)} // הצגת התפריט במעבר עכבר
                    onMouseLeave={e => menuRef.current?.hide(e)} // הסתרה כאשר העכבר יוצא
                >
                    <Avatar
                        label={initials} // ראשי התיבות של המשתמש
                        shape="circle" // עיגול
                        size="large" // גודל גדול
                        style={{ backgroundColor: gray, color: 'white', cursor: 'pointer' }} // עיצוב
                    />
                    <Menu model={userMenuItems} popup ref={menuRef} /> {/* תפריט קופץ */}
                </div>
            </div>

            {/* תוכן מרכזי של הדף */}
            <div className="flex-grow p-4" style={{ backgroundColor: 'transparent', border: 'none' }}>
                {children} {/* רינדור תוכן פנימי שהועבר לקומפוננטת Layout */}
            </div>

            {/* תחתית העמוד (footer) */}
            <footer className="text-center py-3" style={{ backgroundColor: 'transparent' }}>
                <img src={logo} alt="Logo" style={{ width: "120px" }} /> {/* הצגת הלוגו */}
            </footer>
        </div>
    );
}

export default Layout; // ייצוא הקומפוננטה לשימוש בקומפוננטות אחרות