import axios from "axios";

const API = "http://localhost:1235/api/lesson";

const getTokenHeader = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
});

export const addLesson = (lesson) =>
    axios.post(`${API}/addLesson`, lesson, getTokenHeader());

export const getLessonById = (id) =>
    axios.get(`${API}/getLessonById/${id}`, getTokenHeader());

export const getAllLessons = () =>
    axios.get(`${API}/getAllLessons`, getTokenHeader());

export const updateLesson = (id, lesson) =>
    axios.put(`${API}/updateLesson/${id}`, lesson, getTokenHeader());

export const deleteLesson = (id) =>
    axios.delete(`${API}/deleteLesson/${id}`, getTokenHeader());