import { useEffect, useState } from "react";
import { getAllLessons, deleteLesson } from "../lessons/lessonService";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import AddLesson from "./AddLesson";
import UpdateLesson from "./UpdateLesson";

const LessonsManagement = () => {
    const [lessons, setLessons] = useState([]);
    const [activeComponent, setActiveComponent] = useState("");
    const [selectedLesson, setSelectedLesson] = useState(null);

    const fetchLessons = async () => {
        const { data } = await getAllLessons();
        setLessons(data);
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this lesson?")) {
            await deleteLesson(id);
            fetchLessons();
        }
    };

    useEffect(() => {
        fetchLessons();
    }, []);

    const buttonStyle = {
        backgroundColor: '#542468',
        borderColor: '#542468',
        color: '#FFFFFF',
    };

    if (activeComponent === "add") {
        return <AddLesson fetchLessons={fetchLessons} setActiveComponent={setActiveComponent} />;
    }

    if (activeComponent === "update") {
        return <UpdateLesson lesson={selectedLesson} fetchLessons={fetchLessons} setActiveComponent={setActiveComponent} />;
    }

    return (
        <div className="card">
            <DataTable value={lessons} tableStyle={{ minWidth: '60rem' }}>
                <Column field="name" header="Lesson Name" />
                <Column field="teacher" header="Teacher" />
                <Column body={(rowData) => (
                    <div className="flex gap-2">
                        <Button icon="pi pi-pencil" style={buttonStyle}
                            onClick={() => {
                                setSelectedLesson(rowData);
                                setActiveComponent("update");
                            }} />
                        <Button icon="pi pi-trash" style={buttonStyle}
                            onClick={() => handleDelete(rowData._id)} />
                    </div>
                )} />
            </DataTable>

            <div style={{ textAlign: "center", marginTop: "1rem" }}>
                <Button icon="pi pi-plus" label="Add Lesson" style={buttonStyle}
                    onClick={() => setActiveComponent("add")} />
            </div>
        </div>
    );
};

export default LessonsManagement;