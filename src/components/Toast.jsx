import { useEffect } from "react";

const Toast = ({ msg, type, onClose }) => {
  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => onClose(), 3000); // auto close in 3 sec
      return () => clearTimeout(timer);
    }
  }, [msg, onClose]);

  if (!msg) return null;

  return (
    <div
      className={`position-fixed alert alert-${type} shadow`}
      style={{
        top: "20px",
        right: "20px",
        minWidth: "280px",
        maxWidth: "400px",
        zIndex: 9999,
        borderRadius: "8px"
      }}
    >
      <div className="d-flex justify-content-between align-items-center">
        <span>{msg}</span>
        <button className="btn-close" onClick={onClose}></button>
      </div>
    </div>
  );
};

export default Toast;