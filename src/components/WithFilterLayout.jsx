import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Announcement from "./Announcement";
import Newsletter from "./Newsletter";
import Footer from "./Footer";
import { mobile } from "../utils/responsive";
import Pagination from "./Pagination";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchAllProductsAsync } from "../redux/features/product/productThunks";
import { useLocation } from "react-router-dom";

export default function WithFilterLayout({ children }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const cat = location.pathname.split("/")[2];

  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState("newest");
  const [currentPage, setCurrentPage] = useState(1);
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [totalProducts, setTotalProducts] = useState(null);
  const [backClickToHomePage, setBackClickToHomePage] = useState(false);

  const itemsPerPage = 16;

  /* --------------- Fetching distinct colors & sizes for a product category-------------- */
  useEffect(() => {
    async function getAllProducts() {
      try {
        // Fetching all Products
        const allProducts = await dispatch(fetchAllProductsAsync({ cat }));

        // If dispatch is successfull
        if (allProducts.payload) {
          const uniqueColorsSet = new Set();
          const uniqueSizesSet = new Set();
          const distinctColors = [];
          const distinctSizes = [];

          allProducts.payload.forEach((product) => {
            // Fetching distinct Colors
            product.color.forEach((color) => {
              if (!uniqueColorsSet.has(color.trim())) {
                distinctColors.push(color);
                uniqueColorsSet.add(color);
              }
            });

            // Fetching distinct Sizes
            product.size.forEach((size) => {
              if (!uniqueSizesSet.has(size.trim())) {
                distinctSizes.push(size);
                uniqueSizesSet.add(size);
              }
            });
          });

          // Setting distinct Color and Sizes
          setColors(distinctColors);
          setSizes(distinctSizes);
        } else {
          console.log("Error fetching Products");
        }
      } catch (error) {
        console.log("Error fetching Products");
      }
    }
    getAllProducts();
  }, [dispatch]);

  useEffect(() => {
    if (
      Object.keys(filters).length === 0 &&
      sort === "newest" &&
      currentPage === 1
    ) {
      setBackClickToHomePage(true);
    } else {
      setBackClickToHomePage(false);
    }
  }, [filters, sort, currentPage]);

  useEffect(() => {
    try {
      const queryParams = new URLSearchParams();

      if (filters && Object.keys(filters).length > 0) {
        queryParams.append("filters", JSON.stringify(filters));
      }
      queryParams.append("pageNumber", currentPage);
      queryParams.append("pageSize", itemsPerPage);
      queryParams.append("sort", sort);

      navigate(`/products/${cat}?${queryParams.toString()}`);
    } catch (error) {
      console.error("Error navigating Products:", error);
    }
  }, [cat, filters, sort, currentPage, itemsPerPage, navigate]);

  /* ------------ Fetching total no. of Products based on filters ------------ */
  useEffect(() => {
    const getProductsLength = async () => {
      try {
        // Fetching all Products based on filters
        const allFetchedProducts = await dispatch(
          fetchAllProductsAsync({
            cat,
            filters,
            sort,
          })
        );

        //If dispatch is successfull
        if (allFetchedProducts.payload) {
          setTotalProducts(allFetchedProducts.payload.length);
        } else {
          console.log("Error fetching total no. of Products ");
        }
      } catch (error) {
        console.log("Error fetching total no. of Products");
      }
    };
    getProductsLength();
  }, [sort, filters, dispatch]);

  useEffect(() => {
    const handlePopstate = () => {
      if (!backClickToHomePage) {
        // window.location.href = `/products/${cat}?pageNumber=1&pageSize=${itemsPerPage}&sort=newest`;
        window.location.href = `/products/${cat}`;
        window.scrollTo(0, 0);
      } else {
        navigate("/");
      }
    };
    window.addEventListener("popstate", handlePopstate);
    return () => {
      window.removeEventListener("popstate", handlePopstate);
    };
  }, [backClickToHomePage, navigate]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  function handleFilters(e) {
    if (e.target.value !== "") {
      setFilters({
        ...filters,
        [e.target.name]: e.target.value,
      });
    } else {
      delete filters[e.target.name];
      setFilters({
        ...filters,
      });
    }
  }

  return (
    <>
      <Container>
        <Navbar></Navbar>
        <Announcement></Announcement>
        <Title>{cat}</Title>
        <FilterContainer>
          <Filter>
            <FilterText>Filter Products:</FilterText>

            <Select
              id="color"
              name="color"
              onChange={handleFilters}
              value={filters?.color}
            >
              <Option disabled selected hidden>
                Color
              </Option>
              <Option key="All" value="">
                All Colors
              </Option>
              {colors.map((color) => (
                <Option key={color} value={color}>
                  {color}
                </Option>
              ))}
            </Select>
            <Select
              id="size"
              name="size"
              onChange={handleFilters}
              value={filters?.size}
            >
              <Option disabled selected hidden>
                Size
              </Option>
              <Option key="All" value="">
                All Sizes
              </Option>
              {sizes.map((size) => (
                <Option key={size} value={size}>
                  {size}
                </Option>
              ))}
            </Select>
          </Filter>
          <Filter>
            <FilterText>Sort Products:</FilterText>
            <Select
              id="sort"
              onChange={(e) => setSort(e.target.value)}
              value={sort}
            >
              <Option value="newest">Newest</Option>
              <Option value="asc">Price (asc)</Option>
              <Option value="desc">Price (desc)</Option>
            </Select>
          </Filter>
        </FilterContainer>
        {children}
        <Pagination
          cat={cat}
          sort={sort}
          filters={filters}
          totalItems={totalProducts}
          itemsPerPage={itemsPerPage}
          onPageChange={handlePageChange}
          cntPg={currentPage}
        ></Pagination>
        <Newsletter></Newsletter>
        <Footer></Footer>
      </Container>
    </>
  );
}

const Container = styled.div``;

const Title = styled.h1`
  margin: 20px;
`;

const FilterContainer = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ justifyContent: "space-around" })}
`;

const Filter = styled.div`
  margin: 20px;
  ${mobile({ margin: "0px 20px", display: "flex", flexDirection: "column" })}
`;

const FilterText = styled.span`
  font-size: 20px;
  font-weight: 600;
  margin-right: 20px;
  ${mobile({ marginRight: "0px" })}
`;

const Select = styled.select`
  padding: 10px;
  margin-right: 20px;
  cursor: pointer;
  ${mobile({ margin: "10px 0px" })}
`;

const Option = styled.option`
  cursor: pointer;
`;
