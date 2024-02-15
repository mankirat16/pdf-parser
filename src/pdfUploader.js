import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { saveAs } from "file-saver";

const PdfUploader = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [textContent, setTextContent] = useState("");

  const onFileChange = (event) => {
    const file = event.target.files[0];
    setPdfFile(file);
    setTextContent(""); // Reset text content when a new file is selected

    if (file) {
      // Read the PDF file and set the number of pages
      const reader = new FileReader();
      reader.onloadend = () => {
        pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
        setNumPages(null); // Reset numPages while loading
      };
      reader.onload = () => {
        setNumPages(null); // Reset numPages before loading
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    // Extract text content when the document is successfully loaded
    extractTextContent();
  };

  const extractTextContent = async () => {
    const pdfTextArray = [];
    for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
      const pageText = await pdfjs
        .getDocument({ data: pdfFile.arrayBuffer })
        .then((pdf) => pdf.getPage(pageNumber))
        .then((page) => page.getTextContent())
        .then((textContent) =>
          textContent.items.map((item) => item.str).join(" ")
        );
      pdfTextArray.push(pageText);
    }
    setTextContent(pdfTextArray.join("\n"));
  };
  console.log(textContent);

  return (
    <div>
      <input type="file" onChange={onFileChange} />
      {pdfFile && (
        <div>
          <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
          <div>
            <h3>Text Content:</h3>
            <pre>{textContent}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfUploader;
