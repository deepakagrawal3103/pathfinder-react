import { useState, useMemo } from "react";
import institutes from "../data/institutes.json";

function Institutions() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");

  const uniqueTypes = useMemo(() => {
    if (!Array.isArray(institutes)) return [];
    const types = new Set(institutes.map(inst => inst.Type).filter(Boolean));
    return Array.from(types).sort();
  }, []);

  const filteredInstitutes = useMemo(() => {
    if (!Array.isArray(institutes)) return [];
    return institutes.filter(inst => {
      const matchesSearch = (inst.Institution || "").toLowerCase().includes(searchQuery.toLowerCase()) || 
                            (inst["Primary Fields"] || "").toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = filterType ? inst.Type === filterType : true;
      return matchesSearch && matchesType;
    });
  }, [searchQuery, filterType]);
  if (!Array.isArray(institutes)) {
    return (
      <main className="dashboard-page">
        <section className="dashboard-section">
          <h2 className="section-heading">Institutions</h2>
          <p>Institute data is unavailable.</p>
        </section>
      </main>
    );
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-section">
        <h2 className="section-heading">Institutions</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
          <input
            type="text"
            placeholder="Search institutions or fields..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ flex: 1, minWidth: '250px', padding: '0.8rem', borderRadius: '8px', border: '1px solid #cbd5e1', outline: 'none' }}
          />
          <select
            className="form-select"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            style={{ width: 'auto', minWidth: '200px', margin: 0 }}
          >
            <option value="">All Types</option>
            {uniqueTypes.map(type => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>

        {filteredInstitutes.length === 0 ? (
          <p style={{ textAlign: "center", padding: "2rem", color: "var(--text-light)" }}>No institutions match your search criteria.</p>
        ) : (
          <div className="institution-grid">
            {filteredInstitutes.map((inst, index) => (
            <div className="institution-card" key={index}>
              <h3>{inst.Institution || "Unnamed Institution"}</h3>

              <p>
                <b>Type:</b> {inst.Type || "N/A"}
              </p>

              <p>
                <b>Primary Field:</b>{" "}
                {inst["Primary Fields"] || "Not specified"}
              </p>

              <p>
                <b>Location:</b>{" "}
                {inst.City || "Unknown"},{" "}
                {inst.State || "Unknown"}
              </p>

              {inst["Admission Criteria"] && (
                <p>
                  <b>Admission:</b> {inst["Admission Criteria"]}
                </p>
              )}
            </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default Institutions;
