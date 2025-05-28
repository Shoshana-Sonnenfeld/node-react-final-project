import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HDate } from "@hebcal/core";
import { Button } from "primereact/button";

// פונקציה להמרת מספר ליום עברי
function getHebrewDayName(date) {
    const days = ["Sunday", "Monday", "Tuesday", "wednesday", "Thurdsay", "Frieday", "Shabbath"];
    return days[date.getDay()];
}

// פונקציה להמרת מספר לגימטריה
function numberToHebrew(num) {
    const hebrewLetters = [
        '', 'א', 'ב', 'ג', 'ד', 'ה', 'ו', 'ז', 'ח', 'ט',
        'י', 'יא', 'יב', 'יג', 'יד', 'טו', 'טז', 'יז', 'יח', 'יט',
        'כ', 'כא', 'כב', 'כג', 'כד', 'כה', 'כו', 'כז', 'כח', 'כט',
        'ל'
    ];
    return hebrewLetters[num] || num;
}

const HomePage = () => {
    const navigate = useNavigate();
    const username = useSelector((state) => state.user.username);
    const isManager = useSelector((state) => state.user.isManager);

    const [hebrewDateStr, setHebrewDateStr] = useState("");
    const [gregorianDateStr, setGregorianDateStr] = useState("");
    const [timeStr, setTimeStr] = useState("");

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }

        const updateDateTime = () => {
            const today = new Date();

            const day = String(today.getDate()).padStart(2, "0");
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const year = today.getFullYear();
            setGregorianDateStr(`${day}/${month}/${year}`);

            const hours = String(today.getHours()).padStart(2, "0");
            const minutes = String(today.getMinutes()).padStart(2, "0");
            setTimeStr(`${hours}:${minutes}`);

            const hdate = new HDate(today);
            const hebDay = getHebrewDayName(today);
            const hebDayNum = numberToHebrew(hdate.getDate());
            const hebMonth = hdate.getMonthName("h");
            setHebrewDateStr(`${hebDay} ${hebDayNum} ${hebMonth}`);
        };

        updateDateTime();
        const interval = setInterval(updateDateTime, 10000);
        return () => clearInterval(interval);
    }, [navigate]);

    const handleGoToRegister = () => {
        navigate("/register");
    };

    const handleGoToAllUsers = () => {
        navigate("/allUsers");
    };

    return (
        <div className="p-4" style={{ direction: "ltr" }}>
            <h1 style={{ textAlign: "left", color: "#542468", marginTop: "2rem" }}>
                Welcome {username}
            </h1>

            <div style={{
                textAlign: "left",
                marginTop: "1rem",
                fontSize: "1.4rem",
                background: "#f7f3ff",
                borderRadius: "12px",
                padding: "1.5rem",
                boxShadow: "0 2px 8px #e0d7f3"
            }}>
                <div style={{ fontWeight: "bold", color: "#542468" }}>{hebrewDateStr}</div>
                <div style={{ color: "#58585a", marginTop: "0.5rem" }}>Gregorian Date: {gregorianDateStr}</div>
                <div style={{ color: "#58585a", marginTop: "0.2rem", fontSize: "1.1rem" }}>Time: {timeStr}</div>
            </div>

            {isManager && (
                <div style={{ marginTop: "2rem" }}>
                    <Button
                        label="Add New User"
                        icon="pi pi-user-plus"
                        onClick={handleGoToRegister}
                        style={{ backgroundColor: "#542468", borderColor: "#542468" }}
                        className="p-button-rounded"
                    /> */}
                    <Button
                        label="View All Users"
                        icon="pi pi-users"
                        onClick={handleGoToAllUsers}
                        style={{ backgroundColor: "#6a4c93", borderColor: "#6a4c93" }}
                        className="p-button-rounded"
                    />
                    <Button
                        label="View All Users"
                        icon="pi pi-users"
                        onClick={handleGoToAllUsers}
                        style={{ backgroundColor: "#6a4c93", borderColor: "#6a4c93" }}
                        className="p-button-rounded"
                    />
                </div>
            )}
        </div>
    );
};

export default HomePage;