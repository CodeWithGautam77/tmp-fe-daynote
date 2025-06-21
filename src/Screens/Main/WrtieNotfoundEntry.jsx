import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import * as yup from "yup";
import WrtieNFStyle from "./WrtieNotfoundEntry.module.scss";
import { toast } from "react-toastify";
import {
  Button,
  CircularProgress,
  IconButton,
  Typography,
} from "@mui/material";
import _ from "lodash";
import { extractWord, getEType, removeSuffix } from "../../common/common";
import WriteDivField from "../../components/WriteDivField";
import {
  getMatchingCreditEntitys,
  getMatchingDebitEntitys,
  setCreditEntitys,
  setDebitEntitys,
} from "../../apis/entitySlice";
import { updateMainEntry } from "../../apis/mainSlice";
import { ClearSharp } from "@mui/icons-material";

export default function WrtieNotfoundEntry({ forceData, setForceData }) {
  const dispatch = useDispatch();

  const { loggedIn } = useSelector((state) => state.authData);
  const { creditEntitys, debitEntitys, entLoading } = useSelector(
    (state) => state.entData
  );

  const [openAutoSubmit, setOpenAutoSubmit] = useState(false);
  const [isFindEntryWriting, setIsFindEntryWriting] = useState(false);

  useEffect(() => {
    if (forceData) {
      setIsFindEntryWriting(true);
      if (forceData.type === "C") {
        creditDebouncedSearch(forceData.entName);
      }
      if (forceData.type === "D") {
        debitDebouncedSearch(forceData.entName);
      }
    }
  }, [forceData]);

  const ValidationSchema = yup.object({
    entryId: yup.string().required("Please select"),
  });

  const formikFindEntry = useFormik({
    initialValues: {
      entryId: "",
      inputText: "",
      etype: forceData?.type === "C" ? "C" : forceData?.type === "D" ? "S" : "",
    },
    validationSchema: ValidationSchema,
    onSubmit: async (values, { resetForm }) => {
      setIsFindEntryWriting(false);
      const type = getEType(values.inputText);
      console.log("formikFindEntry Values-->", {
        ...values,
        _id: forceData?._id,
        uId: loggedIn._id,
        type: forceData?.type,
        etype: values.etype ? values.etype : type ? type : "",
      });

      const response = await dispatch(
        updateMainEntry({
          ...values,
          _id: forceData?._id,
          uId: loggedIn._id,
          type: forceData?.type,
          etype: values.etype ? values.etype : type ? type : "",
        })
      );

      if (!response.payload.error) {
        toast.success(response.payload.message);
        setForceData(null);
        dispatch(setCreditEntitys([]));
        dispatch(setDebitEntitys([]));
        resetForm();
      } else {
        toast.error(response.payload.message);
        setForceData(null);
        setOpenAutoSubmit(false);
        dispatch(setCreditEntitys([]));
        dispatch(setDebitEntitys([]));
        resetForm();
        setIsFindEntryWriting(false);
      }
    },
  });

  const handleCreditInput = (event) => {
    const value = event.target.textContent;
    formikFindEntry.setFieldValue("inputText", value);
    if (forceData.type === "C") {
      creditDebouncedSearch(value);
    }
    if (forceData.type === "D") {
      debitDebouncedSearch(value);
    }
  };

  const creditDebouncedSearch = useCallback(
    _.debounce(async (searchName) => {
      const searchText = removeSuffix(searchName);
      const stringWithoutSpaces = searchText?.replace(/\s+/g, "");
      const type = extractWord(stringWithoutSpaces);
      if (searchText) {
        const response = await dispatch(
          getMatchingCreditEntitys({
            uId: loggedIn?._id,
            type: type === null ? "C" : type,
            entName: searchText,
          })
        );
        if (response.payload?.error) {
          toast.error(response.payload.message);
        }
      }
    }, 2000),
    [loggedIn]
  );

  const debitDebouncedSearch = useCallback(
    _.debounce(async (searchName) => {
      const searchText = removeSuffix(searchName);
      const stringWithoutSpaces = searchText?.replace(/\s+/g, "");
      const type = extractWord(stringWithoutSpaces);
      if (searchText) {
        const response = await dispatch(
          getMatchingDebitEntitys({
            uId: loggedIn?._id,
            type: type === null ? "S" : type,
            entName: searchText,
          })
        );
        if (response.payload?.error) {
          toast.error(response.payload.message);
        }
      }
    }, 2000),
    [loggedIn]
  );

  // useEffect(() => {
  //   if (creditEntitys && creditEntitys.length > 0) {
  //     formikFindEntry.setFieldValue("entryId", creditEntitys[0]._id);
  //   }
  // }, [creditEntitys]);

  // useEffect(() => {
  //   if (debitEntitys && debitEntitys.length > 0) {
  //     formikFindEntry.setFieldValue("entryId", debitEntitys[0]._id);
  //   }
  // }, [debitEntitys]);

  useEffect(() => {
    if (formikFindEntry.isValid && formikFindEntry.dirty) {
      const outerTimeout = setTimeout(() => {
        // console.log('start', new Date());
        setOpenAutoSubmit(true);
        const innerTimeout = setTimeout(() => {
          formikFindEntry.submitForm();
          // console.log('end', new Date());
          setOpenAutoSubmit(false);
        }, 2000); // 5 seconds

        return () => clearTimeout(innerTimeout);
      }, 3000); // 5 seconds

      return () => clearTimeout(outerTimeout);
    }
  }, [formikFindEntry.values, formikFindEntry.isValid]);

  const handelCancel = () => {
    setIsFindEntryWriting(false);
    setOpenAutoSubmit(false);
    formikFindEntry.resetForm();
    setForceData(null);
  };

  const typeText = {
    C: "જમા",
    D: "ઉઘાર",
  };

  const selectEnttityArray =
    forceData.type === "C"
      ? creditEntitys
      : forceData.type === "D"
      ? debitEntitys
      : [];

  return (
    <div className={WrtieNFStyle.mainNFWriteBox}>
      <div className={WrtieNFStyle.mainBox}>
        {/* --------------------------------------------- Credit Box ---------------------------------------- */}
        {openAutoSubmit ? (
          <div className={WrtieNFStyle.creditBox}>
            <label className={`${WrtieNFStyle.inputLabel} gradient-text`}>
              {typeText[forceData?.type]} :
            </label>
            <div className={WrtieNFStyle.autoSumitBox}>
              <CircularProgress size={50} />
              <h3>Submitting Please Wait ..</h3>
              <Button
                variant="contained"
                color="error"
                size="small"
                onClick={handelCancel}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div style={{ width: "100%", position: "relative" }}>
            <div
              className={
                isFindEntryWriting
                  ? WrtieNFStyle.isCreditWriteBox
                  : WrtieNFStyle.writeBox
              }
            >
              {isFindEntryWriting && (
                <div className="flex gap-05">
                  <IconButton
                    size="small"
                    className={WrtieNFStyle.closeBtn}
                    onClick={() => {
                      setIsFindEntryWriting(false);
                      setForceData(null);
                      dispatch(setCreditEntitys([]));
                      dispatch(setCreditEntitys([]));
                    }}
                  >
                    <ClearSharp
                      fontSize="small"
                      sx={{ color: "#fff", fontSize: "10px" }}
                    />
                  </IconButton>
                  <Typography
                    fontSize={13}
                    fontWeight={600}
                    className="gradient-text"
                  >
                    {forceData?.entName} - {forceData?.amount}
                  </Typography>
                </div>
              )}
              <div
                style={{
                  width: "100%",
                }}
                className={`flex ${
                  isFindEntryWriting ? WrtieNFStyle.subWriteBox : ""
                }`}
                onClick={() => setIsFindEntryWriting(true)}
              >
                {/* <div className={WrtieNFStyle.amtBox}>
                  <WriteDivField
                    customClass={WrtieNFStyle.writeInput}
                    handleInput={(e) => {
                      handelAmtInput(e, formikFindEntry);
                    }}
                    placeholder={"રકમ"}
                  />
                </div> */}
                <div className={WrtieNFStyle.nameBox}>
                  <WriteDivField
                    customClass={WrtieNFStyle.writeInput}
                    handleInput={handleCreditInput}
                    placeholder={"નામ"}
                  />
                </div>
              </div>
            </div>

            {isFindEntryWriting && (
              <div className={WrtieNFStyle.creditSelectBox}>
                {entLoading ? (
                  <div
                    style={{ width: "100%", height: "12rem" }}
                    className="flexCenter"
                  >
                    <CircularProgress size={50} />
                  </div>
                ) : (
                  <>
                    {selectEnttityArray.length > 0 ? (
                      <>
                        {selectEnttityArray.map((item, index) => (
                          <option
                            key={index}
                            value={item._id}
                            className={
                              item._id === formikFindEntry.values.entryId
                                ? WrtieNFStyle.creditSelectedEntOption
                                : WrtieNFStyle.creditEntOption
                            }
                            onClick={() => {
                              formikFindEntry.setFieldValue(
                                "entryId",
                                item._id
                              );
                            }}
                            ref={(el) => {
                              if (
                                el &&
                                index === selectEnttityArray.length - 1
                              ) {
                                el.scrollIntoView({
                                  behavior: "smooth",
                                  block: "end",
                                });
                              }
                            }}
                          >
                            {item.searchName}
                          </option>
                        ))}
                      </>
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "12rem",
                          fontWeight: "700",
                        }}
                        className="flexCenter"
                      >
                        No Data Found
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
