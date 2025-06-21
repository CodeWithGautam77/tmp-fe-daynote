import "./WriteDivField.css"; // Create this CSS file to add the scaling styles
import IconButton from "@mui/material/IconButton";
import { useRef, useState } from "react";
// import FormatClearIcon from "@mui/icons-material/FormatClear";
import BackspaceOutlinedIcon from '@mui/icons-material/BackspaceOutlined';
const WriteDivField = ({
  style,
  customClass,
  handleInput,
  handleBlur,
  placeholder,
  placeholderRight,
  disabled,
  onFocus,
}) => {
  const divRef = useRef(null); // Ref for the editable div
  const [clickTimeout, setClickTimeout] = useState(null); 

  const handleClearContent = (e) => {
    e.stopPropagation(); // Prevent the event from affecting the editable div
    if (divRef.current) {
      divRef.current.innerHTML = ""; // Clear the content
      handleInput({ target: divRef.current }); // Trigger handleInput to update any state or parent component
    }
  };

  // Function to handle special character removal
  const sanitizeContent = (content) => {
    // Allow only letters, numbers, and basic spaces
    return content.replace(/[^\u0A80-\u0AFF0-9\s]/g, "");
  };

  const handleInputChange = (e) => {
    if (divRef.current) {
      // Sanitize the content of the div
      const sanitizedText = sanitizeContent(divRef.current.innerText);
      // Update the div's content if it was changed
      if (sanitizedText !== divRef.current.innerText) {
        divRef.current.innerText = sanitizedText;
      }
      // Call the provided handleInput function with the sanitized content
      handleInput({ target: divRef.current });
    }
  };

  // const handleClearContent = (e, isDoubleClick = false) => {
  //   e.stopPropagation(); // Prevent the event from affecting the editable div
  //   if (divRef.current) {
  //     if (isDoubleClick) {
  //       // Clear all content on double-click
  //       divRef.current.innerHTML = "";
  //     } else {
  //       // Remove last letter on single-click
  //       const currentText = divRef.current.innerHTML;
  //       divRef.current.innerHTML = currentText.slice(0, -1);
  //     }
  //     handleInput({ target: divRef.current }); // Trigger handleInput to update any state or parent component
  //   }
  // };

  const handleButtonClick = (e) => {
    if (clickTimeout) {
      clearTimeout(clickTimeout); // Cancel the timeout if a double click is detected
      setClickTimeout(null);
      handleClearContent(e, true); // Handle as double click
    } else {
      // Set a timeout for single click
      const timeout = setTimeout(() => {
        handleClearContent(e, false); // Handle as single click
        setClickTimeout(null);
      }, 300); // 300ms delay for detecting double-click
      setClickTimeout(timeout);
    }
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const range = document.createRange();
    const sel = window.getSelection();
    const lastChild = e.target.lastChild;
    if (lastChild) {
      range.setStartAfter(lastChild);
      range.collapse(true);
    } else {
      range.setStart(e.target, 0);
      range.collapse(true);
    }
    sel.removeAllRanges();
    sel.addRange(range);
  };

  const handleTouchEnd = (e) => {
    e.target.focus();
  };

  return (
    <div
      style={{
        backgroundColor: "white",
        ...style,
        display: "flex",
        alignItems: "flex-start",
      }}
    >
      <div
        // className={customClass}
        ref={divRef}
        style={style}
        className={`${customClass} ${disabled ? "disabled" : ""}`}
        contentEditable="true"
        onInput={handleInput}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onBlur={handleBlur}
        onFocus={onFocus}
        data-placeholder={placeholder} // Set dynamic placeholder text
        data-placeholder-right={placeholderRight} // Set right-side placeholder
        suppressContentEditableWarning={true}
      ></div>
      <IconButton
        className="clear-button"
        onClick={handleClearContent}
        aria-label="clear content"
        size="small"
        sx={{ padding: 0, width: "5%",border:"inherit" }}
      >
        <BackspaceOutlinedIcon fontSize="small" />
      </IconButton>
    </div>
  );
};

export default WriteDivField;
