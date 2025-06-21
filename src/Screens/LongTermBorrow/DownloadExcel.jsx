import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import xlsxIcon from "../../Image/xls.png";

const formatEntName = (item) => {
  let name = `${item?.entName} ${item?.entArea ? `${item?.entArea}` : ""}`;
  return name;
};

const formatEntAmt = (item) => {
  return item?.amount;
};

const downloadExcel = (longtermBorrow, longtermBorrowTotal, date, page) => {
  // Remove empty entries
  const filteredlongtermBorrow = longtermBorrow.filter(
    (item) => item.entName !== "" && item.amount !== ""
  );

  // Find max length to align rows
  const maxLength = Math.max(filteredlongtermBorrow.length);

  // Fill missing rows with empty values
  const buyEntries = [
    ...filteredlongtermBorrow,
    ...Array(maxLength - filteredlongtermBorrow.length).fill({
      amount: "",
      entName: "",
    }),
  ];

  // Prepare data
  const data = [
    ["Amount", "ઉચક"], // Header Row
    ...buyEntries.map((credit, index) => [
      formatEntAmt(credit) || "",
      formatEntName(credit),
    ]),
    [longtermBorrowTotal, "ઉચક Total"], // Total Row
  ];

  // Convert data to worksheet
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Report");

  // Write and download file
  const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
  const dataBlob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });
  const fileName = date
    ? `${page}_${date}_Report`
    : `${page}_Transaction_Report`;

  saveAs(dataBlob, `${fileName}.xlsx`);
};

// Example usage in a React button
const ExportButton = ({ longtermBorrow, longtermBorrowTotal, date, page }) => {
  return (
    <img
      src={xlsxIcon}
      height={25}
      onClick={() =>
        downloadExcel(longtermBorrow, longtermBorrowTotal, date, page)
      }
    />
  );
};

export default ExportButton;
