
import { useState, useEffect } from "react";

//apis calls for incentives
import {
  fetchAllIncentives,
  createIncentive,
  deleteIncentive,
  fetchParticipants,
  getIncentiveById,
} from "../api/incentiveApi";

//UI components
import Loading from "../components/Loading";
import Toast from "../components/Toast";

//api calls for disbursement
import {
  createDisbursement,
  getDisbursementsByIncentiveId,
  getDisbursementByIds,
} from "../api/disbursementApi";

// Controls access based on roles/authorities in JWT claims
import ContentGate from "../components/ContentGate";

// Custom hook from Context → gives:userId,roles,auth info
import { useAuth } from "../auth/AuthContext";

// Extra APIs to fetch names
import { getParticipantById } from "../api/participantApi";
import { getProgramById } from "../api/programApi";



export default function IncentivesPage() {

  //This is used for API calls that require the officer's user ID 
  const { getUserId } = useAuth();
  const officerUserId = getUserId();

  const [activeTab, setActiveTab] = useState("list");
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [toastType, setToastType] = useState("success");

 
  //stores incentives list
  const [incentives, setIncentives] = useState([]);

  //object mapping is done by id :- { beneficiaryId : name } to avoid multiple API calls for same beneficiary/program
  const [beneficiaryNames, setBeneficiaryNames] = useState({});
  const [programNames, setProgramNames] = useState({});

  // Dropdown list of participants to select from when creating an incentive
  const [participants, setParticipants] = useState([]);

  //Selected user for creating incentive and amount to be sanctioned
  const [selectedParticipant, setSelectedParticipant] = useState("");
  const [createAmount, setCreateAmount] = useState("");


  // DISBURSEMENT TAB
  
  const [selectedIncentiveForDisb, setSelectedIncentiveForDisb] = useState("");
  const [disbAmount, setDisbAmount] = useState("");
  const [disbHistory, setDisbHistory] = useState([]);
  const [disbLookupIncentiveId, setDisbLookupIncentiveId] = useState("");
  const [disbLookupDisbId, setDisbLookupDisbId] = useState("");
  const [lookedUpDisb, setLookedUpDisb] = useState(null);


  //utility to show toast messages
  const showToast = (msg, type = "success") => {
    setToastMsg(msg);
    setToastType(type);
  };

  const clearToast = () => {
    setToastMsg("");
  };



  // ===============================
  // LOAD INCENTIVES
  // ===============================
  // If tab = list → fetch data
  useEffect(() => {
    if (activeTab === "list") loadIncentives();
  }, [activeTab]);

  const loadIncentives = async () => {
    try {
      setLoading(true);
      const data = await fetchAllIncentives();
      setIncentives(Array.isArray(data) ? data : []);

      // Fetch beneficiary and program names
      const newBeneficiaryNames = { ...beneficiaryNames };
      const newProgramNames = { ...programNames };

      if (Array.isArray(data)) {
        for (const incentive of data) {
          // Fetch beneficiary name if not cached
          if (incentive.beneficiaryId && !newBeneficiaryNames[incentive.beneficiaryId]) {
            try {
              const beneficiary = await getParticipantById(incentive.beneficiaryId);
              newBeneficiaryNames[incentive.beneficiaryId] = beneficiary.legalName || "N/A";
            } catch {
              newBeneficiaryNames[incentive.beneficiaryId] = "N/A";
            }
          }

          // Fetch program name if not cached
          if (incentive.programId && !newProgramNames[incentive.programId]) {
            try {
              const program = await getProgramById(incentive.programId);
              newProgramNames[incentive.programId] = program.title || "N/A";
            } catch {
              newProgramNames[incentive.programId] = "N/A";
            }
          }
        }

        setBeneficiaryNames(newBeneficiaryNames);
        setProgramNames(newProgramNames);
      }
    } catch {
      showToast("Failed to load incentives", "danger");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // LOAD PARTICIPANTS WHEN CREATE TAB OPENS
  // ===============================
  useEffect(() => {
    if (activeTab === "create") {
      setLoading(true);
      fetchParticipants()
        .then(setParticipants)
        .catch(() => showToast("Failed to load participants", "danger"))
        .finally(() => setLoading(false));
    }
  }, [activeTab]);

  // ===============================
  // CREATE INCENTIVE
  // ===============================
  const handleCreateIncentive = async (e) => {
    e.preventDefault();
    clearToast();

    if (!selectedParticipant) {
      showToast("Please select a participant", "danger");
      return;
    }

    if (!createAmount || Number(createAmount) <= 0) {
      showToast("Please enter a valid amount", "danger");
      return;
    }

    try {
      setLoading(true);
      await createIncentive(
        {
          participantId: Number(selectedParticipant),
          amount: Number(createAmount),
        },
        officerUserId
      );
      showToast("Incentive created successfully", "success");
      setCreateAmount("");
      setSelectedParticipant("");
      loadIncentives();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create incentive", "danger");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // DELETE INCENTIVE
  // ===============================
  const handleDelete = async (incentiveId) => {
    if (!window.confirm(`Delete incentive #${incentiveId}?`)) return;

    clearToast();
    try {
      setLoading(true);
      await deleteIncentive(incentiveId);
      showToast("Incentive deleted successfully", "success");
      loadIncentives();
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to delete incentive", "danger");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // CREATE DISBURSEMENT
  // ===============================
  const handleCreateDisbursement = async (e) => {
    e.preventDefault();
    clearToast();

    if (!selectedIncentiveForDisb) {
      showToast("Please select an incentive", "danger");
      return;
    }

    if (!disbAmount || Number(disbAmount) <= 0) {
      showToast("Please enter a valid amount", "danger");
      return;
    }

    try {
      setLoading(true);
      await createDisbursement(
        {
          incentiveId: Number(selectedIncentiveForDisb),
          amount: Number(disbAmount),
        },
        officerUserId
      );
      showToast("Disbursement created successfully", "success");
      setDisbAmount("");
      setSelectedIncentiveForDisb("");
      // Refresh disbursement history if available
      if (selectedIncentiveForDisb) {
        loadDisbursementHistory(selectedIncentiveForDisb);
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to create disbursement", "danger");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // GET DISBURSEMENT HISTORY
  // ===============================
  const loadDisbursementHistory = async (incentiveId) => {
    try {
      setLoading(true);
      const data = await getDisbursementsByIncentiveId(incentiveId);
      setDisbHistory(Array.isArray(data) ? data : []);
    } catch {
      showToast("Failed to load disbursement history", "danger");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadDisbursementHistory = async (incentiveId) => {
    clearToast();
    setSelectedIncentiveForDisb(incentiveId);
    await loadDisbursementHistory(incentiveId);
  };

  // ===============================
  // GET DISBURSEMENT BY IDS
  // ===============================
  const handleFetchDisbByIds = async () => {
    clearToast();

    if (!disbLookupIncentiveId || !disbLookupDisbId) {
      showToast("Please enter both incentive ID and disbursement ID", "danger");
      return;
    }

    try {
      setLoading(true);
      const data = await getIncentiveById(
        disbLookupIncentiveId,
        disbLookupDisbId,
        officerUserId
      );
      setLookedUpDisb(data);
    } catch (err) {
      showToast(err.response?.data?.message || "Disbursement not found", "danger");
    } finally {
      setLoading(false);
    }
  };

  // ===============================
  // RENDER UI
  // ===============================
  return (
    <div className="p-2 p-sm-3 p-md-4">
      <Toast msg={toastMsg} type={toastType} onClose={clearToast} />

      {loading && <Loading />}

      <ul className="nav nav-tabs mb-3 mb-md-4 flex-nowrap overflow-auto">
        {["list", "create", "disbursements"].map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className={`nav-link ${
                activeTab === tab ? "active fw-semibold" : ""
              }`}
              onClick={() => {
                setActiveTab(tab);
                clearToast();
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          </li>
        ))}
      </ul>

      {/* ========== LIST TAB ========== */}
      {activeTab === "list" && (
        <div>
          <h4 className="mb-2 mb-md-3 fs-5 fs-md-4">All Incentives</h4>
          {incentives.length === 0 ? (
            <p className="text-muted">No incentives found.</p>
          ) : (
            <div className="table-responsive">
              <table className="table table-sm table-md table-striped table-hover">
                <thead className="table-dark">
                  <tr>
                    {/* <th>ID</th> */}
                    <th className="text-nowrap">Application</th>
                    <th className="text-nowrap">Beneficiary</th>
                    <th className="text-nowrap">Program</th>
                    <th className="text-nowrap">Amount</th>
                    <th className="text-nowrap">Remaining</th>
                    <th className="text-nowrap">Status</th>
                    <th className="text-nowrap">Date</th>
                    <th className="text-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {incentives.map((incentive) => (
                    <tr key={incentive.incentiveId}>
                      {/* <td className="fw-semibold">{incentive.incentiveId}</td> */}
                      <td className="text-nowrap">{incentive.applicationId}</td>
                      <td className="text-nowrap">{beneficiaryNames[incentive.beneficiaryId] || "Loading..."}</td>
                      <td className="text-nowrap">{programNames[incentive.programId] || "Loading..."}</td>
                      <td className="text-nowrap">₹{incentive.amount.toLocaleString()}</td>
                      <td className="text-nowrap">₹{incentive.remainingAmount.toLocaleString()}</td>
                      <td className="text-nowrap">
                        <span
                          className={`badge ${
                            incentive.status === "COMPLETED"
                              ? "bg-success"
                              : incentive.status === "APPROVED"
                              ? "bg-info"
                              : incentive.status === "PARTIALLY_DISBURSED"
                              ? "bg-warning"
                              : "bg-secondary"
                          }`}
                        >
                          {incentive.status}
                        </span>
                      </td>
                      <td className="text-nowrap">{incentive.sanctionedDate}</td>
                      <td>
                        <ContentGate authority="DISBURSEMENT_OFFICER">
                          <button
                            className="btn btn-sm btn-danger"
                            onClick={() =>
                              handleDelete(incentive.incentiveId)
                            }
                          >
                            Delete
                          </button>
                        </ContentGate>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* ========== CREATE TAB ========== */}
      {activeTab === "create" && (
        <ContentGate authority="DISBURSEMENT_OFFICER">
          <div className="card">
            <div className="card-body p-2 p-sm-3 p-md-4">
              <h4 className="card-title mb-2 mb-md-3 fs-5 fs-md-4">Create New Incentive</h4>
              <form onSubmit={handleCreateIncentive}>
                <div className="mb-2 mb-md-3">
                  <label className="form-label form-label-sm">Select Participant</label>
                  <select
                    className="form-select form-select-sm"
                    value={selectedParticipant}
                    onChange={(e) => setSelectedParticipant(e.target.value)}
                    required
                  >
                    <option value="">-- Choose a participant --</option>
                    {participants.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.legalName || `Participant ${p.id}`}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-2 mb-md-3">
                  <label className="form-label form-label-sm">Incentive Amount</label>
                  <input
                    type="number"
                    className="form-control form-control-sm"
                    placeholder="Enter amount"
                    value={createAmount}
                    onChange={(e) => setCreateAmount(e.target.value)}
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <button type="submit" className="btn btn-success btn-sm w-100 w-md-auto">
                  Create Incentive
                </button>
              </form>
            </div>
          </div>
        </ContentGate>
      )}

      {/* ========== DISBURSEMENTS TAB ========== */}
      {activeTab === "disbursements" && (
        <ContentGate authority="DISBURSEMENT_OFFICER">
          <div className="row g-2 g-md-3 g-lg-4">
            {/* Create Disbursement */}
            <div className="col-12 col-lg-6 mb-2 mb-md-3">
              <div className="card h-100">
                <div className="card-body p-2 p-sm-3 p-md-4">
                  <h5 className="card-title fs-6 fs-md-5">Create Disbursement</h5>
                  <form onSubmit={handleCreateDisbursement}>
                    <div className="mb-2 mb-md-3">
                      <label className="form-label form-label-sm">Select Incentive</label>
                      <select
                        className="form-select form-select-sm"
                        value={selectedIncentiveForDisb}
                        onChange={(e) =>
                          setSelectedIncentiveForDisb(e.target.value)
                        }
                        required
                      >
                        <option value="">
                          -- Choose an incentive --
                        </option>
                        {incentives.map((inc) => (
                          <option key={inc.incentiveId} value={inc.incentiveId}>
                            {beneficiaryNames[inc.beneficiaryId] || "Loading..."} - Incentive #{inc.incentiveId} (₹{inc.remainingAmount.toLocaleString()})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-2 mb-md-3">
                      <label className="form-label form-label-sm">Disbursement Amount</label>
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="Enter amount"
                        value={disbAmount}
                        onChange={(e) => setDisbAmount(e.target.value)}
                        min="0"
                        step="0.01"
                        required
                      />
                    </div>

                    <button type="submit" className="btn btn-success btn-sm w-100">
                      Create Disbursement
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Disbursement History */}
            <div className="col-12 col-lg-6 mb-2 mb-md-3">
              <div className="card h-100">
                <div className="card-body p-2 p-sm-3 p-md-4">
                  <h5 className="card-title fs-6 fs-md-5">Disbursement History</h5>
                  {selectedIncentiveForDisb && (
                    <p className="text-muted small">
                      Showing history for <strong>{beneficiaryNames[incentives.find(inc => inc.incentiveId === parseInt(selectedIncentiveForDisb))?.beneficiaryId] || "Loading..."}</strong> - Incentive #{selectedIncentiveForDisb}
                    </p>
                  )}

                  {disbHistory.length === 0 ? (
                    <p className="text-muted small">
                      {selectedIncentiveForDisb
                        ? "No disbursements found for this incentive."
                        : "Select an incentive to view history."}
                    </p>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-sm table-striped">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Amount</th>
                            <th>Date</th>
                            <th>Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {disbHistory.map((disb) => (
                            <tr key={disb.disbursementId}>
                              <td>{disb.disbursementId}</td>
                              <td>₹{disb.amount.toLocaleString()}</td>
                              <td>{disb.paymentDate}</td>
                              <td>
                                <span className="badge bg-success">
                                  {disb.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Lookup Disbursement by Incentive ID */}
            <div className="col-12 mb-2 mb-md-3">
              <div className="card">
                <div className="card-body p-2 p-sm-3 p-md-4">
                  <h5 className="card-title fs-6 fs-md-5">
                    Search Disbursement by Incentive
                  </h5>
                  <div className="row g-2">
                    <div className="col-12 col-sm-6 col-md-5">
                      <input
                        type="number"
                        className="form-control form-control-sm"
                        placeholder="Incentive ID"
                        value={disbLookupIncentiveId}
                        onChange={(e) =>
                          setDisbLookupIncentiveId(e.target.value)
                        }
                      />
                    </div>
                    <div className="col-12 col-sm-6 col-md-3">
                      <button
                        className="btn btn-primary btn-sm w-100"
                        onClick={() => {
                          clearToast();
                          handleLoadDisbursementHistory(disbLookupIncentiveId);
                        }}
                        disabled={!disbLookupIncentiveId}
                      >
                        Search
                      </button>
                    </div>
                  </div>

                  {disbHistory.length > 0 && disbLookupIncentiveId && (
                    <div className="mt-2 mt-md-3">
                      <h6 className="text-nowrap"><strong>{beneficiaryNames[incentives.find(inc => inc.incentiveId === parseInt(disbLookupIncentiveId))?.beneficiaryId] || "Loading..."}</strong> - Incentive #{disbLookupIncentiveId}</h6>
                      <div className="table-responsive">
                        <table className="table table-sm table-striped">
                          <thead>
                            <tr>
                              <th>Disbursement ID</th>
                              <th>Amount</th>
                              <th>Payment Date</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {disbHistory.map((disb) => (
                              <tr key={disb.disbursementId}>
                                <td>{disb.disbursementId}</td>
                                <td>₹{disb.amount.toLocaleString()}</td>
                                <td>{disb.paymentDate}</td>
                                <td>
                                  <span className="badge bg-success">
                                    {disb.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {disbHistory.length === 0 && disbLookupIncentiveId && (
                    <div className="mt-2 mt-md-3 p-2 p-md-3 bg-light border rounded">
                      <p className="text-muted mb-0 small">No disbursements found for Incentive #{disbLookupIncentiveId}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </ContentGate>
      )}
    </div>
  );
}