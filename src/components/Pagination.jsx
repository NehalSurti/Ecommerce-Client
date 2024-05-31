import React, { useEffect, useState } from "react";
import styled from "styled-components";

const Pagination = ({
  totalItems,
  itemsPerPage,
  onPageChange,
  filters,
  sort,
  cntPg,
  cat
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    onPageChange(page);
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <Li
          key={i}
          className={currentPage === i ? "active" : ""}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </Li>
      );
    }
    return pageNumbers;
  };

  useEffect(() => {
    setCurrentPage(1);
    onPageChange(1);
  }, [filters, sort, cat]);

  useEffect(() => {
    setCurrentPage(cntPg);
  }, [cntPg]);

  return (
    <Container>
      <Wrapper>
        {totalItems !== 0 ? (
          <Ul>
            <Li
              onClick={() => handlePageChange(currentPage - 1)}
              className={currentPage === 1 && "inactive"}
            >
              &laquo;
            </Li>
            {renderPageNumbers()}
            <Li
              onClick={() => handlePageChange(currentPage + 1)}
              className={currentPage === totalPages && "inactive"}
            >
              &raquo;
            </Li>
          </Ul>
        ) : (
          ""
        )}
      </Wrapper>
    </Container>
  );
};

export default Pagination;

const Container = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: transparent;
`;

const Wrapper = styled.div`
  width: 50%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Ul = styled.ul`
  display: flex;
  list-style: none;
`;

const Li = styled.li`
  width: 40px;
  height: 40px;
  background-color: #d3d3d3b0;
  border: none;
  border-radius: 50% 50%;
  margin-right: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  user-select: none;

  &.active {
    border: 1px solid black;
    background-color: lightgray;
  }

  &.inactive {
    pointer-events: none;
    background-color: #f5f0f0af;
  }
`;
