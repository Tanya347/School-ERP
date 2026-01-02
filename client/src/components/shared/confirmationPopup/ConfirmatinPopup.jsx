import "./confirmPopup.scss";

const ConfirmPopup = ({ message, onConfirm, onCancel }) => {
  return (
    <div className="confirm-popup-overlay">
      <div className="confirm-popup">
        <h3>Confirm Action</h3>
        <p>{message}</p>
        <div className="confirm-buttons">
          <button className="cancel-btn" onClick={onCancel}>
            Cancel
          </button>
          <button className="confirm-btn" onClick={onConfirm}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmPopup;
