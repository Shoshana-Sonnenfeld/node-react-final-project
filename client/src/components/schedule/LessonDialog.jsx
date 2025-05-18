import React, { useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

const LessonDialog = ({ visible, onHide, selectedDay, lessonIndex, schedule, setSchedule, classNumber }) => {
    const [lessonName, setLessonName] = useState('');

    // עדכון שם השיעור
    const handleSave = () => {
        const updatedSchedule = { ...schedule };

        if (!updatedSchedule[selectedDay]) {
            updatedSchedule[selectedDay] = { lessons: [] };
        }
        if (!updatedSchedule[selectedDay].lessons[lessonIndex]) {
            updatedSchedule[selectedDay].lessons[lessonIndex] = {};
        }
        updatedSchedule[selectedDay].lessons[lessonIndex].name = lessonName;

        setSchedule(updatedSchedule); // עדכון ה-state של המערכת
        onHide(); // סגירת הדיאלוג
    };

    return (
        <Dialog
            header={`Edit Lesson - ${selectedDay}, Lesson ${lessonIndex + 1}`}
            visible={visible}
            onHide={onHide}
            style={{ width: '30vw' }}
            footer={
                <div>
                    <Button label="Cancel" icon="pi pi-times" onClick={onHide} className="p-button-text" />
                    <Button label="Save" icon="pi pi-check" onClick={handleSave} autoFocus />
                </div>
            }
        >
            <div className="p-field">
                <label htmlFor="lessonName">Lesson Name</label>
                <InputText
                    id="lessonName"
                    value={lessonName}
                    onChange={(e) => setLessonName(e.target.value)}
                    placeholder="Enter lesson name"
                />
            </div>
        </Dialog>
    );
};

export default LessonDialog;