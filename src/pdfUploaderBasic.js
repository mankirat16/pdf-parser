import React, { useState } from "react";
import { pdfjs } from "react-pdf";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "./index.css";

const PdfUploaderBasic = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [textContent, setTextContent] = useState("");
  const [iconLabel, setIconLabel] = useState(true);

  const onFileChange = (event) => {
    const file = event.target.files[0];

    setPdfFile(file);
    setTextContent(""); // Reset text content when a new file is selected

    if (file) {
      setIconLabel(false);
      // Read the PDF file and extract text content
      const reader = new FileReader();
      reader.onload = () => {
        pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
        extractTextContent(reader.result);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const extractTextContent = async (fileData) => {
    const pdf = await pdfjs.getDocument({ data: fileData }).promise;
    console.log(pdf);
    const pdfTextArray = [];
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      const page = await pdf.getPage(pageNumber);
      const textContent = await page.getTextContent();
      const pageText = textContent.items.map((item) => item.str).join("");
      pdfTextArray.push(pageText);
    }
    setTextContent(pdfTextArray.join("\n"));
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        flexDirection: "column",
        backgroundColor: "#dc92fc",
      }}
    >
      <h1 style={{ fontFamily: "Poppins, sans-serif" }}>
        Extract text From PDF!
      </h1>
      <div
        style={{
          backgroundColor: "white",
          minWidth: "700px",
          minHeight: "250px",
          maxWidth: "750px",
          borderRadius: "15px",
          padding: "50px",
        }}
      >
        {iconLabel && (
          <label
            htmlFor="file-upload"
            style={{
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <CloudUploadIcon sx={{ fontSize: 100 }} color="primary" />
            <input
              type="file"
              id="file-upload"
              onChange={onFileChange}
              accept=".pdf"
              style={{ display: "none" }}
            />
            <h2 style={{ fontFamily: "Poppins, sans-serif" }}>
              Drop your files here
            </h2>
          </label>
        )}
        {pdfFile && (
          <div>
            <h1 style={{ fontFamily: "Poppins, sans-serif" }}>Text Content:</h1>
            <div style={{ whiteSpace: "pre-wrap" }}>{textContent}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PdfUploaderBasic;
