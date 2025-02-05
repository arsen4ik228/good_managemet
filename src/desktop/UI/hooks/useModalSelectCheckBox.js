import { useState, useEffect } from "react";

export  function useModalSelectCheckBox({ array, arrayItem, setArrayChecked }) {
  const [
    filterArraySearchModalCheckBox,
    setFilterArraySearchModalCheckBox,
  ] = useState([]);

  const [inputSearchModalCheckBox, setInputSearchModalCheckBox] =
    useState("");

  const handleCheckboxChange = (id) => {
    setArrayChecked((prev) => {
      if (prev.includes(id)) {
        return prev.filter((item) => item !== id);
      } else {
        return [...prev, id];
      }
    });
  };

  const handleInputChangeModalCheckBoxSearch = (e) => {
    setInputSearchModalCheckBox(e.target.value);
  };

  useEffect(() => {
    if (inputSearchModalCheckBox !== "") {
      const filtered = array?.filter((item) =>
        item[arrayItem].toLowerCase().includes(inputSearchModalCheckBox.toLowerCase())
      );

      setFilterArraySearchModalCheckBox(filtered);
    } else {
      setFilterArraySearchModalCheckBox([]);
    }
  }, [inputSearchModalCheckBox]);

  return {
    inputSearchModalCheckBox, 
    setInputSearchModalCheckBox,
    filterArraySearchModalCheckBox,
    handleCheckboxChange,
  };
}
