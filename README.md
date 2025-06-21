const routes = [
  {
    path: "/",
    component: <Borrow />,
    iconRed: "borrowRedIcon",
    iconWhite: "borrowWhiteIcon",
  },
  {
    path: "/longtermborrow",
    component: <LongTermBorrow />,
    iconRed: "longborrowRedIcon",
    iconWhite: "longborrowWhiteIcon",
  },
  {
    path: "/master",
    component: <Master />,
    iconRed: "masterRedIcon",
    iconWhite: "masterWhiteIcon",
  },
  { path: "/main", component: <h1>Main Acc</h1>, iconRed: "mainAccRedIcon" ,iconWhite:"mainAccWhiteIcon"},
];


const routes = [
  { path: "/", component: <Borrow /> , icon:"borrow"},
  { path: "/longtermborrow", component: <LongTermBorrow />,icon:"longborrow" },
  { path: "/master", component: <Master /> ,icon:"master"},
  { path: "/main", component: <h1>Main Acc</h1> ,icon:"main"},
];
REACT_APP_BACKEND_API=http://localhost:5000/api
 <!-- <WriteDivField
                customClass={
                  Boolean(formik.errors.name) ? "writeInputError" : "writeInput"
                }
                handleInput={(e) =>
                  handleOnWriteInputChange("name", e.target.textContent)
                }
                handleBlur={formik.handleBlur}
              />
              {formik.touched.name || formik.errors.name ? (
                <Typography fontSize={13} color={"error"} mx={2} mt={0.5}>
                  {formik.errors.name}
                </Typography>
              ) : null} -->

const handelAddNew = (formik, wType, eType) => {
    console.log("formik.values -->", formik.values);

    // Define the mapping of types to dialog setters
    const openStateByType = {
      C: () => setOpenCustomerDialog([true, null, eType]),
      S: () => setOpenSupplierDialog([true, null, eType]),
      A: () => setOpenAngadiyaDialog([true, null, eType]),
      B: () => setOpenBankDialog([true, null, eType]),
      M: () => setOpenTeamDialog([true, null, eType]),
      MR: () => setOpenTeamDialog([true, null, eType]),
    };

    // Extract the type from the inputText
    const type = extractWord(formik.values.inputText);
    // console.log(openStateByType[type]);
    // Open the dialog based on the extracted type
    if (openStateByType[type]) {
      openStateByType[type]();
    } else {
      openStateByType[wType]();
    }
    setIsAddNew(true);
  };


    const handelBankChange = (e, formik) => {
    const { value } = e.target;
    formik.setValues({
      ...formik.values,
      entryId: value,
      etype: "B",
    });
    setIsAmtBoxOpen((oldData) => ({
      ...oldData,
      [formik.values.type]: true,
    }));
    setBankId((oldData) => ({
      ...oldData,
      [formik.values.type]: value,
    }));
  };

  const handelAngadiaChange = (e, formik) => {
    const { value } = e.target;
    formik.setValues({
      ...formik.values,
      entryId: value,
      etype: "A",
    });
    setIsAmtBoxOpen((oldData) => ({
      ...oldData,
      [formik.values.type]: true,
    }));
    setAngadiaId((oldData) => ({
      ...oldData,
      [formik.values.type]: value,
    }));
  };

         const angdiaBankHtml = (type, formik) => {
    return (
      <div className={MainStyle.bankSelectBox}>
        <div className="w-100">
          {type === "C" && (
            <>
              <FormControl fullWidth size="small">
                <InputLabel id="demo-simple-select-label">
                  Select Bank
                </InputLabel>
                <CustomSelectField
                  label="Select Bank"
                  value={bankId[type]}
                  id="entryId"
                  name="entryId"
                  onChange={(e) => handelBankChange(e, formik)}
                  disabled={entLoading}
                  onBlur={formik.handleBlur}
                  menuArr={
                    banks && banks.length > 0
                      ? banks.map((item) => ({
                          value: item._id,
                          label: `${item.name} ${item.amount}`,
                        }))
                      : []
                  }
                  error={
                    formik.touched.entryId && Boolean(formik.errors.entryId)
                  }
                />
              </FormControl>
              <div className="mt-05">
                <FormControl fullWidth size="small">
                  <InputLabel id="demo-simple-select-label">
                    Select Angadia
                  </InputLabel>
                  <CustomSelectField
                    label="Select Angadia"
                    value={angadiaId[type]}
                    id="entryId"
                    name="entryId"
                    onChange={(e) => handelAngadiaChange(e, formik)}
                    disabled={entLoading}
                    onBlur={formik.handleBlur}
                    menuArr={
                      angadia && angadia.length > 0
                        ? angadia.map((item) => ({
                            value: item._id,
                            label: `${item.name} ${item.amount}`,
                          }))
                        : []
                    }
                    error={
                      formik.touched.entryId && Boolean(formik.errors.entryId)
                    }
                  />
                </FormControl>
              </div>
            </>
          )}
          <div className={type === "C" && "mt-05"}>
            <FormControl fullWidth size="small">
              <InputLabel id="demo-simple-select-label">
                Select Member
              </InputLabel>
              <CustomSelectField
                label="Select Member"
                value={memberId[type]}
                id="entryId"
                name="entryId"
                onChange={(e) => handelMemberChange(e, formik)}
                disabled={teamLoading}
                onBlur={formik.handleBlur}
                menuArr={
                  team && team.length > 0
                    ? team.map((item) => ({
                        value: item._id,
                        label: item.name,
                      }))
                    : []
                }
                error={formik.touched.entryId && Boolean(formik.errors.entryId)}
              />
            </FormControl>
          </div>
        </div>
      </div>
    );
  };