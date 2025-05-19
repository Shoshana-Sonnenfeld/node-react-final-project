import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Card } from 'primereact/card';
import axios from 'axios';

const days = [

    { key: 'sunday', label: 'sunday' },
    { key: 'monday', label: 'monday' },
    { key: 'tuesday', label: 'tuesday' },
    { key: 'wednesday', label: 'wednesday' },
    { key: 'thursday', label: 'thursday' },
];

const ScheduleTable = () => {
    const [schedule, setSchedule] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:1235/api/schedule/getSchedule') // שנה ל-API שלך
            .then(res => {
                const transformed = res.data.map(item => {
                    const row = { classNumber: item.classNumber };
                    days.forEach(day => {
                        row[day.key] = item[day.key]?.lessons?.map((l, i) => `שיעור ${i + 1}`)?.join(', ') || '';
                    });
                    return row;
                });
                setSchedule(transformed);
            })
            .catch(err => console.error(err));
    }, []);

    return (
        // <div className="p-d-flex p-jc-center p-mt-5" style={{ direction: 'rtl' }}>

            <div
            style={{
                direction: 'rtl',
                display: 'flex',
                justifyContent: 'center',
                paddingTop: '2rem',
                backgroundColor: '#f8f8f8',
                minHeight: '100vh'
            }}            >

                <Card style={{ width: '90%', boxShadow: '0 0 10px #ccc' }}>
                    <h2 style={{ textAlign: 'center', color: '#4B296B', marginBottom: '2rem' }}>weekly Schedule</h2>

                    <DataTable
                        value={schedule}
                        stripedRows
                        paginator
                        rows={5}
                        style={{ fontFamily: 'Arial' }}
                    >
                        <Column field="classNumber" header="team" style={{ textAlign: 'center', color: '#4B296B' }}></Column>
                        {days.map(day => (
                            <Column
                                key={day.key}
                                field={day.key}
                                header={day.label}
                                style={{ textAlign: 'center', color: '#4B296B' }}
                            />
                        ))}
                    </DataTable>
                </Card>
            </div>
            );
};

            export default ScheduleTable;

// import React, { useEffect, useState } from 'react';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { Card } from 'primereact/card';
// import axios from 'axios';

// const days = [

//     { key: 'sunday', label: 'sunday' },
//     { key: 'monday', label: 'monday' },
//     { key: 'tuesday', label: 'tuesday' },
//     { key: 'wednesday', label: 'wednesday' },
//     { key: 'thursday', label: 'thursday' },
// ];

// const ScheduleTable = () => {
//     const [schedule, setSchedule] = useState([]);

//     useEffect(() => {
//         axios.get('http://localhost:1235/api/schedule/getSchedule') // שנה ל-API שלך
//             .then(res => {
//                 const transformed = res.data.map(item => {
//                     const row = { classNumber: item.classNumber };
//                     days.forEach(day => {
//                         row[day.key] = item[day.key]?.lessons?.map((l, i) => `שיעור ${i + 1}`)?.join(', ') || '';
//                     });
//                     return row;
//                 });
//                 setSchedule(transformed);
//             })
//             .catch(err => console.error(err));
//     }, []);

//     return (
//         // <div className="p-d-flex p-jc-center p-mt-5" style={{ direction: 'rtl' }}>

//             <div
//             style={{
//                 direction: 'rtl',
//                 display: 'flex',
//                 justifyContent: 'center',
//                 paddingTop: '2rem',
//                 backgroundColor: '#f8f8f8',
//                 minHeight: '100vh'
//             }}            >

//                 <Card style={{ width: '90%', boxShadow: '0 0 10px #ccc' }}>
//                     <h2 style={{ textAlign: 'center', color: '#4B296B', marginBottom: '2rem' }}>weekly Schedule</h2>

//                     <DataTable
//                         value={schedule}
//                         stripedRows
//                         paginator
//                         rows={5}
//                         style={{ fontFamily: 'Arial' }}
//                     >
//                         <Column field="classNumber" header="team" style={{ textAlign: 'center', color: '#4B296B' }}></Column>
//                         {days.map(day => (
//                             <Column
//                                 key={day.key}
//                                 field={day.key}
//                                 header={day.label}
//                                 style={{ textAlign: 'center', color: '#4B296B' }}
//                             />
//                         ))}
//                     </DataTable>
//                 </Card>
//             </div>
//             );
// };

//             export default ScheduleTable;
