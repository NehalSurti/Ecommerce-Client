import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Product from "./Product";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllProductsAsync } from "../redux/features/product/productThunks";
import { useSearchParams } from "react-router-dom";
import { useLocation } from "react-router-dom";

export default function ProductsCopy() {
  const dispatch = useDispatch();
  const location = useLocation();

  const [filteredProducts, setfilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const wishlist = useSelector((state) => state.wishlist);

  const cat = location.pathname.split("/")[2];

  const [searchParams] = useSearchParams();

  const currentPage = searchParams.get("pageNumber") || 1;
  const itemsPerPage = searchParams.get("pageSize") || 16;
  const filters = JSON.parse(searchParams.get("filters") || "[]");
  const sort = searchParams.get("sort");
  const color = filters.color;
  const size = filters.size;

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

  const getProducts = async () => {
    try {
      // Fetching all Products based on category
      const allProducts = await dispatch(
        fetchAllProductsAsync({
          cat,
          currentPage,
          itemsPerPage,
          filters,
          sort,
        })
      );

      //If dispatch is successfull
      if (allProducts.payload) {
        setfilteredProducts(allProducts.payload);
        window.scrollTo(0, 0);
      } else {
        console.log("Error fetching Products");
      }
    } catch (error) {
      console.log("Error fetching Products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, [currentPage, cat, sort, color, size]);

  return (
    <Container>
      {!loading ? (
        <>
          {filteredProducts.length !== 0 ? (
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
          )}
        </>
      ) : (
        <div className="loadingIndicator"></div>
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

  .loadingIndicator {
    border: 16px solid #f3f3f3; /* Light grey */
    border-top: 16px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 80px;
    height: 80px;
    animation: spin 2s linear infinite;
    margin: 100px 0;
  }
`;
