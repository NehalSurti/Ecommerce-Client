import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Product from "./Product";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProductsAsync } from "../redux/features/product/productThunks";
import { useLocation, useNavigate } from "react-router-dom";

export default function Products({
  itemsPerPage,
  currentPage,
  cat,
  filters,
  sort,
  checkTotalItems,
  onPageChange,
}) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setfilteredProducts] = useState([]);

  const wishlist = useSelector((state) => state.wishlist);

  function inWishlist(item) {
    const productFind = wishlist.wishlistProducts.find(
      (pdt) => pdt.productId === item._id
    );
    if (productFind) {
      return true;
    } else {
      return false;
    }
  }

  const getProducts = async (pageNumber) => {
    try {
      /* -------------------------- Fetching all Products based on category ------------------------- */
      const allProducts = await dispatch(
        fetchAllProductsAsync({
          cat,
          currentPage: pageNumber,
          itemsPerPage,
          filters,
          sort,
        })
      );
      /* ----------------------- If dispatch is successfull ----------------------- */
      if (allProducts.payload) {
        setfilteredProducts(allProducts.payload);
        window.scrollTo(0, 0);
        // window.history.pushState(
        //   { page: pageNumber },
        //   "",
        //   `?page=${pageNumber}`
        // );
      } else {
        console.log("Error fetching Products based on categories & filters");
      }
    } catch (error) {
      console.log("Error fetching Products based on categories & filters");
    }
  };

  useEffect(() => {
    cat && getProducts(currentPage);
  }, [cat, currentPage, itemsPerPage, filters, sort]);

 

  useEffect(() => {
    const getFilteredProductsLength = async () => {
      try {
        const fetchedFilteredProducts = await dispatch(
          fetchAllProductsAsync({ cat, filters, sort })
        );
        if (fetchedFilteredProducts.payload) {
          checkTotalItems &&
            checkTotalItems(fetchedFilteredProducts.payload.length);
        } else {
          console.log(
            "Error fetching total Products based on categories & filters 1"
          );
        }
      } catch (error) {
        console.log(
          "Error fetching total Products based on categories & filters 2",
          error
        );
      }
    };
    cat && getFilteredProductsLength();
  }, [cat, filters, sort]);

  useEffect(() => {
    const getAllProducts = async () => {
      try {
        const fetchedAllProducts = await dispatch(
          fetchAllProductsAsync({ sort: "desc" })
        );
        if (fetchedAllProducts.payload) {
          setProducts(fetchedAllProducts.payload);
        } else {
          console.log("Error fetching Products");
        }
      } catch (error) {
        console.log("Error fetching Products", error);
      }
    };
    getAllProducts();
  }, []);

  return (
    <Container>
      {cat ? (
        filteredProducts.length !== 0 ? (
          filteredProducts.map((item) => {
            return (
              <Product
                item={item}
                key={item.id}
                inWishlist={inWishlist(item)}
              ></Product>
            );
          })
        ) : (
          <div className="productsNotAvailable">Products Not Available</div>
        )
      ) : (
        products.slice(0, 8).map((item) => {
          return (
            <Product
              item={item}
              key={item.id}
              inWishlist={inWishlist(item)}
            ></Product>
          );
        })
      )}
    </Container>
  );
}

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;

  .productsNotAvailable {
    margin: 50px;
    height: 200px;
    width: 200px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;
