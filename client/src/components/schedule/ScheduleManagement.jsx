import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ScheduleTable from './ScheduleTable';

const ScheduleManagement = () => {
    const [classNumber, setClassNumber] = useState('');
    const [allClasses, setAllClasses] = useState([]);
    const [loading, setLoading] = useState(true); // טוען את רשימת הכיתות

    useEffect(() => {
        axios.get('http://localhost:1235/api/student/getAllClasses', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            setAllClasses(response.data);
            setLoading(false); // סיים טעינת הכיתות
        })
        .catch(err => {
            console.error('Failed to fetch class numbers', err);
            setLoading(false);
        });
    }, []);

    const handleClassChange = (event) => {
        setClassNumber(event.target.value);
    };

    if (loading) {
        return <div>Loading classes...</div>; // הצגת הודעת טעינה
    }

    return (
        <div>
            <h2>Schedule Management</h2>
            <div>
                <label htmlFor="classNumber">Select Class Number: </label>
                <select
                    id="classNumber"
                    value={classNumber}
                    onChange={handleClassChange}
                >
                    <option value="">Select a class</option>
                    {allClasses.map((classNum) => (
                        <option key={classNum} value={classNum}>{classNum}</option>
                    ))}
                </select>
            </div>
            
            {classNumber && (
                <ScheduleTable classNumber={classNumber} />
            )}
        </div>
    );
};

export default ScheduleManagement;