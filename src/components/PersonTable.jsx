import React, { useState, useEffect } from "react";
import { IoIosArrowRoundDown, IoIosArrowRoundUp } from "react-icons/io";
import { CiMenuKebab } from "react-icons/ci";
import PersonData from "./PersonData";
import { CgPushChevronLeft, CgPushChevronRight } from "react-icons/cg";

const PersonTable = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5); // Default rows per page
  const [totalPages, setTotalPages] = useState(0); // Total pages for pagination

  // Fetch data from the API when the component mounts or when searchTerm/page changes
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.razzakfashion.com/?paginate=${rowsPerPage}&search=${searchTerm}`);
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const result = await response.json();
        console.log("Fetched Data:", result); // Log fetched data for debugging
        setData(result.data); // Set data to the fetched data array
        setTotalPages(result.last_page); // Set total pages for pagination
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [currentPage, rowsPerPage, searchTerm]); // Fetch data when these dependencies change

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedData = React.useMemo(() => {
    let sortableItems = [...data];
    if (sortConfig.key) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [data, sortConfig]);

  return (
    <div className="bg-gray-900 text-white p-5">
      <div className="mb-4">
        <input
          type="text"
          className="px-2 py-2 rounded-sm bg-gray-600 outline-none text-white w-full"
          placeholder="Search here"
          value={searchTerm}
          onChange={handleSearchChange}
        />
      </div>

      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-gray-900">
            <th className="p-2"><input type="checkbox" /></th>
            {['name', 'email', 'email Verified at', 'Created at', 'Updated at'].map((header) => (
              <th key={header} className="p-2">
                <div className="flex items-center">
                  <span>{header.charAt(0).toUpperCase() + header.slice(1)}</span>
                  <div className="flex ml-2 cursor-pointer" onClick={() => handleSort(header)}>
                    {sortConfig.key === header && sortConfig.direction === 'asc' ? (
                      <IoIosArrowRoundUp />
                    ) : (
                      <IoIosArrowRoundDown />
                    )}
                  </div>
                  <CiMenuKebab />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Render filtered and sorted person data */}
          {data.length > 0 ? (
            sortedData.map((person) => (
              <PersonData key={person.id} person={person} />
            ))
          ) : (
            <tr><td colSpan={6} className="text-center">No results found.</td></tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="mt-5 flex justify-end items-center gap-3">
        <span>Rows per page:</span>
        <input 
          type="number" 
          min="1" 
          value={rowsPerPage} 
          onChange={(e) => {
            setRowsPerPage(Number(e.target.value));
            setCurrentPage(1); // Reset to first page on change
          }} 
          className="ml-2 text-white outline-none px-1 w-16 rounded-sm bg-gray-700" 
        />
        
        {/* Pagination Controls */}
        <CgPushChevronLeft 
          onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)} 
          className={`cursor-pointer ${currentPage === 1 ? "text-gray-500" : ""}`} 
        />
        
        <span>{`${currentPage} of ${totalPages}`}</span>
        
        <CgPushChevronRight 
          onClick={() => currentPage < totalPages && setCurrentPage(currentPage + 1)} 
          className={`cursor-pointer ${currentPage === totalPages ? "text-gray-500" : ""}`} 
        />
      </div>
    </div>
  );
};

export default PersonTable;
