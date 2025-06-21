import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import xlsxIcon from "../../Image/xls.png";

const formatEntName = (item) => {
  if (item.type === "T") {
    let name = `${item.entName} ${item.entArea && item.entArea}`;
    return name;
  } else {
    let name =
      item.etype === "MR"
        ? `${item.entName} ${item.amount} રજા`
        : item.etype === "P"
        ? `${item.entName} ચૂકતે`
        : item.etype === "R"
        ? `${item.entName} નેટ`
        : item.entName;

    if (item.byWhom) {
      name += ` (${item.byWhom})`;
    }

    return name;
  }
};

const formatEntAmt = (item) => {
  if (item.type === "T") {
    let amt = item.amount;
    return amt;
  } else {
    let amt = item.etype === "MR" ? "" : item.amount;
    return amt;
  }
};

const downloadExcel = (
  creditData,
  debitData,
  thirdData,
  creditTotal,
  debitTotal,
  thirdTotal,
  date,
  page
) => {
  // Remove empty entries
  const filteredCreditData = creditData.filter(
    (item) => item.entName !== "" && item.amount !== ""
  );
  const filteredDebitData = debitData.filter(
    (item) => item.entName !== "" && item.amount !== ""
  );
  const filteredThirdData = thirdData.filter(
    (item) => item.entName !== "" && item.amount !== ""
  );

  // Find max length to align rows
  const maxLength = Math.max(
    filteredCreditData.length,
    filteredDebitData.length,
    filteredThirdData.length
  );

  // Fill missing rows with empty values
  const creditEntries = [
    ...filteredCreditData,
    ...Array(maxLength - filteredCreditData.length).fill({
      amount: "",
      entName: "",
    }),
  ];
  const debitEntries = [
    ...filteredDebitData,
    ...Array(maxLength - filteredDebitData.length).fill({
      amount: "",
      entName: "",
    }),
  ];
  const thirdEntries = [
    ...filteredThirdData,
    ...Array(maxLength - filteredThirdData.length).fill({
      amount: "",
      entName: "",
    }),
  ];

  // Prepare data
  const data = [
    ["Amount", "જમા", "Amount", "ઉઘાર", "Amount", "ઉચક"], // Header Row
    ...creditEntries.map((credit, index) => [
      formatEntAmt(credit) || "",
      formatEntName(credit),
      formatEntAmt(debitEntries[index]) || "",
      formatEntName(debitEntries[index]) || "",
      formatEntAmt(thirdEntries[index]) || "",
      formatEntName(thirdEntries[index]) || "",
    ]),
    [
      creditTotal,
      "જમા Total",
      debitTotal,
      "ઉઘાર Total",
      thirdTotal,
      "ઉચક Total",
    ], // Total Row
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
  creditData,
  debitData,
  thirdData,
  creditTotal,
  debitTotal,
  thirdTotal,
  date,
  page,
}) => {
  return (
    <img
      src={xlsxIcon}
      height={25}
      onClick={() =>
        downloadExcel(
          creditData,
          debitData,
          thirdData,
          creditTotal,
          debitTotal,
          thirdTotal,
          date,
          page
        )
      }
    />
  );
};

export default ExportButton;
