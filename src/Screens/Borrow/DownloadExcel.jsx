import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import xlsxIcon from "../../Image/xls.png";

const formatEntName = (item) => {
  let name = item.isSalesReturn ? `${item.entName} માલ પરત` : `${item.entName}`;
  return name;
};

const formatEntAmt = (item) => {
  return item?.amount;
};

const downloadExcel = (
  buyData,
  sellData,
  buyTotal,
  sellTotal,
  date,
  page
) => {
  // Remove empty entries
  const filteredbuyData = buyData.filter(
    (item) => item.entName !== "" && item.amount !== ""
  );
  const filteredsellData = sellData.filter(
    (item) => item.entName !== "" && item.amount !== ""
  );

  // Find max length to align rows
  const maxLength = Math.max(
    filteredbuyData.length,
    filteredsellData.length
  );

  // Fill missing rows with empty values
  const buyEntries = [
    ...filteredbuyData,
    ...Array(maxLength - filteredbuyData.length).fill({
      amount: "",
      entName: "",
    }),
  ];
  const sellEntries = [
    ...filteredsellData,
    ...Array(maxLength - filteredsellData.length).fill({
      amount: "",
      entName: "",
    }),
  ];

  // Prepare data
  const data = [
    ["Amount", "ખરીદ", "Amount", "વેચાણ"], // Header Row
    ...buyEntries.map((credit, index) => [
      formatEntAmt(credit) || "",
      formatEntName(credit),
      formatEntAmt(sellEntries[index]) || "",
      formatEntName(sellEntries[index]) || "",
    ]),
    [buyTotal, "ખરીદ Total", sellTotal, "વેચાણ Total"], // Total Row
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
  const fileName = date ? `${page}_${date}_Report` : `${page}_Transaction_Report`;
  
  saveAs(dataBlob, `${fileName}.xlsx`);
};

// Example usage in a React button
const ExportButton = ({
  buyData,
  sellData,
  buyTotal,
  sellTotal,
  date,
  page
}) => {
  return (
    <img
      src={xlsxIcon}
      height={25}
      onClick={() =>
        downloadExcel(buyData, sellData, buyTotal, sellTotal, date, page)
      }
    />
  );
};

export default ExportButton;
