import "./fileUpload.scss"

import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import RestoreIcon from "@mui/icons-material/Restore";

import { DEFAULT_PLACEHOLDER } from "../../../utils/shared/constants"

const FileUpload = ({
  file,
  setFile,
  existingUrl = null,          // info.poster / info.profilePicture / info.fileUrl
  label = "File",
  accept,
  showPreview = true,           // image preview or not
  showFileName = false,
  showViewLink = false,
  iconType = "outlined",        // "outlined" | "filled"
  onDeleteImage = null,         // callback when delete is clicked
  isImageDeleted = false,       // flag to show deleted state
}) => {
  const Icon =
    iconType === "outlined"
      ? DriveFolderUploadOutlinedIcon
      : DriveFolderUploadIcon;

  const previewSrc =
    file
      ? URL.createObjectURL(file)
      : existingUrl || DEFAULT_PLACEHOLDER;

  const showDeletedOverlay = isImageDeleted && existingUrl && !file;

  return (
    <div className="img-container">
      {showPreview && (
        <div className="image-preview-wrapper">
          <img
            src={previewSrc}
            alt="preview"
            className={showDeletedOverlay ? "deleted-image" : ""}
          />
          {showDeletedOverlay && (
            <div className="deleted-overlay">
              <span>Image will be deleted</span>
            </div>
          )}
        </div>
      )}

      <div className="form-input file-upload-controls">
        <label htmlFor="file">
          {label}: <Icon className="icon" />
        </label>

        <input
          type="file"
          id="file"
          accept={accept}
          onChange={(e) => setFile(e.target.files[0])}
          style={{ display: "none" }}
        />

        {showViewLink && !file && existingUrl && (
          <button>
            <a
              href={existingUrl}
              target="_blank"
              rel="noreferrer"
              className="view-file-container"
              style={{ textDecoration: "none", color: "black" }}
            >
              View File
            </a>
          </button>
        )}

        {showFileName && file && (
          <span style={{ marginLeft: 10, fontWeight: "bold" }}>
            {file.name}
          </span>
        )}

        {/* Delete/Restore Image Button - only show for edit mode with existing image */}
        {onDeleteImage && existingUrl && !file && (
          <button
            type="button"
            onClick={onDeleteImage}
            className={`delete-image-btn ${isImageDeleted ? 'restore' : ''}`}
          >
            {isImageDeleted ? (
              <><RestoreIcon className="icon" /> Restore File</>
            ) : (
              <><DeleteIcon className="icon" /> Delete File</>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default FileUpload;
