import { useState, useEffect } from "react";
import {
  createAudit,
  getAuditsByStatus,
  getAuditsByComplianceId,
  closeAudit,
  getComplianceLookup,
  getAllAudits,
} from "../api/auditApi";
 
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import ContentGate from "../components/ContentGate";
import ActionButton from "../components/ActionButton";
import { useAuth } from "../auth/AuthContext";
 
export default function AuditPage() {
  const { getUserId } = useAuth();
 
  /* ================= STATE ================= */
  const [audits, setAudits] = useState([]);
  const [compliances, setCompliances] = useState([]);
 
  const [loading, setLoading] = useState(false);
  const [lookupLoading, setLookupLoading] = useState(false);
 
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
 
  const [formData, setFormData] = useState({
    complianceId: "",
    auditStatus: "",
  });
  const [activeCloseId, setActiveCloseId] = useState(null);
 
const [closeData, setCloseData] = useState({
  auditStatus: "",
  severity: "",
  findings: "",
});
 
 
  const [filter, setFilter] = useState({
    type: "all", // all | status | compliance
    value: "",
  });
 
  /* ================= LOAD COMPLIANCE LOOKUP ================= */
 
  const loadComplianceLookup = async () => {
    try {
      setLookupLoading(true);
      const data = await getComplianceLookup();
      setCompliances(data || []);
    } catch {
      setError("Failed to load compliance list");
    } finally {
      setLookupLoading(false);
    }
  };
 
  useEffect(() => {
    if (showCreateForm || filter.type === "compliance") {
      loadComplianceLookup();
    }
  }, [showCreateForm, filter.type]);
 
  /* ================= LOAD AUDITS ================= */
 
  const loadAudits = async () => {
    try {
      setLoading(true);
      setError("");
      let data = [];
 
      if (filter.type === "all") {
        data = await getAllAudits();
      } else if (filter.type === "status") {
        if (!filter.value) {
          setError("Please select a status");
          setLoading(false);
          return;
        }
        data = await getAuditsByStatus(filter.value);
      } else if (filter.type === "compliance") {
        if (!filter.value) {
          setError("Please select a compliance");
          setLoading(false);
          return;
        }
        data = await getAuditsByComplianceId(filter.value);
      }
 
      setAudits(data || []);
    } catch (err) {
      console.error("Load audits error:", err);
      setError("Failed to load audits");
    } finally {
      setLoading(false);
    }
  };
 
  /* ================= HANDLERS ================= */
 
  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
 
    if (!formData.complianceId) {
      setError("Please select a compliance record");
      return;
    }
 
    try {
      setLoading(true);
      const auditorId = getUserId();
 
      if (!auditorId) {
        setError("User ID not found. Please log in again.");
        return;
      }
 
      console.log("Creating audit with:", {
        complianceId: Number.parseInt(formData.complianceId, 10),
        auditorUserId: auditorId,
      });
 
      await createAudit(
        {
          complianceId: Number.parseInt(formData.complianceId, 10),
        },
        auditorId,
      );
      setSuccess("Audit created successfully");
      setFormData({
        complianceId: "",
        auditStatus: "",
      });
      setShowCreateForm(false);
      loadAudits();
    } catch (err) {
      console.error("Audit creation error:", err);
      const errorMsg =
        err.response?.data?.msg ||
        err.response?.data?.message ||
        err.message ||
        "Failed to create audit";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };
 
  const handleClose = async (audit) => {
  try {
    setError("");
    setLoading(true);
 
    const auditorId = getUserId();
 
    if (!auditorId) {
      setError("User ID not found. Please log in again.");
      return;
    }
 
    if (!closeData.auditStatus) {
      setError("Please select audit decision");
      return;
    }
 
    if (!closeData.severity) {
      setError("Severity is required");
      return;
    }
 
    if (!closeData.findings || closeData.findings.trim().length < 10) {
      setError("Findings must be at least 10 characters");
      return;
    }
 
    await closeAudit(
      audit.id,   // ✅ auditId
      {
        complianceId: audit.complianceId,   // ✅ REQUIRED FIX
        auditStatus: closeData.auditStatus,
        severity: Number(closeData.severity),
        findings: closeData.findings,
      },
      auditorId
    );
 
    setSuccess("Audit closed successfully");
 
    // reset state
    setActiveCloseId(null);
    setCloseData({
      auditStatus: "",
      severity: "",
      findings: "",
    });
 
    loadAudits();
 
  } catch {
    setError("Failed to close audit");
  } finally {
    setLoading(false);
  }
};
 
  const statusBadge = (status) =>
    status === "COMPLETED"
      ? "bg-success"
      : status === "IN_PROGRESS"
        ? "bg-info text-dark"
        : "bg-secondary";
 
 
  if (loading && audits.length === 0) return <Loading />;
 
  /* ================= UI ================= */
 
  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h4 className="fw-bold text-success">Audit Management</h4>
          <p className="text-muted small mb-0">
            Create and manage compliance audits
          </p>
        </div>
        <ActionButton
          authority="AUDIT_MANAGER"
          className="btn btn-success btn-sm"
          onClick={() => setShowCreateForm(!showCreateForm)}>
          {showCreateForm ? "Cancel" : "+ Create Audit"}
        </ActionButton>
      </div>
 
      {error && <Alert message={error} type="danger" />}
      {success && <Alert message={success} type="success" />}
 
      {/* ================= CREATE AUDIT ================= */}
      <ContentGate authority="AUDIT_MANAGER">
        {showCreateForm && (
          <div className="card shadow-sm mb-4">
            <div className="card-header bg-success text-white">
              Create Audit
            </div>
            <div className="card-body">
              <form onSubmit={handleCreate}>
                <label className="form-label">Compliance</label>
                <select
                  className="form-select"
                  value={formData.complianceId}
                  onChange={(e) =>
                    setFormData({ complianceId: e.target.value })
                  }
                  required
                  disabled={lookupLoading}>
                  <option value="">
                    {lookupLoading
                      ? "Loading compliances..."
                      : "Select Compliance"}
                  </option>
                  {compliances.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
               
 
                <div className="mt-3">
                  <button className="btn btn-success btn-sm" type="submit">
                    Create Audit
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </ContentGate>
 
      {/* ================= FILTER ================= */}
      <div className="card shadow-sm mb-4">
        <div className="card-header">Filter Audits</div>
        <div className="card-body row g-3 align-items-end">
          <div className="col-md-4">
            <label className="form-label">Filter By</label>
            <select
              className="form-select form-select-sm"
              value={filter.type}
              onChange={(e) => setFilter({ type: e.target.value, value: "" })}>
              <option value="all">All</option>
              <option value="status">Status</option>
              <option value="compliance">Compliance</option>
            </select>
          </div>
 
          {filter.type === "status" && (
            <div className="col-md-4">
              <label className="form-label">Status</label>
              <select
                className="form-select form-select-sm"
                value={filter.value}
                onChange={(e) =>
                  setFilter({ ...filter, value: e.target.value })
                }>
                <option value="">Select</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
          )}
 
          {filter.type === "compliance" && (
            <div className="col-md-4">
              <label className="form-label">Compliance</label>
              <select
                className="form-select form-select-sm"
                value={filter.value}
                onChange={(e) =>
                  setFilter({ ...filter, value: e.target.value })
                }>
                <option value="">Select</option>
                {compliances.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          )}
 
          <div className="col-md-2">
            <button
              className="btn btn-success btn-sm w-100"
              onClick={loadAudits}
              disabled={
                (filter.type === "status" && !filter.value) ||
                (filter.type === "compliance" && !filter.value)
              }>
              Search
            </button>
          </div>
        </div>
      </div>
 
      {/* ================= TABLE ================= */}
      <div className="card shadow-sm">
        <div className="card-header">Audit Records</div>
        <div className="card-body p-0">
          {audits.length === 0 ? (
            <p className="text-center text-muted py-4 mb-0">No audits found</p>
          ) : (
            <table className="table table-hover mb-0">
              <thead>
                <tr>
                  <th>Audit</th>
                  <th>Compliance</th>
                  <th>Status</th>
                  <th>Created By</th>
                  <th>Opened</th>
                  <th>Action</th>
                </tr>
              </thead>
 
              <tbody>
                {audits.map((a) => (
                  <tr key={a.id}>
                    {/* ✅ Audit ID */}
                    <td>Audit #{a.id}</td>
 
                    {/* ✅ Compliance Label */}
                    <td>{a.complianceLabel || "—"}</td>
 
                    {/* ✅ Status */}
                    <td>
                      <span className={`badge ${statusBadge(a.status)}`}>
                        {a.status}
                      </span>
                    </td>
 
                    {/* Created By */}
                    <td>{a.createdBy || "—"}</td>
 
                    {/* Opened Date */}
                    <td>
                      {a.openedDate
                        ? new Date(a.openedDate).toLocaleDateString()
                        : "—"}
                    </td>
 
                    {/* Action */}
                    <td>
                      {a.status !== "COMPLETED" && (
                        <ActionButton
                          authority="AUDIT_MANAGER"
                          className="btn btn-success btn-sm"
                          onClick={() => setActiveCloseId(a.id)}>
                          Close
                        </ActionButton>
                      )}
                      {activeCloseId === a.id && (
                        <div className="mt-2 border p-2 rounded bg-light">
                          {/* Audit Decision */}
                          <select
                            className="form-select form-select-sm mb-2"
                            value={closeData.auditStatus}
                            onChange={(e) =>
                              setCloseData({
                                ...closeData,
                                auditStatus: e.target.value,
                              })
                            }>
                            <option value="">Select Decision</option>
                            <option value="VERIFIED">Verified</option>
                            <option value="FLAGGED">Flagged</option>
                          </select>
 
                          {/* Severity */}
                          <select
                            className="form-select form-select-sm mb-2"
                            value={closeData.severity}
                            onChange={(e) =>
                              setCloseData({
                                ...closeData,
                                severity: e.target.value,
                              })
                            }>
                            <option value="">Select Severity</option>
                            <option value="1">Low</option>
                            <option value="3">Medium</option>
                            <option value="5">High</option>
                          </select>
 
                          {/* Findings */}
                          <textarea
                            className="form-control form-control-sm mb-2"
                            placeholder="Enter findings"
                            value={closeData.findings}
                            onChange={(e) =>
                              setCloseData({
                                ...closeData,
                                findings: e.target.value,
                              })
                            }
                          />
 
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-success btn-sm"
                              onClick={() => handleClose(a)}>
                              Submit
                            </button>
 
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => setActiveCloseId(null)}>
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}