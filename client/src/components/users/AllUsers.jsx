import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Toast } from 'primereact/toast';
import { useSelector } from "react-redux";
import axios from '../../axiosConfig';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const toast = useRef(null);

    const token = useSelector(state => state.user.token);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axios.get('http://localhost:1235/api/user/getAllUsers', {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to load users',
                life: 3000
            });
        } finally {
            setLoading(false);
        }
    };

    const roleTemplate = (rowData) => {
        return (
            <span style={{
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                backgroundColor: rowData.role === 'principal' ? '#e3f2fd' : '#f3e5f5',
                color: rowData.role === 'principal' ? '#1976d2' : '#7b1fa2',
                fontWeight: 'bold'
            }}>
                {rowData.role === 'principal' ? 'Principal' : 'Secretary'}
            </span>
        );
    };

    const dateTemplate = (rowData) => {
        return new Date(rowData.createdAt).toLocaleDateString('he-IL');
    };

    const actionTemplate = (rowData) => (
        <div className="flex gap-2 justify-content-end">
            <Button icon="pi pi-link" className="p-button-rounded p-button-sm" style={{ backgroundColor: '#542468', borderColor: '#542468' }} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-sm p-button-danger" />
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-sm p-button-secondary" />
        </div>
    );

    const goBack = () => {
        navigate('/homePage');
    };

    return (
        <div className="p-4" style={{ direction: 'rtl' }}>
            <Toast ref={toast} />

            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h2 style={{ color: '#542468', margin: 0 }}>All System Users</h2>
                    <Button
                        label="Back to Home"
                        icon="pi pi-arrow-right"
                        onClick={goBack}
                        style={{ backgroundColor: '#542468', borderColor: '#542468' }}
                        className="p-button-rounded"
                    />
                </div>

                <DataTable
                    value={users}
                    loading={loading}
                    paginator
                    rows={10}
                    rowsPerPageOptions={[5, 10, 25]}
                    className="p-datatable-gridlines"
                    emptyMessage="No users found"
                    style={{ direction: 'ltr' }}
                    footer={`In total there are ${users.length} users.`}
                >
                    <Column field="name" header="Name" sortable />
                    <Column field="id" header="ID Number" sortable />
                    <Column field="role" header="Role" body={roleTemplate} sortable />
                    <Column field="createdAt" header="Join Date" body={dateTemplate} sortable />
                    <Column header="Actions" body={actionTemplate} style={{ textAlign: 'center', width: '10rem' }} />
                </DataTable>

                <div className="flex justify-content-center mt-4">
                    <Button
                        label="+ Add User"
                        className="p-button-rounded"
                        style={{ backgroundColor: '#542468', borderColor: '#542468' }}
                    />
                </div>
            </Card>
        </div>
    );
};

export default AllUsers;
