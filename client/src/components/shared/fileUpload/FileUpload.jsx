import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";

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
}) => {
  const Icon =
    iconType === "outlined"
      ? DriveFolderUploadOutlinedIcon
      : DriveFolderUploadIcon;

  const previewSrc =
    file
      ? URL.createObjectURL(file)
      : existingUrl || DEFAULT_PLACEHOLDER;

  return (
    <div className="img-container">
      {showPreview && (
        <img src={previewSrc} alt="preview" />
      )}

      <div className="form-input">
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
      </div>
    </div>
  );
};

export default FileUpload;
