import React, { useState } from "react";
import {
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import moment from "moment";
import CustStyle from "./Customer/customer.module.scss"; // Adjust to your actual CSS import
import { Delete } from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { deleteTempLongtermLedger } from "../../apis/tempLongtermLedger";
import { updateTempBorrow } from "../../apis/mainSlice";
import { updatelongtermBorrow } from "../../apis/longtermBorrowSlice";
import { toast } from "react-toastify";
import {
  DeleteSweetAlert,
  textConvertGujaratiToEnglish,
} from "../../common/common";
import pdfIcon from "../../Image/pdf.png";

// ✅ Correct jsPDF + autoTable setup
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import CommanDateRangePicker from "../../components/CommanDateRangePicker";

const Histories = ({
  histories,
  page,
  isDelete = false,
  setOldValues,
  data,
  dateRange,
  setDateRange,
  handleSubmit,
}) => {
  const dispatch = useDispatch();

  const [expanded, setExpanded] = useState(false);
  // Find the split index

  const addBalanceToHistory = (historydata) => {
    return historydata.reduce((acc, item, index) => {
      let balance;

      if (item.isOpen) {
        balance = item.amount;
      } else {
        const prevBalance = acc.length > 0 ? acc[acc.length - 1].balance : 0;

        if (page === "customer") {
          balance =
            item.accType === "C"
              ? prevBalance - item.amount // Subtract for 'C' in customer
              : prevBalance + item.amount; // Subtract for 'D' as usual
        } else if (page === "supplier") {
          balance =
            item.accType === "C"
              ? prevBalance + item.amount // Add for 'C' in supplier
              : prevBalance - item.amount; // Subtract for 'D' as usual
        } else if (page === "angaliya") {
          balance =
            item.accType === "C"
              ? prevBalance + item.amount // Add for 'C' in supplier
              : prevBalance - item.amount; // Subtract for 'D' as usual
        } else if (page === "bank") {
          balance =
            item.accType === "C"
              ? prevBalance + item.amount // Add for 'C' in supplier
              : prevBalance - item.amount; // Subtract for 'D' as usual
        } else if (page === "tempLongtermBorrow") {
          balance =
            item.accType === "C"
              ? prevBalance - item.amount // Add for 'C' in supplier
              : prevBalance + item.amount; // Subtract for 'D' as usual
        } else {
          balance = prevBalance; // Default case if no valid page is given
        }
      }

      acc.push({ ...item, balance });
      return acc;
    }, []);
  };

  const updatedHistory = addBalanceToHistory(histories);

  const splitIndex = updatedHistory.findIndex(
    (item) => item.etype === "P" || item.etype === "R"
  );

  const handleDelete = async (id) => {
    DeleteSweetAlert({
      title: "Are you sure?",
      icon1: "warning",
      title2: "",
      text: "Entry has been deleted.",
      icon2: "success",
      callApi: async () => {
        const response = await dispatch(deleteTempLongtermLedger({ id }));
        if (!response.payload?.error) {
          const { updatedParent } = response.payload.data;
          setOldValues((prev) => ({ ...prev, amount: updatedParent.amount }));
          if (data?.type === "T") {
            dispatch(updateTempBorrow(updatedParent));
          }
          if (data?.type === "L") {
            dispatch(updatelongtermBorrow(updatedParent));
          }
          toast.success(response.payload?.message);
        }
      },
    });
  };

  // Separate items into two groups
  const accordionItems =
    splitIndex >= 0 ? updatedHistory.slice(0, splitIndex + 1) : [];
  const remainingItems =
    splitIndex >= 0 ? updatedHistory.slice(splitIndex + 1) : updatedHistory;

  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    const tableColumn = [
      "Date",
      "Description",
      "Credit Rs",
      "Debit Rs",
      "Balance Rs",
    ];

    const date =
      dateRange?.startDate && dateRange?.endDate
        ? `${moment(dateRange?.startDate).format("DD-MM-YYYY")} To ${moment(
            dateRange?.endDate
          ).format("DD-MM-YYYY")}`
        : `${moment().format("DD-MM-YYYY")}`;

    // Helper to convert keys if value is in Gujarati
    const convertIfGujarati = (val) =>
      val ? textConvertGujaratiToEnglish(val) : "";

    const getDescription = (item) =>
      [
        item.isOpen && "Opening Balance",
        item.isSalesReturn && "માલ પરત",
        convertIfGujarati(item.baName).toUpperCase(),
        convertIfGujarati(item.note).toUpperCase(),
        item.byWhom ? `(${convertIfGujarati(item.byWhom)})` : null,
      ]
        .filter(Boolean)
        .join(" ");

    const makeRows = (items) =>
      items.map((item) => [
        moment(item?.date).format("DD-MM-YYYY"),
        getDescription(item) || "-",
        item.accType === "C" ? item.amount.toLocaleString() : "0.00",
        item.accType === "D" ? item.amount.toLocaleString() : "0.00",
        item.balance.toLocaleString(),
      ]);

    let finalRows = [];
    if (accordionItems.length > 0)
      finalRows = finalRows.concat(makeRows(accordionItems));
    if (remainingItems.length > 0)
      finalRows = finalRows.concat(makeRows(remainingItems));
    // ✅ Add top title: name and current date
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(
      `${convertIfGujarati(data?.name).toUpperCase() || "Unknown Name"}`,
      14,
      15
    );
    doc.setFontSize(11);
    doc.text(`Date: ${date}`, 138, 15);
    autoTable(doc, {
      head: [tableColumn],
      body: finalRows,
      styles: {
        font: "helvetica",
        textColor: "#000",
        fontSize: 10,
        lineColor: [0, 0, 0], // black border
        lineWidth: 0.3,
      },
      headStyles: { fillColor: false, textColor: "#000" },
      margin: { top: 20 },
      columnStyles: {
        0: { halign: "left" },
        1: { halign: "left" },
        2: { halign: "left" },
        3: { halign: "left" },
        4: { halign: "left" },
      },
      didDrawCell: (data) => {
        // Ensures all cells have borders, even in merged cells
        const { cell } = data;
        const { x, y, width, height } = cell;
        doc.setDrawColor(0);
        doc.rect(x, y, width, height);
      },
    });

    // ✅ Get last Y position after table
    const finalY = doc.lastAutoTable.finalY || 20;

    // ✅ Calculate final balance (from last entry)
    const finalAmount =
      updatedHistory.length > 0
        ? updatedHistory[updatedHistory.length - 1].balance
        : 0;

    // ✅ Show final amount at bottom
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text(`Final Amount: ${finalAmount.toLocaleString()}`, 14, finalY + 10);

    doc.save(
      `${convertIfGujarati(data?.name).toUpperCase() || "Unknown Name"}.pdf`
    );
  };
  const handleRangeSelect = ({ startDate, endDate }) => {
    setDateRange({ startDate, endDate });
  };
  return (
    <div>
      {histories && histories.length > 1 && (
        <div
          className="flexBetween"
          style={{ marginBottom: "1rem", padding: "0 1rem" }}
        >
          <div className="flexStretch gap-1">
            {page !== "tempLongtermBorrow" && (
              <>
                <CommanDateRangePicker
                  fromDate={dateRange?.startDate}
                  toDate={dateRange?.endDate}
                  onChange={({ startDate, endDate }) =>
                    handleRangeSelect({ startDate, endDate })
                  }
                />
                {dateRange?.endDate && dateRange?.startDate && (
                  <Button variant="contained" onClick={handleSubmit}>
                    Submit
                  </Button>
                )}
              </>
            )}
          </div>

          <div
            className="flex gap-05"
            style={{
              border: "1px solid #9b5f5f",
              borderRadius: ".5rem",
              padding: ".2rem",
              backgroundColor: "#ff000014",
            }}
            onClick={handleDownloadPDF}
          >
            <img src={pdfIcon} height={25} />
            <div>Download</div>
          </div>
        </div>
      )}
      {/* Accordion table */}
      {accordionItems.length > 0 && (
        <table className={CustStyle.historyTable}>
          <thead>
            <tr>
              <th colSpan={isDelete ? 6 : 5} style={{ border: "none" }}>
                <Accordion
                  expanded={expanded}
                  onChange={() => setExpanded(!expanded)}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight={600} fontSize={17}>
                      નેટ-ચુકતે લેઝર
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails className={CustStyle.accordionContent}>
                    <table>
                      <thead>
                        <tr>
                          <th>Date</th>
                          <th>Description</th>
                          <th style={{ textAlign: "end" }}>Credit Rs</th>
                          <th style={{ textAlign: "end" }}>Debit Rs</th>
                          <th style={{ textAlign: "end" }}>Balance Rs</th>
                        </tr>
                      </thead>
                      <tbody>
                        {accordionItems.map((item, index) => (
                          <tr key={index}>
                            <td>{moment(item?.date).format("DD-MM-YYYY")}</td>
                            <td>
                              {item.isOpen && <>Opening Balance&nbsp;</>}
                              {item.isSalesReturn && <>માલ પરત&nbsp;</>}
                              {item.baName && <>{item.baName}&nbsp;</>}
                              {item.note && <>{item.note}&nbsp;</>}
                              {item?.byWhom
                                ? `(${item?.byWhom})`
                                : !item.isOpen && !item.isSalesReturn && "-"}
                            </td>
                            <td className={CustStyle.amountCell}>
                              {item?.accType === "C"
                                ? item?.amount?.toLocaleString()
                                : "0.00"}
                            </td>
                            <td className={CustStyle.amountCell}>
                              {item.accType === "D"
                                ? item?.amount?.toLocaleString()
                                : "0.00"}
                            </td>
                            <td className={CustStyle.amountCell}>
                              {item?.balance?.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </AccordionDetails>
                </Accordion>
              </th>
            </tr>
          </thead>
        </table>
      )}

      {/* Remaining items table */}

      {remainingItems.length > 0 && (
        <table className={CustStyle.historyTable}>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th style={{ textAlign: "end" }}>Credit Rs</th>
              <th style={{ textAlign: "end" }}>Debit Rs</th>
              <th style={{ textAlign: "end" }}>Balance Rs</th>
              {isDelete && <th></th>}
            </tr>
          </thead>
          <tbody>
            {remainingItems.length > 0 ? (
              remainingItems.map((item, index) => (
                <tr key={index}>
                  <td>{moment(item?.date).format("DD-MM-YYYY")}</td>
                  <td>
                    {item.isOpen && <>Opening Balance&nbsp;</>}
                    {item.isSalesReturn && <>માલ પરત&nbsp;</>}
                    {item.baName && <>{item.baName}&nbsp;</>}
                    {item.note && <>{item.note}&nbsp;</>}
                    {item?.byWhom
                      ? `(${item?.byWhom})`
                      : !item.isOpen && !item.isSalesReturn && "-"}
                  </td>
                  <td className={CustStyle.amountCell}>
                    {item.accType === "C"
                      ? item.amount.toLocaleString()
                      : "0.00"}
                  </td>
                  <td className={CustStyle.amountCell}>
                    {item.accType === "D"
                      ? item.amount.toLocaleString()
                      : "0.00"}
                  </td>
                  <td className={CustStyle.amountCell}>
                    {item.balance.toLocaleString()}
                  </td>
                  {isDelete && (
                    <td className={CustStyle.deleteCell}>
                      <div
                        className="flexCenter"
                        onClick={() =>
                          !item?.isOpen ? handleDelete(item?._id) : () => {}
                        }
                      >
                        <Delete
                          style={{ color: item?.isOpen ? "lightGray" : "red" }}
                        />
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={isDelete ? 6 : 5}
                  style={{ textAlign: "center", padding: "1rem" }}
                >
                  <Typography fontWeight={600} fontSize={17}>
                    No Histories Found
                  </Typography>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Histories;
