import React, { useState, useCallback } from "react";
import styled from "styled-components";
import {
  FaCloudUploadAlt,
  FaFileImage,
  FaTimes,
  FaCheck,
} from "react-icons/fa";
import { useDropzone } from "react-dropzone";
import { uploadSample } from "../services/api.js";

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(5px);
`;

const ModalContent = styled.div`
  background: linear-gradient(
    135deg,
    rgba(20, 20, 20, 0.95),
    rgba(31, 31, 31, 0.95)
  );
  border: 2px solid #00ff00;
  border-radius: 12px;
  padding: 30px;
  width: 90%;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 0 30px rgba(0, 255, 0, 0.3);
  position: relative;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: transparent;
  border: none;
  color: #ff6666;
  font-size: 20px;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    color: #ff4444;
    transform: scale(1.1);
  }
`;

const Title = styled.h2`
  color: #00ff00;
  margin: 0 0 25px 0;
  font-size: 1.8rem;
  text-align: center;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px #00ff00;
`;

const DropzoneContainer = styled.div`
  border: 2px dashed
    ${(props) => (props.isDragActive ? "#00bfff" : "rgba(0, 255, 0, 0.3)")};
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(0, 0, 0, 0.3);
  margin-bottom: 20px;

  &:hover {
    border-color: #00bfff;
    background: rgba(0, 191, 255, 0.1);
  }
`;

const UploadIcon = styled.div`
  font-size: 3rem;
  color: ${(props) => (props.isDragActive ? "#00bfff" : "#00ff00")};
  margin-bottom: 15px;
  transition: all 0.3s ease;
`;

const UploadText = styled.div`
  color: #00bfff;
  font-size: 1.1rem;
  margin-bottom: 8px;
  font-weight: 600;
`;

const UploadSubtext = styled.div`
  color: rgba(0, 255, 0, 0.7);
  font-size: 0.9rem;
`;

const FileList = styled.div`
  margin-top: 20px;
`;

const FileItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 15px;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 8px;
  margin-bottom: 10px;
  border: 1px solid rgba(0, 255, 0, 0.2);
`;

const FileInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const FileIcon = styled(FaFileImage)`
  color: #00bfff;
  margin-right: 12px;
  font-size: 1.2rem;
`;

const FileDetails = styled.div`
  flex: 1;
`;

const FileName = styled.div`
  color: #00ff00;
  font-weight: 600;
  font-size: 14px;
`;

const FileSize = styled.div`
  color: rgba(0, 255, 0, 0.6);
  font-size: 12px;
`;

const FileStatus = styled.div`
  display: flex;
  align-items: center;
  color: ${(props) => (props.uploaded ? "#66ff66" : "#ff6666")};
  font-size: 14px;
  font-weight: 600;
`;

const RemoveButton = styled.button`
  background: rgba(255, 68, 68, 0.2);
  border: 1px solid #ff4444;
  color: #ff6666;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 10px;
  transition: all 0.3s ease;

  &:hover {
    background: rgba(255, 68, 68, 0.4);
    border-color: #ff6666;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
`;

const Button = styled.button`
  padding: 12px 25px;
  border: 2px solid;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 12px;
  transition: all 0.3s ease;
  min-width: 100px;

  &.primary {
    background: rgba(0, 255, 0, 0.1);
    border-color: #00ff00;
    color: #00ff00;

    &:hover {
      background: rgba(0, 255, 0, 0.2);
      border-color: #00bfff;
      color: #00bfff;
    }
  }

  &.secondary {
    background: rgba(255, 68, 68, 0.1);
    border-color: #ff4444;
    color: #ff6666;

    &:hover {
      background: rgba(255, 68, 68, 0.2);
      border-color: #ff6666;
    }
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StatusMessage = styled.div`
  margin-top: 15px;
  padding: 10px;
  border-radius: 6px;
  text-align: center;
  font-weight: 600;

  &.success {
    background: rgba(0, 255, 0, 0.1);
    border: 1px solid #00ff00;
    color: #66ff66;
  }

  &.error {
    background: rgba(255, 68, 68, 0.1);
    border: 1px solid #ff4444;
    color: #ff6666;
  }
`;

const UploadEvidence = ({
  isOpen,
  onClose,
  onUploadComplete,
  personId = null,
}) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState(null);

  const onDrop = useCallback((acceptedFiles) => {
    const newFiles = acceptedFiles.map((file) => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      uploaded: false,
      uploading: false,
      error: null,
    }));
    setFiles((prev) => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif", ".bmp"],
    },
    multiple: true,
  });

  const removeFile = (fileId) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const uploadFiles = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setStatus(null);

    try {
      const uploadPromises = files.map(async (fileItem) => {
        try {
          fileItem.uploading = true;
          setFiles((prev) => [...prev]); // Trigger re-render

          const response = await uploadSample(fileItem.file, personId);
          fileItem.uploaded = true;
          fileItem.uploading = false;
          fileItem.sample_id = response.data.sample_id;

          return response.data;
        } catch (error) {
          fileItem.uploading = false;
          fileItem.error = error.message;
          throw error;
        }
      });

      const results = await Promise.allSettled(uploadPromises);

      const successful = results.filter((r) => r.status === "fulfilled").length;
      const failed = results.filter((r) => r.status === "rejected").length;

      if (successful > 0) {
        setStatus({
          type: "success",
          message: `Successfully uploaded ${successful} file${
            successful > 1 ? "s" : ""
          }${failed > 0 ? `, ${failed} failed` : ""}`,
        });

        // Notify parent component
        if (onUploadComplete) {
          const uploadedSamples = results
            .filter((r) => r.status === "fulfilled")
            .map((r) => r.value);
          onUploadComplete(uploadedSamples);
        }

        // Close modal after a delay
        setTimeout(() => {
          onClose();
          setFiles([]);
        }, 2000);
      } else {
        setStatus({
          type: "error",
          message: "All uploads failed. Please try again.",
        });
      }
    } catch (error) {
      console.error("Upload error:", error);
      setStatus({
        type: "error",
        message: "Upload failed. Please try again.",
      });
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  if (!isOpen) return null;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>
          <FaTimes />
        </CloseButton>

        <Title>Upload Handwriting Samples</Title>

        <DropzoneContainer {...getRootProps()} isDragActive={isDragActive}>
          <input {...getInputProps()} />
          <UploadIcon isDragActive={isDragActive}>
            <FaCloudUploadAlt />
          </UploadIcon>
          <UploadText>
            {isDragActive
              ? "Drop the files here..."
              : "Drag & drop handwriting samples here"}
          </UploadText>
          <UploadSubtext>
            or click to select files (PNG, JPG, JPEG, GIF, BMP)
          </UploadSubtext>
        </DropzoneContainer>

        {files.length > 0 && (
          <FileList>
            <h3 style={{ color: "#00bfff", marginBottom: "15px" }}>
              Files to Upload:
            </h3>
            {files.map((fileItem) => (
              <FileItem key={fileItem.id}>
                <FileInfo>
                  <FileIcon />
                  <FileDetails>
                    <FileName>{fileItem.file.name}</FileName>
                    <FileSize>{formatFileSize(fileItem.file.size)}</FileSize>
                  </FileDetails>
                </FileInfo>

                <FileStatus uploaded={fileItem.uploaded}>
                  {fileItem.uploading && "Uploading..."}
                  {fileItem.uploaded && (
                    <>
                      <FaCheck style={{ marginRight: "5px" }} />
                      Uploaded
                    </>
                  )}
                  {fileItem.error && "Failed"}
                </FileStatus>

                {!fileItem.uploading && !fileItem.uploaded && (
                  <RemoveButton onClick={() => removeFile(fileItem.id)}>
                    <FaTimes />
                  </RemoveButton>
                )}
              </FileItem>
            ))}
          </FileList>
        )}

        <ButtonGroup>
          <Button type="button" className="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="button"
            className="primary"
            onClick={uploadFiles}
            disabled={files.length === 0 || uploading}
          >
            {uploading
              ? "Uploading..."
              : `Upload ${files.length} File${files.length !== 1 ? "s" : ""}`}
          </Button>
        </ButtonGroup>

        {status && (
          <StatusMessage className={status.type}>
            {status.message}
          </StatusMessage>
        )}
      </ModalContent>
    </ModalOverlay>
  );
};

export { UploadEvidence };
