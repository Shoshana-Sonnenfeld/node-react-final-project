import { useState, useRef } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Messages } from "primereact/messages";

const AddLesson = ({ fetchLessons, setActiveComponent }) => {
    const [lesson, setLesson] = useState({ name: "", teacher: "" });
    const token = useSelector(state => state.user.token);
    const messagesRef = useRef(null);

    const handleSubmit = async () => {
        try {
            await axios.post(
                `http://localhost:1235/api/lesson/addLesson`,
                lesson,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            fetchLessons();
            messagesRef.current?.show({
                severity: 'success',
                summary: 'Success',
                detail: 'Lesson added successfully!',
                life: 3000
            });
            setTimeout(() => setActiveComponent(""), 1500);
        } catch (error) {
            messagesRef.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'An error occurred while adding the lesson.',
                life: 3000
            });
            console.error(error);
        }
    };

    const purpleColor = '#542468';
    const buttonStyle = {
        backgroundColor: purpleColor,
        borderColor: purpleColor,
        color: '#FFFFFF',
    };

    return (
        <div>
            <Messages ref={messagesRef} style={{ width: '100%' }} />
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', paddingTop: '3rem', backgroundColor: '#FFFFFF' }}>
                <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', padding: '2rem', width: '100%', maxWidth: '400px', boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)', position: 'relative' }}>
                    <Button
                        icon="pi pi-times"
                        onClick={() => setActiveComponent("")}
                        className="p-button-rounded p-button-text"
                        style={{
                            position: 'absolute',
                            top: '1rem',
                            right: '1rem',
                            color: purpleColor,
                            backgroundColor: 'transparent',
                            border: 'none',
                            fontSize: '1.2rem',
                        }}
                    />
                    <h3 style={{ color: purpleColor, fontWeight: 'bold', marginTop: '0' }}>Add Lesson</h3>

                    <div className="p-fluid">
                        <div className="mb-3">
                            <label className="block font-bold mb-1" style={{ color: purpleColor }}>Name</label>
                            <InputText
                                value={lesson.name}
                                onChange={(e) => setLesson({ ...lesson, name: e.target.value })}
                                placeholder="Name"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block font-bold mb-1" style={{ color: purpleColor }}>Teacher</label>
                            <InputText
                                value={lesson.teacher}
                                onChange={(e) => setLesson({ ...lesson, teacher: e.target.value })}
                                placeholder="Teacher"
                            />
                        </div>
                        <div className="flex justify-center">
                            <Button label="Save" onClick={handleSubmit} style={buttonStyle} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddLesson;
