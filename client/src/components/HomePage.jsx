import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { HDate } from "@hebcal/core";

// פונקציה להמרת מספר ליום עברי (מתוך HDate)
function getHebrewDayName(date) {
    // getDay: 0=Sunday ... 6=Saturday
    const days = ["ראשון", "שני", "שלישי", "רביעי", "חמישי", "שישי", "שבת"];
    return days[date.getDay()];
}

// פונקציה להמרת מספר ליום עברי באותיות (גימטריה)
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
    const username = useSelector((state) => state.user.username); // שליפת שם המשתמש מ-Redux

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

            // תאריך לועזי
            const day = String(today.getDate()).padStart(2, "0");
            const month = String(today.getMonth() + 1).padStart(2, "0");
            const year = today.getFullYear();
            setGregorianDateStr(`${day}/${month}/${year}`);

            // שעה ודקות
            const hours = String(today.getHours()).padStart(2, "0");
            const minutes = String(today.getMinutes()).padStart(2, "0");
            setTimeStr(`${hours}:${minutes}`);

            // תאריך עברי
            const hdate = new HDate(today);
            const hebDay = getHebrewDayName(today);
            const hebDayNum = numberToHebrew(hdate.getDate());
            const hebMonth = hdate.getMonthName("h"); // שם החודש בעברית מהספריה
            setHebrewDateStr(`היום יום ${hebDay} ${hebDayNum} ב${hebMonth}`);
        };

        updateDateTime();
        const interval = setInterval(updateDateTime, 10000); // עדכון כל 10 שניות

        return () => clearInterval(interval);
    }, [navigate]);

    return (
        <>
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
                <div style={{ color: "#58585a", marginTop: "0.5rem" }}>{gregorianDateStr}</div>
                <div style={{ color: "#58585a", marginTop: "0.2rem", fontSize: "1.1rem" }}>{timeStr}</div>
            </div>
        </>
    );
};

export default HomePage;
