import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getReports,
  getReportById,
  downloadReportFile,
  submitFeedback,
  getReportFeedback,
  removeToken,
} from '../api';

function Report() {
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportDetails, setReportDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Feedback state
  const [rating, setRating] = useState(5);
  const [comments, setComments] = useState('');
  const [feedbacks, setFeedbacks] = useState([]);
  const [feedbackSuccess, setFeedbackSuccess] = useState('');

  const navigate = useNavigate();

  const handleSelectReport = useCallback(async (reportId) => {
    setSelectedReport(reportId);
    setFeedbackSuccess('');
    try {
      const data = await getReportById(reportId);
      setReportDetails(data.report);

      // Load feedback
      const fbData = await getReportFeedback(reportId);
      setFeedbacks(fbData.feedbacks || []);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;
    getReports()
      .then((data) => {
        if (!isMounted) return;
        setReports(data.reports || []);
        if (data.reports && data.reports.length > 0) {
          handleSelectReport(data.reports[0].id);
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        if (err.message.includes('token') || err.message.includes('Access denied')) {
          removeToken();
          navigate('/login');
        } else {
          setError(err.message);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [handleSelectReport, navigate]);

  const handleSubmitFeedback = async (e) => {
    e.preventDefault();
    if (!selectedReport) return;

    try {
      await submitFeedback({
        report_id: selectedReport,
        rating,
        comments,
      });

      setFeedbackSuccess('Thank you! Your feedback has been recorded.');
      setComments('');

      // Reload feedback list
      const fbData = await getReportFeedback(selectedReport);
      setFeedbacks(fbData.feedbacks || []);
    } catch (err) {
      alert(`Feedback submission failed: ${err.message}`);
    }
  };

  const getSeverityColor = (severity) => {
    const colors = {
      CRITICAL: '#ff1744',
      HIGH: '#ff6d00',
      MEDIUM: '#ffd600',
      LOW: '#00c853',
    };
    return colors[severity] || '#888';
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#00bcd4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <h2>Loading Security Reports...</h2>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', fontFamily: 'Arial, sans-serif', color: '#fff' }}>
      {/* Header / Navbar */}
      <div
        style={{
          background: '#111',
          borderBottom: '1px solid #222',
          padding: '16px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ color: '#00bcd4', fontSize: '22px', margin: 0 }}>🛡️ Security Analysis Reports</h1>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => navigate('/analyzer')}
            style={{
              padding: '8px 16px',
              background: '#00bcd4',
              color: '#000',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: 'bold',
            }}
          >
            + Run New Scan
          </button>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              padding: '8px 16px',
              background: 'transparent',
              color: '#888',
              border: '1px solid #333',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            Dashboard
          </button>
        </div>
      </div>

      {error && (
        <div style={{ background: '#2a0000', color: '#ff5252', padding: '12px 32px', borderBottom: '1px solid #ff5252', fontSize: '14px' }}>
          {error}
        </div>
      )}

      <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '300px 1fr', gap: '24px' }}>
        {/* Reports List Sidebar */}
        <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '20px', height: 'fit-content' }}>
          <h3 style={{ color: '#00bcd4', marginTop: 0, marginBottom: '16px', fontSize: '16px' }}>All Security Reports</h3>

          {reports.length === 0 ? (
            <p style={{ color: '#666', fontSize: '14px' }}>No reports found. Run a scan first.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {reports.map((rep) => (
                <div
                  key={rep.id}
                  onClick={() => handleSelectReport(rep.id)}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    background: selectedReport === rep.id ? '#1a1a2e' : '#0d0d0d',
                    border: selectedReport === rep.id ? '1px solid #00bcd4' : '1px solid #222',
                    cursor: 'pointer',
                  }}
                >
                  <p style={{ margin: 0, fontWeight: 'bold', fontSize: '14px', color: '#fff' }}>
                    {rep.Scan?.Project?.project_name || 'Project Scan'}
                  </p>
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#888' }}>
                    Report #{rep.id} • {new Date(rep.generated_date).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Report Main Content Area */}
        {reportDetails ? (
          <div>
            {/* Top Toolbar / Download Buttons */}
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '20px', color: '#fff' }}>
                  {reportDetails.Scan?.Project?.project_name || 'Security Analysis Report'}
                </h2>
                <p style={{ margin: '4px 0 0 0', color: '#888', fontSize: '13px' }}>
                  Scan Date: {new Date(reportDetails.generated_date).toLocaleString()} • Type: {reportDetails.Scan?.scan_type}
                </p>
              </div>

              {/* Download buttons for JSON, MD, PDF */}
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => downloadReportFile(reportDetails.id, 'json')}
                  style={{ padding: '8px 14px', background: '#222', color: '#00bcd4', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                >
                  ⬇️ JSON
                </button>
                <button
                  onClick={() => downloadReportFile(reportDetails.id, 'md')}
                  style={{ padding: '8px 14px', background: '#222', color: '#00c853', border: '1px solid #333', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                >
                  ⬇️ Markdown
                </button>
                <button
                  onClick={() => downloadReportFile(reportDetails.id, 'pdf')}
                  style={{ padding: '8px 14px', background: '#00bcd4', color: '#000', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                >
                  📄 Export PDF
                </button>
              </div>
            </div>

            {/* Risk Score & Stats Banner */}
            <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '16px', marginBottom: '20px' }}>
              <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
                <p style={{ color: '#888', fontSize: '13px', margin: '0 0 4px 0' }}>Overall Risk Score</p>
                <p style={{ fontSize: '42px', fontWeight: 'bold', margin: 0, color: reportDetails.Scan?.risk_score > 70 ? '#ff1744' : '#ffd600' }}>
                  {reportDetails.Scan?.risk_score} / 100
                </p>
              </div>

              <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '20px', display: 'flex', justifyContent: 'space-around', alignItems: 'center' }}>
                {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((sev) => {
                  const count = (reportDetails.Scan?.Vulnerabilities || []).filter((v) => v.severity === sev).length;
                  return (
                    <div key={sev} style={{ textAlign: 'center' }}>
                      <p style={{ color: getSeverityColor(sev), fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{count}</p>
                      <p style={{ color: '#888', fontSize: '12px', margin: '4px 0 0 0' }}>{sev}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Vulnerabilities Table */}
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '24px', marginBottom: '24px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#00bcd4' }}>Vulnerabilities List</h3>

              {(reportDetails.Scan?.Vulnerabilities || []).length === 0 ? (
                <p style={{ color: '#00c853' }}>✓ No vulnerabilities identified in this report.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {(reportDetails.Scan?.Vulnerabilities || []).map((v) => (
                    <div
                      key={v.id}
                      style={{
                        background: '#0d0d0d',
                        borderLeft: `4px solid ${getSeverityColor(v.severity)}`,
                        border: '1px solid #222',
                        borderRadius: '8px',
                        padding: '16px',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ fontWeight: 'bold', fontSize: '15px', color: '#fff' }}>{v.vulnerability_name}</span>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <span style={{ background: getSeverityColor(v.severity) + '22', color: getSeverityColor(v.severity), padding: '2px 8px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold' }}>
                            {v.severity}
                          </span>
                          <span style={{ background: '#222', color: '#888', padding: '2px 8px', borderRadius: '12px', fontSize: '12px' }}>
                            {v.cwe_id}
                          </span>
                        </div>
                      </div>
                      <p style={{ color: '#aaa', fontSize: '13px', margin: '0 0 8px 0' }}>{v.description}</p>
                      <p style={{ color: '#00c853', fontSize: '13px', margin: 0 }}>✓ {v.recommendation}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Feedback Widget Section */}
            <div style={{ background: '#111', border: '1px solid #222', borderRadius: '12px', padding: '24px' }}>
              <h3 style={{ marginTop: 0, marginBottom: '16px', color: '#00bcd4', fontSize: '16px' }}>Rate & Review this Security Report</h3>

              {feedbackSuccess && (
                <div style={{ background: '#00c85322', border: '1px solid #00c853', color: '#00c853', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '13px' }}>
                  {feedbackSuccess}
                </div>
              )}

              <form onSubmit={handleSubmitFeedback} style={{ marginBottom: '24px' }}>
                <div style={{ marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label style={{ fontSize: '14px', color: '#ccc' }}>Rating (1 to 5 Stars):</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span
                        key={star}
                        onClick={() => setRating(star)}
                        style={{ fontSize: '24px', cursor: 'pointer', color: star <= rating ? '#ffd600' : '#444' }}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <textarea
                  placeholder="Share your comments or feedback on this report..."
                  value={comments}
                  onChange={(e) => setComments(e.target.value)}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '12px',
                    background: '#1a1a2e',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: '#fff',
                    fontSize: '13px',
                    boxSizing: 'border-box',
                    marginBottom: '12px',
                  }}
                />

                <button
                  type="submit"
                  style={{
                    padding: '10px 20px',
                    background: '#00bcd4',
                    color: '#000',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: 'bold',
                    cursor: 'pointer',
                  }}
                >
                  Submit Review
                </button>
              </form>

              {/* Existing Reviews */}
              {feedbacks.length > 0 && (
                <div>
                  <h4 style={{ color: '#888', marginBottom: '12px', fontSize: '14px' }}>User Reviews ({feedbacks.length})</h4>
                  {feedbacks.map((fb) => (
                    <div key={fb.id} style={{ background: '#0d0d0d', border: '1px solid #222', borderRadius: '6px', padding: '12px', marginBottom: '8px' }}>
                      <div style={{ color: '#ffd600', marginBottom: '4px' }}>{'★'.repeat(fb.rating)}</div>
                      <p style={{ color: '#ddd', fontSize: '13px', margin: 0 }}>{fb.comments || 'No comment provided.'}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
            Select a report from the sidebar to view full details.
          </div>
        )}
      </div>
    </div>
  );
}

export default Report;