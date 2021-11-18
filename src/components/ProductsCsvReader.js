import React, { useEffect, useState } from "react";
import { Button, FormControl } from "@material-ui/core";
import * as XLSX from "xlsx";

function ProductsCsvReader({ bulkUpload, selectedFile, setSelectedFile }) {
  const [columns, setColumns] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (selectedFile) handleFileUpload(selectedFile);
  }, [selectedFile]);

  // process CSV data
  const processData = (dataString) => {
    const dataStringLines = dataString.split(/\r\n|\n/);
    const headers = dataStringLines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);

    const list = [];
    for (let i = 1; i < dataStringLines.length; i++) {
      const row = dataStringLines[i].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/);
      if (headers && row.length == headers.length) {
        const obj = {};
        for (let j = 0; j < headers.length; j++) {
          let d = row[j];
          if (d.length > 0) {
            if (d[0] == '"') d = d.substring(1, d.length - 1);
            if (d[d.length - 1] == '"') d = d.substring(d.length - 2, 1);
          }
          if (headers[j]) {
            obj[headers[j]] = d;
          }
        }

        // remove the blank rows
        if (Object.values(obj).filter((x) => x).length > 0) {
          list.push(obj);
        }
      }
    }

    // prepare columns list from headers
    const columns = headers.map((c) => ({
      name: c,
      selector: c,
    }));

    bulkUpload({ products: list });
    // setData(list);
    // setColumns(columns);
  };

  // handle file upload
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      /* Parse data */
      const bstr = evt.target.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      /* Get first worksheet */
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      /* Convert array of arrays */
      const data = XLSX.utils.sheet_to_csv(ws, { header: 1 });
      processData(data);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <FormControl fullWidth={true} variant="outlined">
      <Button key={12} variant="contained" color="primary" component="label" style={{ marginRight: 5 }}>
        Upload
        <input
          type="file"
          hidden
          onClick={(e) => {
            setSelectedFile(null);
            e.target.value = null;
          }}
          onChange={(e) => {
            setSelectedFile(e);
          }}
          accept=".csv,.xlsx,.xls"
        />
      </Button>
    </FormControl>
  );
}

export default ProductsCsvReader;
