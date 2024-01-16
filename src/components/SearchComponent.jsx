import React, { useState, useRef } from "react";
import '../styles/SearchComponent.css';
import dummyData from '../data/dummyData'

const SearchComponent = () => {
  const [searchInput, setSearchInput] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [highlightedTagIndex, setHighlightedTagIndex] = useState(null);
  const inputRef = useRef(null);

  const handleInputChange = (event) => {
    const inputValue = event.target.value;
    setSearchInput(inputValue);

    setShowSuggestions(!!inputValue);
  };

  const handleItemClick = (id) => {
    const clickedItem = dummyData.find((item) => item.id === id);
    if (clickedItem) {
      setSelectedTags((prevTags) => [...prevTags, clickedItem]);
      setSearchInput("");
      setHighlightedTagIndex(null);
      inputRef.current.focus();
      setShowSuggestions(false); 
    }
  };

  const handleRemoveTag = (id) => {
    setSelectedTags((prevTags) => prevTags.filter((tag) => tag.id !== id));
    setHighlightedTagIndex(null);
  };

  
  const filteredSuggestions = dummyData.filter(
    (item) =>
      !selectedTags.some((tag) => tag.id === item.id) &&
      (item.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        item.email.toLowerCase().includes(searchInput.toLowerCase()))
  );

  const handleBackspace = () => {
   
    if (
      searchInput === "" &&
      selectedTags.length > 0 &&
      highlightedTagIndex === null
    ) {
      setHighlightedTagIndex(selectedTags.length - 1);
    } else if (highlightedTagIndex !== null) {
      handleRemoveTag(highlightedTagIndex);
    }
  };

  return (
    <div className="search-container">
      <div className="tags-input" ref={inputRef}>
        {selectedTags.map((tag, index) => (
          <div
            key={tag.id}
            className={`tag ${
              highlightedTagIndex === index ? "highlighted" : ""
            }`}
            onClick={() => setHighlightedTagIndex(index)}
          >
            <img src={tag.picture} alt={tag.name} />
            <span>{tag.name}</span>
            <button onClick={() => handleRemoveTag(tag.id)}>X</button>
          </div>
        ))}
        <div className="input-container">
          <input
            type="text"
            value={searchInput}
            onChange={handleInputChange}
            placeholder="Add new users"
            onKeyDown={(event) => {
              if (event.key === "Backspace") {
                handleBackspace();
              }
            }}
            onClick={() => setShowSuggestions(true)} 
          />
        </div>
      </div>
      {showSuggestions && (
        <ul className="suggestion-list">
          {filteredSuggestions.map((item) => (
            <li key={item.id} onClick={() => handleItemClick(item.id)}>
              <img src={item.picture} alt={item.name} />
              <div className="suggestion-details">
                <span className="suggestion-name">{item.name}</span>
                <span className="suggestion-email">{item.email}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchComponent;
