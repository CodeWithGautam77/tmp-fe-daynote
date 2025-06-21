import {
  Autocomplete,
  Button,
  CircularProgress,
  TextField,
} from "@mui/material";
import _ from "lodash";
import { useCallback, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { searchUser } from "../../apis/userSlice";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { Download as DownloadIcon } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import PublishIcon from "@mui/icons-material/Publish";
import { LoadingButton } from "@mui/lab";
import { addMultipleEntities } from "../../apis/entitySlice";

// Sample data for Excel
const sampleData = [
  {
    type: "C",
    name: "John Doe",
    searchName: "johndoe",
    city: "New York",
    phone: "1234567890",
    amount: 1000,
    openingBalance: 500,
    reference: "Ref123",
    note: "Sample note",
  },
  {
    type: "S",
    name: "Jane Smith",
    searchName: "janesmith",
    city: "Los Angeles",
    phone: "0987654321",
    amount: 2000,
    openingBalance: 1000,
    reference: "Ref456",
    note: "Another note",
  },
];

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

export default function UploadExcel() {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [validRows, setValidRows] = useState([]); // 1. Add state
  const [submitLoading, setSubmitLoading] = useState(false);

  const dispatch = useDispatch();

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      _.debounce(async (value) => {
        setLoading(true);
        try {
          const res = await dispatch(searchUser({ query: value })).unwrap();
          setOptions(res.data || []);
        } catch {
          setOptions([]);
        }
        setLoading(false);
      }, 400),
    [dispatch]
  );

  // Handle search input change
  const handleInputChange = useCallback(
    (event, value) => {
      if (value.length < 2) {
        setOptions([]);
        debouncedSearch.cancel();
        setLoading(false);
        return;
      }
      debouncedSearch(value);
    },
    [debouncedSearch]
  );

  const REQUIRED_COLUMNS = [
    "type",
    "name",
    "searchName",
    "city",
    "phone",
    "amount",
    "openingBalance",
    "reference",
    "note",
  ];

  const ALLOWED_TYPES = ["C", "S", "B", "A", "SE"];

  function validateColumns(columns) {
    const missing = REQUIRED_COLUMNS.filter((col) => !columns.includes(col));
    const extra = columns.filter((col) => !REQUIRED_COLUMNS.includes(col));
    const isValid =
      columns.length === REQUIRED_COLUMNS.length &&
      missing.length === 0 &&
      extra.length === 0;
    return { isValid, missing, extra };
  }

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      const [header, ...rows] = jsonData;
      const { isValid, missing, extra } = validateColumns(header);
      if (!isValid) {
        let msg = "Invalid columns.\n";
        if (missing.length) msg += "Missing: " + missing.join(", ") + "\n";
        if (extra.length) msg += "Extra: " + extra.join(", ") + "\n";
        msg += "Required: " + REQUIRED_COLUMNS.join(", ");
        toast.error(msg, {
          autoClose: 8000,
          style: {
            minWidth: "700px",
            maxWidth: "700px",
            whiteSpace: "pre-line",
          },
        });
        event.target.value = "";
        return;
      }
      if (rows.length > 1000) {
        toast.error("Maximum 1000 rows allowed.");
        event.target.value = "";
        return;
      }
      // Separate valid and invalid rows based on 'type'
      const validRows = [];
      const invalidRows = [];
      rows.forEach((row) => {
        const rowObj = Object.fromEntries(
          header.map((key, i) => [key, row[i] ?? ""])
        );
        if (ALLOWED_TYPES.includes(rowObj.type)) {
          validRows.push(rowObj);
        } else {
          invalidRows.push(rowObj);
        }
      });

      // If there are invalid rows, create an Excel file for them
      if (invalidRows.length > 0) {
        const ws = XLSX.utils.json_to_sheet(invalidRows, { header: header });
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "InvalidRows");
        XLSX.writeFile(wb, "invalid_rows.xlsx");
        toast.error(
          `${invalidRows.length} invalid rows found. Downloaded as invalid_rows.xlsx.`,
          {
            autoClose: 8000,
            style: {
              minWidth: "400px",
              maxWidth: "700px",
              whiteSpace: "pre-line",
            },
          }
        );
      }

      // validRows is your final output
      setValidRows(validRows); // 2. Set valid rows to state
      event.target.value = "";
      // You can set validRows to state if needed
    };
    reader.readAsArrayBuffer(file);
  };

  const handleSubmit = async () => {
    setSubmitLoading(true);
    if (!selectedOption && !selectedOption?._id) {
      toast.error("Please select a user.");
      return;
    }
    if (validRows.length === 0) {
      toast.error("No Data to Submit");
      return;
    }
    const finalRows = validRows.map((item) => ({
      ...item,
      uId: selectedOption._id,
      roundOffAmount: 0,
    }));
    const response = await dispatch(
      addMultipleEntities({ entities: finalRows })
    );
    if (!response?.payload?.error) {
      setSelectedOption(null);
      setValidRows([]);
      toast.success("Success");
      setSubmitLoading(false);
    } else {
      toast.error(response?.payload?.message);
      setSubmitLoading(false);
    }
  };

  // Download sample Excel
  const handleDownloadSample = () => {
    const ws = XLSX.utils.json_to_sheet(sampleData, {
      header: REQUIRED_COLUMNS,
    });
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sample");
    XLSX.writeFile(wb, "sample_upload.xlsx");
  };

  const columns = REQUIRED_COLUMNS.map((col) => ({
    field: col,
    headerName: col.charAt(0).toUpperCase() + col.slice(1),
    flex: 1,
    minWidth: 120,
  }));

  // Add an id field for DataGrid
  const rowsWithId = validRows.map((row, idx) => ({
    id: idx + 1,
    ...row,
  }));

  return (
    <div>
      <div className="flexBetween">
        <Autocomplete
          options={options}
          getOptionLabel={(option) => option?.name || ""}
          getOptionKey={(option) => option?._id || ""}
          value={selectedOption}
          isOptionEqualToValue={(option, value) => option._id === value._id}
          onChange={(event, newValue) => setSelectedOption(newValue)}
          loading={loading}
          renderInput={(params) => (
            <TextField
              {...params}
              onChange={(e) => {
                handleInputChange(e, e.target.value);
              }}
              label="Search User"
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading ? (
                      <CircularProgress color="inherit" size={20} />
                    ) : null}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
            />
          )}
          sx={{ width: 300 }}
          size="small"
        />
        <div className="flex">
          {selectedOption && validRows.length > 0 && (
            <LoadingButton
              component="label"
              role={undefined}
              variant="contained"
              color="success"
              sx={{ mr: 2 }}
              startIcon={<PublishIcon />}
              onClick={handleSubmit}
              loadingPosition="start"
              loading={submitLoading}
            >
              Submit
            </LoadingButton>
          )}
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleDownloadSample}
            sx={{ mr: 2 }}
          >
            Download Sample Excel
          </Button>
          {selectedOption && validRows.length === 0 && (
            <Button
              component="label"
              role={undefined}
              variant="contained"
              tabIndex={-1}
              startIcon={<CloudUploadIcon />}
            >
              Upload file
              <VisuallyHiddenInput
                type="file"
                accept=".xlsx,.xls"
                onChange={handleFileChange}
              />
            </Button>
          )}
          {validRows.length > 0 && (
            <Button
              color="secondary"
              variant="outlined"
              sx={{ ml: 2 }}
              startIcon={<CloudUploadIcon />}
              onClick={() => {
                setValidRows([]); // Reset valid rows
              }}
            >
              Re Upload
            </Button>
          )}
        </div>
      </div>
      <div style={{ height: 500, width: "100%", marginTop: 24 }}>
        <DataGrid
          rows={rowsWithId}
          columns={[{ field: "id", headerName: "ID", width: 70 }, ...columns]}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          pagination
          loading={false}
        />
      </div>
    </div>
  );
}
