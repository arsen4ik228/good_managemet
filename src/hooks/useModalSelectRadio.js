import { useState, useEffect } from "react";

export  function useModalSelectRadio({ array, arrayItem }) {
  const [selectedID, setSelectedID] = useState("null");
  const [selectedName, setSelectedName] = useState(null);

  const [filterArraySearchModal, setFilterArraySearchModal] = useState([]);
  const [inputSearchModal, setInputSearchModal] = useState("");

  const handleRadioChange = (id, element) => {
    setSelectedID((prevState) => {
      const newState = prevState === id ? null : id;
      setSelectedName(newState === null ? null : element[arrayItem]);
      return newState;
    });
  };

  const handleInputChangeModalSearch = (e) => {
    setInputSearchModal(e.target.value);
  };

  useEffect(() => {
    if (inputSearchModal !== "") {
      const filtered = array?.filter((item) =>
        item[arrayItem].toLowerCase().includes(inputSearchModal.toLowerCase())
      );

      setFilterArraySearchModal(filtered);
    } else {
      setFilterArraySearchModal([]);
    }
  }, [inputSearchModal]);

  return {
    handleRadioChange,
    handleInputChangeModalSearch,

    filterArraySearchModal,
    inputSearchModal,

    selectedID,
    setSelectedID,

    selectedName,
    setSelectedName,
  };
}
