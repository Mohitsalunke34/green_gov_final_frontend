import { useState, useEffect } from "react";
import * as api from "../api/resourceApi";
import { fetchAllProjects } from "../api/projectApi";
import { RequiredPermission } from "../components/PermissionGate";

/* ✅ Toast */
const Toast = ({ msg, type }) => {
    if (!msg) return null;
    return (
        <div className={`position-fixed top-0 end-0 m-3 alert alert-${type}`} style={{ zIndex: 9999 }}>
            {msg}
        </div>
    );
};

export default function ResourcesPage() {

    const [tab, setTab] = useState("resources");
    const [resources, setResources] = useState([]);
    const [infra, setInfra] = useState([]);
    const [projects, setProjects] = useState([]);

    const [selected, setSelected] = useState({});
    const [mode, setMode] = useState("");
    const [section, setSection] = useState("");
    const [showModal, setShowModal] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    /* ✅ Load Projects */
    useEffect(() => {
        fetchAllProjects().then(setProjects).catch(() => setError("Failed to load projects"));
    }, []);

    /* ✅ Load data */
    useEffect(() => {
        tab === "resources" ? loadResources() : loadInfra();
    }, [tab]);

    const loadResources = async () => setResources(await api.getAllResources());
    const loadInfra = async () => setInfra(await api.getAllInfrastructure());

    /* ✅ Modal */
    const openModal = (item = {}, m, sec) => {
        setSelected(item);
        setMode(m);
        setSection(sec);
        setShowModal(true);
    };

    /* ✅ SAVE */
    const handleSave = async () => {
        try {
            if (section === "resource") {
                const payload = {
                    projectId: Number(selected.projectId),
                    type: selected.type,
                    quantity: Number(selected.quantity),
                };

                mode === "add"
                    ? await api.allocateResource(payload)
                    : await api.updateResource(selected.resourceId, payload);

                loadResources();

            } else {
                const payload = {
                    projectId: Number(selected.projectId),
                    type: selected.type,
                    location: selected.location,
                    capacity: Number(selected.capacity),
                };

                mode === "add"
                    ? await api.createInfrastructure(payload)
                    : await api.updateInfrastructure(selected.infraId, payload);

                loadInfra();
            }

            setSuccess("Saved ✅");

        } catch {
            setError("Save failed ❌");
        } finally {
            setShowModal(false);
        }
    };

    /* ✅ DELETE */
    const handleDelete = async () => {
        try {
            if (section === "resource") {
                await api.deleteResource(selected.resourceId);
                loadResources();
            } else {
                await api.deleteInfrastructure(selected.infraId);
                loadInfra();
            }
            setSuccess("Deleted ✅");
        } catch {
            setError("Delete failed ❌");
        } finally {
            setShowModal(false);
        }
    };

    /* ✅ STATUS */
    const handleStatus = async (item, status) => {
        try {
            await api.updateResourceStatus(item.resourceId, status);
            loadResources();
            setSuccess("Status updated ✅");
        } catch {
            setError("Status update failed ❌");
        }
    };

    const handleInfraStatus = async (item, status) => {
        try {
            await api.updateInfrastructureStatus({
                infraId: item.infraId,
                status: status,
            });
            loadInfra();
            setSuccess("Status updated ✅");
        } catch {
            setError("Status update failed ❌");
        }
    };

    const rows = tab === "resources" ? resources : infra;
    const resourceStatusOptions = ["Available", "Allocated", "Depleted"];
    const infraStatusOptions = ["Planned", "Under Construction", "Operational"];

    return (
        <RequiredPermission authority="PROGRAM_MANAGER">
            <div className="container py-4">

                <Toast msg={error} type="danger" />
                <Toast msg={success} type="success" />

                <h4 className="text-success">Resource & Infrastructure</h4>

                {/* ✅ Tabs */}
                <div className="btn-group mb-3">
                    <button className={`btn ${tab === "resources" ? "btn-success" : "btn-outline-success"}`}
                        onClick={() => setTab("resources")}>
                        Resources
                    </button>

                    <button className={`btn ${tab === "infrastructure" ? "btn-success" : "btn-outline-success"}`}
                        onClick={() => setTab("infrastructure")}>
                        Infrastructure
                    </button>
                </div>

                {/* ✅ TABLE */}
                <div className="card mb-3">
                    <div className="card-header d-flex justify-content-between align-items-center">
                        <h6 className="mb-0 text-capitalize">{tab}</h6>

                        <button
                            className="btn btn-success btn-sm px-3"
                            onClick={() =>
                                openModal({}, "add", tab === "resources" ? "resource" : "infra")
                            }
                        >
                            <i className="bi bi-plus-lg"></i> Add
                        </button>
                    </div>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Project</th>
                            <th>Type</th>

                            {/* ✅ NEW COLUMNS */}
                            {tab === "resources"
                                ? <th>Quantity</th>
                                : <>
                                    <th>Location</th>
                                    <th>Capacity</th>
                                </>
                            }

                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {rows.map(item => (
                            <tr key={item.resourceId || item.infraId}>
                                <td>{item.resourceId || item.infraId}</td>
                                <td>{item.projectTitle}</td>
                                <td>{item.type}</td>

                                {/* ✅ NEW DATA */}
                                {tab === "resources"
                                    ? <td>{item.quantity}</td>
                                    : <>
                                        <td>{item.location}</td>
                                        <td>{item.capacity}</td>
                                      </>
                                }

                                <td>{item.status}</td>

                                <td>
                                    <div className="d-flex align-items-center gap-2">

                                        {/* ✅ EDIT */}
                                        <button
                                            className="btn btn-outline-warning btn-sm d-flex align-items-center justify-content-center"
                                            style={{ width: "34px", height: "34px" }}
                                            onClick={() => openModal(item, "edit", tab === "resources" ? "resource" : "infra")}
                                        >
                                            <i className="fa-regular fa-pen-to-square"></i>
                                        </button>

                                        {/* ✅ STATUS */}
                                        {tab === "resources"
                                            ? (
                                                <select
                                                    className="form-select form-select-sm w-auto"
                                                    onChange={(e) => handleStatus(item, e.target.value)}
                                                >
                                                    <option value="">Status</option>
                                                    {resourceStatusOptions.map(opt => (
                                                        <option key={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            )
                                            : (
                                                <select
                                                    className="form-select form-select-sm w-auto"
                                                    onChange={(e) => handleInfraStatus(item, e.target.value)}
                                                >
                                                    <option value="">Status</option>
                                                    {infraStatusOptions.map(opt => (
                                                        <option key={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            )
                                        }

                                        {/* ✅ DELETE */}
                                        <button
                                            className="btn btn-outline-danger btn-sm d-flex align-items-center justify-content-center"
                                            style={{ width: "34px", height: "34px" }}
                                            onClick={() => openModal(item, "delete", tab === "resources" ? "resource" : "infra")}
                                        >
                                            <i className="fa-solid fa-trash"></i>
                                        </button>

                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* ✅ MODAL */}
                {showModal && (
                    <>
                        <div className="modal-backdrop show"></div>

                        <div className="modal d-block">
                            <div className="modal-dialog">
                                <div className="modal-content">

                                    <div className="modal-header">
                                        <h6>{mode} {section}</h6>
                                        <button className="btn-close" onClick={() => setShowModal(false)}></button>
                                    </div>

                                    <div className="modal-body">

                                        {mode === "delete" ? (
                                            <p>Do you want to delete this {section}?</p>
                                        ) : section === "resource" ? (
                                            <>
                                                <select className="form-control mb-2"
                                                    value={selected.projectId || ""}
                                                    onChange={(e) =>
                                                        setSelected({ ...selected, projectId: e.target.value })}>
                                                    <option>Select Project</option>
                                                    {projects.map(p => (
                                                        <option key={p.projectId} value={p.projectId}>
                                                            {p.title}
                                                        </option>
                                                    ))}
                                                </select>

                                                <select className="form-control mb-2"
                                                    value={selected.type || ""}
                                                    onChange={(e) =>
                                                        setSelected({ ...selected, type: e.target.value })}>
                                                    <option>Select Type</option>
                                                    <option>Funds</option>
                                                    <option>Equipment</option>
                                                </select>

                                                <input className="form-control"
                                                    placeholder="Quantity"
                                                    value={selected.quantity || ""}
                                                    onChange={(e) =>
                                                        setSelected({ ...selected, quantity: e.target.value })} />
                                            </>
                                        ) : (
                                            <>
                                                <select className="form-control mb-2"
                                                    value={selected.projectId || ""}
                                                    onChange={(e) =>
                                                        setSelected({ ...selected, projectId: e.target.value })}>
                                                    <option>Select Project</option>
                                                    {projects.map(p => (
                                                        <option key={p.projectId} value={p.projectId}>
                                                            {p.title}
                                                        </option>
                                                    ))}
                                                </select>

                                                <input className="form-control mb-2"
                                                    placeholder="Type"
                                                    value={selected.type || ""}
                                                    onChange={(e) =>
                                                        setSelected({ ...selected, type: e.target.value })} />

                                                <input className="form-control mb-2"
                                                    placeholder="Location"
                                                    value={selected.location || ""}
                                                    onChange={(e) =>
                                                        setSelected({ ...selected, location: e.target.value })} />

                                                <input className="form-control"
                                                    placeholder="Capacity"
                                                    value={selected.capacity || ""}
                                                    onChange={(e) =>
                                                        setSelected({ ...selected, capacity: e.target.value })} />
                                            </>
                                        )}

                                    </div>

                                    <div className="modal-footer">
                                        <button className="btn btn-secondary"
                                            onClick={() => setShowModal(false)}>Cancel</button>

                                        {mode === "delete"
                                            ? <button className="btn btn-danger" onClick={handleDelete}>Delete</button>
                                            : <button className="btn btn-success" onClick={handleSave}>Save</button>}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </>
                )}

            </div>
        </RequiredPermission>
    );
}
