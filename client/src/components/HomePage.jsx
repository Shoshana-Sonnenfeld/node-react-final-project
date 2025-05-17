import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const HomePage = () => {
    const navigate = useNavigate();
    const username = useSelector((state) => state.user.username); // שליפת שם המשתמש מ-Redux

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/login");
        }
    }, [navigate]);

    return (
        <>
            <h1>Welcome {username}</h1>
        </>
    );
};

export default HomePage;
