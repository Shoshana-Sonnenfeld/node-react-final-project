import { useState } from 'react';
import Axios from 'axios';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

export default function AddStudent({ fetchStudents, setActiveComponent }) {
    const [name, setName] = useState('');
    const [idNumber, setIdNumber] = useState('');
    const [parentEmail, setParentEmail] = useState('');
    const [classNumber, setClassNumber] = useState('');
    const [error, setError] = useState('');

    const handleAddStudent = async () => {
        try {
            const token = localStorage.getItem("token");

            await Axios.post('http://localhost:1235/api/student/addStudent',
                { name, idNumber, parentEmail, classNumber },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            fetchStudents();
            setActiveComponent("");
        } catch (err) {
            const message = err.response?.data?.message || "שגיאה בלתי צפויה";
            setError(message);
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
            <div style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '12px',
                padding: '2rem',
                width: '100%',
                maxWidth: '400px',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                position: 'relative',
            }}>
                {/* כפתור איקס */}
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

                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

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
                        <Button label="Add" 
                        // icon="pi pi-check" 
                        onClick={handleAddStudent} style={buttonStyle} />
                    </div>
                </div>
            </div>
        </div>
    );
}
