// CardList.jsx
import React, { useState, useEffect } from "react";
import Card from './Card';
import Button from './Button';
import Search from './Search';

const CardList = ({data}) => {
  // define the limit state variable and set it to 10
  const limit = 10;
  
  // Define state variables
  const [offset, setOffset] = useState(0);
  const [filteredData, setFilteredData] = useState(data);
  const [products, setProducts] = useState(data.slice(0, limit));
  
  // Handle pagination - refactored to use a single function
  const handlePagination = (direction) => {
    const newOffset = direction === 'next' ? offset + 10 : offset - 10;
    setOffset(newOffset);
  };
  
  // Filter products by tags
  const filterTags = (searchTerm) => {
    console.log("Filtering for:", searchTerm);
    
    if (!searchTerm || searchTerm.trim() === '') {
      // If search term is empty, reset to full data
      setFilteredData(data);
    } else {
      // Filter products that have the search term in their tags
      const filtered = data.filter(product => {
        // Check if product has tags_array, photo_tags or tags
        const tagsToCheck = product.photo_tags || product.tags || [];
        
        return tagsToCheck.some(tag => {
          // Make sure we're accessing the title property if it exists
          const tagValue = typeof tag === 'object' && tag.title ? tag.title : tag;
          
          // Check if tag value is a string before using toLowerCase
          if (typeof tagValue !== 'string') {
            return false;
          }
          
          return tagValue.toLowerCase().includes(searchTerm.toLowerCase());
        });
      });
      
      console.log("Filtered results:", filtered.length);
      setFilteredData(filtered);
    }
    
    // Reset pagination when filtering
    setOffset(0);
  };
  
  // Updating products when offset or filteredData changes
  useEffect(() => {
    setProducts(filteredData.slice(offset, offset + limit));
  }, [offset, filteredData, limit]);
  
  // Check if next/previous buttons should be disabled
  const isNextDisabled = offset + limit >= filteredData.length;
  const isPrevDisabled = offset === 0;
  
  return (
    <div className="cf pa2">
      {/* Search Component */}
      <div className="mb3">
        <Search handleSearch={filterTags} />
      </div>
      
      <div className="mt2 mb2">
        {products.length > 0 ? (
          products.map((product) => (
            <Card key={product.id} {...product} />
          ))
        ) : (
          <p>No products match your search criteria</p>
        )}
      </div>
      
      {/* Pagination Buttons */}
      <div className="flex items-center justify-center pa4">   
        <Button 
          text="Previous" 
          handleClick={() => handlePagination('prev')} 
          isDisabled={isPrevDisabled}
        />
        <Button 
          text="Next" 
          handleClick={() => handlePagination('next')} 
          isDisabled={isNextDisabled}
        />
      </div>
    </div>
  );
};

export default CardList;