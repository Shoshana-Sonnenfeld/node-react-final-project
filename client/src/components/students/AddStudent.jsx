import { useState, useRef } from 'react';
import Axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { useSelector } from 'react-redux';

export default function AddStudent({ fetchStudents, setActiveComponent }) {
    const [name, setName] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [parentEmail, setParentEmail] = useState('');
    const [classNumber, setClassNumber] = useState('');
    const [error, setError] = useState('');
    const toast = useRef(null);

    const token = useSelector(state => state.user.token); // או כל מקום שבו אתה שומר את הטוקן


    const handleAddStudent = async () => {
        try {
            await Axios.post(
                'http://localhost:1235/api/student/addStudent',
                { name, idNumber, parentEmail, classNumber },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            fetchStudents();
            setActiveComponent("");
        } catch (err) {
            const message = err.response?.data?.message || "שגיאה בלתי צפויה";
            setError(message);

            toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: message,
                life: 3000,
            });
        }
    };

    const purpleColor = '#542468';

    const buttonStyle = {
        backgroundColor: purpleColor,
        borderColor: purpleColor,
        color: '#FFFFFF',
    };

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            paddingTop: '1rem',
            paddingBottom: '1rem',
            backgroundColor: '#FFFFFF',
        }}>
            <Toast ref={toast} />
            <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '2rem',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                position: 'relative',
            }}>
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

                <h3 style={{ color: purpleColor, fontWeight: 'bold', marginTop: '0' }}>Add Student</h3>

                <div className="p-fluid">
                    <div className="mb-3">
                        <label className="block font-bold mb-1" style={{ color: purpleColor }}>Name</label>
                        <InputText value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" />
                    </div>

                    <div className="mb-3">
                        <label className="block font-bold mb-1" style={{ color: purpleColor }}>ID Number</label>
                        <InputText value={idNumber} onChange={(e) => setIdNumber(e.target.value)} placeholder="ID Number" />
                    </div>

                    <div className="mb-3">
                        <label className="block font-bold mb-1" style={{ color: purpleColor }}>Parent Email</label>
                        <InputText value={parentEmail} onChange={(e) => setParentEmail(e.target.value)} placeholder="Parent Email" />
                    </div>

                    <div className="mb-4">
                        <label className="block font-bold mb-1" style={{ color: purpleColor }}>Class Number</label>
                        <InputText value={classNumber} onChange={(e) => setClassNumber(e.target.value)} placeholder="Class Number" />
                    </div>

                    <div className="flex justify-center">
                        <Button label="Add" onClick={handleAddStudent} style={buttonStyle} />
                    </div>
                </div>
            </div>
        </div>
    );
}
