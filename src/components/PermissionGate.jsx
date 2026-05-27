import { useState, useEffect } from "react";
import * as api from "../api/resourceApi";
import { fetchAllProjects } from "../api/projectApi";
import { useAuth } from "../auth/AuthContext";
import Toast from "../components/Toast";
 
export default function ResourcesPage() {
  const [tab, setTab] = useState("resources");
  const [resources, setResources] = useState([]);
  const [infra, setInfra] = useState([]);
  const [projects, setProjects] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [selected, setSelected] = useState({});
  const [mode, setMode] = useState("");
  const [section, setSection] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
 
  const itemsPerPage = 5;
  const { decodedToken } = useAuth();
  const userId = decodedToken?.userId;
 
  /* ✅ LOAD */
  useEffect(() => {
    fetchAllProjects().then(setProjects);
  }, []);
 
  useEffect(() => {
    tab === "resources" ? loadResources() : loadInfra();
  }, [tab]);
 
  useEffect(() => {
    if (error || success) {
      const t = setTimeout(() => {
        setError("");
        setSuccess("");
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [error, success]);
 
  const loadResources = async () => {
    const res = await api.getAllResources();
    setResources(res.content || []);
  };
 
  const loadInfra = async () => {
    const res = await api.getAllInfrastructure();
    setInfra(res.content || []);
  };
 
  const openModal = async (item = {}, m, tabName) => {
    setMode(m);
    const sec = tabName === "resources" ? "resource" : "infra";
    setSection(sec);
 
    setShowModal(true);
 
    try {
      if (m === "view") {
        if (sec === "resource") {
          const data = await api.getResourceById(item.resourceId);
          setSelected(data);
        } else {
          setSelected(item);
        }
      } else {
        setSelected(item);
      }
    } catch (err) {
      setError("Failed to fetch details ❌");
    }
  };
 
  const validateFields = () => {
 
    if (mode === "add") {
      if (!selected.projectId) return "Project is required";
      if (section === "resource" && !selected.resourceName)
        return "Resource name is required";
      if (section === "infra" && !selected.infrastructureName)
        return "Infrastructure name is required";
      if (!selected.type) return "Type is required";
 
      if (section === "resource" && !selected.totalQuantity)
        return "Quantity is required";
 
      if (section === "infra" && !selected.capacity)
        return "Capacity is required";
    }
 
    if (mode === "allocate") {
      if (!selected.allocateQty)
        return "Quantity/Capacity is required";
    }
 
    return null;
  };
 
 
  /* ✅ CREATE */
  const handleSave = async () => {
 
    const validationError = validateFields();
 
    if (validationError) {
      setError(validationError);
      return;
    }
 
    try {
      if (section === "resource") {
        await api.createResource({
          projectId: Number(selected.projectId),
          resourceName: selected.resourceName,
          type: selected.type,
          totalQuantity: Number(selected.totalQuantity),
        });
        loadResources();
      } else {
        await api.createInfrastructure({
          projectId: Number(selected.projectId),
          infrastructureName: selected.infrastructureName,
          type: selected.type,
          location: selected.location,
          capacity: Number(selected.capacity),
        });
        loadInfra();
      }
 
      setSuccess("Created successfully ✅");
 
      setTimeout(() => {
        setShowModal(false);
      }, 300);
 
    } catch (err) {
      setError(err?.response?.data?.message || "Something went wrong ❌");
    }
  };
 
  /* ✅ DELETE */
  const handleDelete = async () => {
    try {
      section === "resource"
        ? await api.deleteResource(selected.resourceId)
        : await api.deleteInfrastructure(selected.infraId);
 
      section === "resource" ? loadResources() : loadInfra();
      setSuccess("Deleted ✅");
    } catch (err) {
      setError(err?.response?.data?.message || "Cannot delete resource");
    }
 
    setShowModal(false);
  };
 
  /* ✅ ALLOCATE */
  const handleAllocate = async () => {
 
    const validationError = validateFields();
 
    if (validationError) {
      setError(validationError);
      return;
    }
 
    try {
      if (section === "resource") {
 
        await api.allocateResource(
          selected.resourceId,
          {
            allocationQuantity: Number(selected.allocateQty),
            userId: userId
          }
        );
 
        loadResources();
        setSuccess("Resource allocated ✅");
 
      } else {
 
        await api.updateInfrastructureCapacity(
          selected.infraId,
          {
            utilizedCapacity: Number(selected.allocateQty),
            userId: userId
          }
        );
 
        loadInfra();
        setSuccess("Capacity utilized ✅");
      }
 
      setTimeout(() => {
        setShowModal(false);
      }, 300);
 
    } catch (err) {
      setError(err?.response?.data?.message || "Operation failed ❌");
    }
  };
 
  const getStatusStyle = (status) => {
    if (status === "AVAILABLE") return "bg-primary";
    if (status === "ALLOCATED") return "bg-success";
    if (status === "ACTIVE") return "bg-success";
    if (status === "INACTIVE") return "bg-secondary";
    if (status === "UNDER_MAINTENANCE") return "bg-warning text-dark";
 
    return "bg-secondary";
  };
 
 
  const filteredRows = (tab === "resources" ? resources : infra).filter((r) => {
    const text = searchText.toLowerCase();
    return (
      r.resourceName?.toLowerCase().includes(text) ||
      r.infrastructureName?.toLowerCase().includes(text) ||
      r.type?.toLowerCase().includes(text)
    );
  });
 
  /* ✅ PAGINATION LOGIC */
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const paginatedRows = filteredRows.slice(indexOfFirstItem, indexOfLastItem);
  useEffect(() => {
    setCurrentPage(1);
  }, [tab, searchText]);
 
 
  return (
    <div className="container-fluid px-2 px-md-4 py-4">
      <Toast
        success={success}
        error={error}
        setSuccess={setSuccess}
        setError={setError}
      />
      {/* HEADER */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2">
 
        <h4 className="text-success mb-0">Resource & Infrastructure</h4>
 
        <div className="w-100 w-md-auto d-flex justify-content-end">
          <button
            className="btn btn-success px-3 py-2 py-md-1 px-md-3"
            style={{ width: "100%", maxWidth: "220px" }}
            onClick={() => openModal({}, "add", tab)}
          >
            + Add
          </button>
        </div>
 
      </div>
 
      <input
        className="form-control mb-3"
        placeholder="Search..."
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
      />
 
      {/* TABS */}
      <div className="mb-3">
 
        <div className="d-flex gap-3 align-items-end border-bottom pb-1">
 
          {/* ✅ RESOURCES TAB */}
          <button
            className={`px-3 py-2 border border-bottom-0 rounded-top ${tab === "resources"
              ? "bg-light text-success fw-semibold"
              : "bg-transparent border-0 text-muted"
              }`}
            style={{ marginBottom: "-1px" }}
            onClick={() => setTab("resources")}
          >
            Resources
          </button>
 
          {/* ✅ INFRA TAB */}
          <button
            className={`px-3 py-2 border border-bottom-0 rounded-top ${tab === "infrastructure"
              ? "bg-light text-success fw-semibold"
              : "bg-transparent border-0 text-muted"
              }`}
            style={{ marginBottom: "-1px" }}
            onClick={() => setTab("infrastructure")}
          >
            Infrastructure
          </button>
 
        </div>
 
      </div>
 
 
 
      {/* TABLE */}
      <div className="table-responsive d-none d-md-block">
        <table className="table table-hover align-middle text-nowrap">
 
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Type</th>
              <th>{tab === "resources" ? "Quantity" : "Capacity"}</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
 
          <tbody>
            {paginatedRows.map((item) => (
              <tr key={item.resourceId || item.infraId}>
 
                <td>{item.resourceId || item.infraId}</td>
 
                <td>
                  {tab === "resources"
                    ? item.resourceName
                    : item.infrastructureName}
                </td>
 
                <td>{item.type}</td>
 
                {/* ✅ CLEAN QUANTITY / CAPACITY UI */}
                <td style={{ minWidth: "180px" }}>
                  {tab === "resources" ? (
                    <>
                      <div><b>Total:</b> {item.totalQuantity}</div>
                      <div className="text-danger">
                        Used: {item.totalQuantity - item.availableQuantity}
                      </div>
                      <div className="text-success">
                        Available: {item.availableQuantity}
                      </div>
 
                      {/* ✅ SMALL PROGRESS BAR */}
                      <div className="progress mt-1" style={{ height: "5px" }}>
                        <div
                          className="progress-bar bg-success"
                          style={{
                            width: `${((item.totalQuantity - item.availableQuantity) /
                              item.totalQuantity) *
                              100
                              }%`,
                          }}
                        ></div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div><b>Total:</b> {item.capacity}</div>
                      <div className="text-danger">
                        Used: {item.utilizedCapacity}
                      </div>
                      <div className="text-success">
                        Remaining: {item.capacity - item.utilizedCapacity}
                      </div>
 
                      {/* ✅ INFRA PROGRESS */}
                      <div className="progress mt-1" style={{ height: "5px" }}>
                        <div
                          className="progress-bar bg-primary"
                          style={{
                            width: `${(item.utilizedCapacity / item.capacity) * 100}%`,
                          }}
                        ></div>
                      </div>
                    </>
                  )}
                </td>
 
                {/* ✅ STATUS */}
                <td>
                  <span className={`badge ${getStatusStyle(item.status)}`}>
                    {item.status}
                  </span>
                </td>
 
                {/* ✅ ACTIONS FIXED */}
                <td>
                  <div className="d-flex flex-wrap gap-2">
 
                    <button className="btn btn-outline-secondary btn-sm px-2 py-1"
                      onClick={() => openModal(item, "view", tab)}>View</button>
 
                    {/* ✅ ALLOCATE / UTILIZE */}
                    <button
                      className="btn btn-outline-primary btn-sm px-2 py-1"
                      onClick={() => openModal(item, "allocate", tab)}
                    >
                      {tab === "resources" ? "Allocate" : "Utilize"}
                    </button>
 
                    {/* ✅ DELETE */}
                    <button className="btn btn-outline-danger btn-sm px-2 py-1"
                      onClick={() => openModal(item, "delete", tab)}>Delete</button>
 
                  </div>
                </td>
 
              </tr>
            ))}
          </tbody>
 
        </table>
      </div>
 
      <div className="d-md-none">
 
        {paginatedRows.map((item) => (
          <div key={item.resourceId || item.infraId}
            className="card mb-3 shadow-sm">
 
            <div className="card-body">
 
              {/* TITLE */}
              <h6 className="fw-semibold">
                {tab === "resources"
                  ? item.resourceName
                  : item.infrastructureName}
              </h6>
 
              {/* TYPE */}
              <div className="small text-muted mb-2">
                Type: {item.type}
              </div>
 
              {/* DATA */}
              {(tab === "resources") ? (
                <>
                  <div><b>Total:</b> {item.totalQuantity}</div>
                  <div className="text-danger">
                    Used: {item.totalQuantity - item.availableQuantity}
                  </div>
                  <div className="text-success">
                    Available: {item.availableQuantity}
                  </div>
                </>
              ) : (
                <>
                  <div><b>Total:</b> {item.capacity}</div>
                  <div className="text-danger">
                    Used: {item.utilizedCapacity}
                  </div>
                  <div className="text-success">
                    Remaining: {item.capacity - item.utilizedCapacity}
                  </div>
                </>
              )}
 
              {/* STATUS */}
              <div className="mt-2">
                <span className={`badge ${getStatusStyle(item.status)}`}>
                  {item.status}
                </span>
              </div>
 
              {/* ACTION BUTTONS */}
              <div className="d-flex flex-wrap gap-2 mt-3">
 
                <button
                  className="btn btn-outline-secondary btn-sm px-2 py-1"
                  onClick={() => openModal(item, "view", tab)}
                >
                  View
                </button>
 
                <button
                  className="btn btn-outline-primary btn-sm px-2 py-1"
                  onClick={() => openModal(item, "allocate", tab)}
                >
                  {tab === "resources" ? "Allocate" : "Utilize"}
                </button>
 
                <button
                  className="btn btn-outline-danger btn-sm px-2 py-1"
                  onClick={() => openModal(item, "delete", tab)}
                >
                  Delete
                </button>
 
              </div>
 
            </div>
          </div>
        ))}
 
      </div>
 
 
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mt-3 gap-2">
 
        {/* ✅ PAGE INFO */}
        <span className="text-muted small">
          Page {currentPage} of {Math.ceil(filteredRows.length / itemsPerPage)}
        </span>
 
        {/* ✅ BUTTONS */}
        <div className="d-flex gap-2">
 
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => prev - 1)}
          >
            Previous
          </button>
 
          <button
            className="btn btn-sm btn-outline-secondary"
            disabled={currentPage === Math.ceil(filteredRows.length / itemsPerPage)}
            onClick={() => setCurrentPage(prev => prev + 1)}
          >
            Next
          </button>
 
        </div>
      </div>
      {/* ✅ MODAL */}
      {showModal && (
        <>
          <div className="modal-backdrop show"></div>
 
          <div className="modal d-block">
            <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable modal-sm modal-md">
              <div className="modal-content">
 
                <div className="modal-header">
                  <h6>{mode.toUpperCase()}</h6>
                  <button className="btn-close" onClick={() => setShowModal(false)}></button>
                </div>
 
                <div className="modal-body">
 
                  {/* ✅ DELETE */}
                  {mode === "delete" && (
                    <p>Are you sure you want to delete?</p>
                  )}
 
                  {/* ✅ ADD RESOURCE FORM (UNCHANGED) */}
                  {mode === "add" && section === "resource" && (
                    <>
                      <select className="form-control form-control-sm mb-2 w-100"
                        style={{ fontSize: "14px" }}
                        value={selected.projectId || ""}
                        onChange={(e) =>
                          setSelected({ ...selected, projectId: e.target.value })
                        }
                      >
                        <option>Select Project</option>
                        {projects.map((p) => (
                          <option key={p.projectId} value={p.projectId}>
                            {p.title}
                          </option>
                        ))}
                      </select>
 
                      <input
                        className="form-control mb-2"
                        placeholder="Resource Name"
                        value={selected.resourceName || ""}
                        onChange={(e) =>
                          setSelected({
                            ...selected,
                            resourceName: e.target.value,
                          })
                        }
                      />
 
                      <select className="form-control form-control-sm mb-2 w-100"
                        style={{ fontSize: "14px" }}
                        value={selected.type || ""}
                        onChange={(e) =>
                          setSelected({ ...selected, type: e.target.value })
                        }
                      >
                        <option>Select Type</option>
                        <option value="FUNDS">FUNDS</option>
                        <option value="EQUIPMENT">EQUIPMENT</option>
                      </select>
 
                      <input
                        className="form-control"
                        placeholder="Quantity"
                        value={selected.totalQuantity || ""}
                        onChange={(e) =>
                          setSelected({
                            ...selected,
                            totalQuantity: e.target.value,
                          })
                        }
                      />
                    </>
                  )}
 
                  {mode === "view" && (
                    <div className="p-2">
 
                      {/* ✅ TITLE */}
                      <h5 className="text-success mb-3">
                        {section === "resource" ? "Resource Details" : "Infrastructure Details"}
                      </h5>
 
                      {/* ✅ BASIC INFO CARD */}
                      <div className="border rounded p-3 mb-3 bg-light">
 
                        <div className="row mb-2">
                          <div className="col-5 text-muted">ID</div>
                          <div className="col-7 fw-semibold">
                            {selected.resourceId || selected.infraId}
                          </div>
                        </div>
 
                        <div className="row mb-2">
                          <div className="col-5 text-muted">Project</div>
                          <div className="col-7">{selected.projectName}</div>
                        </div>
 
                        <div className="row mb-2">
                          <div className="col-5 text-muted">Name</div>
                          <div className="col-7 fw-semibold">
                            {selected.resourceName || selected.infrastructureName}
                          </div>
                        </div>
 
                        <div className="row">
                          <div className="col-5 text-muted">Type</div>
                          <div className="col-7">{selected.type}</div>
                        </div>
 
                      </div>
 
                      {/* ✅ QUANTITY / CAPACITY SECTION */}
                      <div className="border rounded p-3 mb-3">
 
                        {section === "resource" ? (
                          <>
                            <div className="d-flex justify-content-between mb-1">
                              <span>Total</span>
                              <strong>{selected.totalQuantity}</strong>
                            </div>
 
                            <div className="d-flex justify-content-between text-danger mb-1">
                              <span>Used</span>
                              <strong>
                                {selected.totalQuantity - selected.availableQuantity}
                              </strong>
                            </div>
 
                            <div className="d-flex justify-content-between text-success">
                              <span>Available</span>
                              <strong>{selected.availableQuantity}</strong>
                            </div>
 
                            {/* ✅ PROGRESS */}
                            <div className="progress mt-2" style={{ height: "6px" }}>
                              <div
                                className="progress-bar bg-success"
                                style={{
                                  width: `${((selected.totalQuantity - selected.availableQuantity) /
                                    selected.totalQuantity) *
                                    100
                                    }%`
                                }}
                              ></div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div className="d-flex justify-content-between mb-1">
                              <span>Total Capacity</span>
                              <strong>{selected.capacity}</strong>
                            </div>
 
                            <div className="d-flex justify-content-between text-danger mb-1">
                              <span>Utilized</span>
                              <strong>{selected.utilizedCapacity}</strong>
                            </div>
 
                            <div className="d-flex justify-content-between text-success">
                              <span>Remaining</span>
                              <strong>
                                {selected.capacity - selected.utilizedCapacity}
                              </strong>
                            </div>
 
                            {/* ✅ PROGRESS */}
                            <div className="progress mt-2" style={{ height: "6px" }}>
                              <div
                                className="progress-bar bg-primary"
                                style={{
                                  width: `${(selected.utilizedCapacity / selected.capacity) * 100
                                    }%`
                                }}
                              ></div>
                            </div>
                          </>
                        )}
 
                      </div>
 
                      {/* ✅ STATUS + DATES */}
                      <div className="border rounded p-3">
 
                        <div className="mb-2">
                          <span className="text-muted">Status:</span>{" "}
                          <span className={`badge ${getStatusStyle(selected.status)} ms-2`}>
                            {selected.status}
                          </span>
                        </div>
 
                        <div className="mb-1">
                          <span className="text-muted">Created:</span>{" "}
                          {selected.createdAt
                            ? new Date(selected.createdAt).toLocaleString()
                            : "-"}
                        </div>
                      </div>
 
                    </div>
                  )}
 
 
                  {/* ✅ ADD INFRA FORM (UNCHANGED) */}
                  {mode === "add" && section === "infra" && (
                    <>
                      <select className="form-control form-control-sm mb-2 w-100"
                        style={{ fontSize: "14px" }}
                        value={selected.projectId || ""}
                        onChange={(e) =>
                          setSelected({ ...selected, projectId: e.target.value })
                        }
                      >
                        <option>Select Project</option>
                        {projects.map((p) => (
                          <option key={p.projectId} value={p.projectId}>
                            {p.title}
                          </option>
                        ))}
                      </select>
 
                      <input
                        className="form-control mb-2"
                        placeholder="Infrastructure Name"
                        value={selected.infrastructureName || ""}
                        onChange={(e) =>
                          setSelected({
                            ...selected,
                            infrastructureName: e.target.value,
                          })
                        }
                      />
 
                      <select className="form-control form-control-sm mb-2 w-100"
                        style={{ fontSize: "14px" }}
                        value={selected.type || ""}
                        onChange={(e) =>
                          setSelected({ ...selected, type: e.target.value })
                        }
                      >
                        <option>Select Type</option>
                        <option value="SOLAR_PLANT">SOLAR_PLANT</option>
                        <option value="WIND_FARM">WIND_FARM</option>
                        <option value="RECYCLING_UNIT">RECYCLING_UNIT</option>
                      </select>
 
                      <input
                        className="form-control mb-2"
                        placeholder="Location"
                        value={selected.location || ""}
                        onChange={(e) =>
                          setSelected({ ...selected, location: e.target.value })
                        }
                      />
 
                      <input
                        className="form-control"
                        type="number"
                        placeholder="Capacity"
                        value={selected.capacity || ""}
                        onChange={(e) =>
                          setSelected({
                            ...selected,
                            capacity: e.target.value,
                          })
                        }
                      />
                    </>
                  )}
 
 
                  {mode === "allocate" && (
                    <>
                      {/* ✅ RESOURCE ALLOCATION */}
                      {section === "resource" && (
                        <>
                          <input
                            type="number"
                            className="form-control mb-2"
                            placeholder="Allocation Quantity"
                            value={selected.allocateQty || ""}
                            onChange={(e) =>
                              setSelected({
                                ...selected,
                                allocateQty: e.target.value,
                              })
                            }
                          />
 
                        </>
                      )}
 
                      {/* ✅ ✅ INFRA UTILIZE FORM (THIS FIXES YOUR ISSUE ✅) */}
                      {section === "infra" && (
                        <>
                          <input
                            type="number"
                            className="form-control mb-2"
                            placeholder="Utilized Capacity"
                            value={selected.allocateQty || ""}
                            onChange={(e) =>
                              setSelected({
                                ...selected,
                                allocateQty: e.target.value,
                              })
                            }
                          />
                        </>
                      )}
                    </>
                  )}
 
                </div>
 
                <div className="modal-footer">
 
                  <button
                    className="btn btn-secondary"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
 
                  {mode === "delete" && (
                    <button className="btn btn-danger" onClick={handleDelete}>
                      Confirm
                    </button>
                  )}
 
                  {mode === "add" && (
                    <button className="btn btn-success" onClick={handleSave}>
                      Save
                    </button>
                  )}
 
                  {mode === "allocate" && (
                    <button className="btn btn-primary" onClick={handleAllocate}>
                      {section === "resource" ? "Allocate" : "Utilize"}
                    </button>
                  )}
 
                </div>
              </div>
            </div>
          </div>
        </>
      )}
 
    </div>
  );
}
 
 