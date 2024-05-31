import React from "react";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../services/ToastOptions";
import {
  addOrUpdateWishlistAsync,
  deleteProductFromWishlistAsync,
} from "../redux/features/wishlist/wishlistThunks";

export default function Product({ item, inWishlist }) {
  const dispatch = useDispatch();

  const wishlist = useSelector((state) => state.wishlist);
  const user = useSelector((state) => state.user.currentUser);

  async function handleWishlistClick() {
    const productFind = wishlist.wishlistProducts.find(
      (pdt) => pdt.productId === item._id
    );

    if (productFind) {
      try {
        const wishlistProduct = await dispatch(
          deleteProductFromWishlistAsync({
            userId: user._id,
            productId: item._id,
          })
        );
        if (wishlistProduct.payload) {
          toast.success("Product removed from the wishlist.", toastOptions);
        } else {
          toast.error(
            "Error removing Product from the wishlist.",
            toastOptions
          );
        }
      } catch (error) {
        console.log("Error removing Product from the wishlist");
        toast.error("Error removing Product from the wishlist.", toastOptions);
      }
    } else {
      try {
        const wishlistProduct = await dispatch(
          addOrUpdateWishlistAsync({
            userId: user._id,
            productId: item._id,
            title: item.title,
            img: item.img,
            price: item.price,
          })
        );
        if (wishlistProduct.payload) {
          toast.success("Product added to wishlist.", toastOptions);
        } else {
          console.log("Error adding Product to wishlist");
          toast.error("Error adding Product to wishlist.", toastOptions);
        }
      } catch (error) {
        console.log("Error adding Product to wishlist", error);
        toast.error("Error adding Product to wishlist.", toastOptions);
      }
    }
  }

  return (
    <>
      <Container>
        <Circle></Circle>
        <Image src={item.img}></Image>
        <Info>
          <Icon>
            <Link to={`/product/${item._id}`}>
              <SearchOutlinedIcon></SearchOutlinedIcon>
            </Link>
          </Icon>
          <Icon onClick={handleWishlistClick} inWishlist={inWishlist}>
            <FavoriteBorderIcon></FavoriteBorderIcon>
          </Icon>
        </Info>
      </Container>
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  flex: 1 1 22%;
  margin: 5px;
  min-width: 280px;
  height: 350px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5fbfd;
  position: relative;
  overflow: hidden;
  max-width: 24%;
`;

const Circle = styled.div`
  width: 300px;
  height: 300px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const Image = styled.img`
  height: 70%;
  z-index: 2;
`;

const Info = styled.div`
  opacity: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.2);
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.5s ease;

  &:hover {
    opacity: 1;
  }
`;

const Icon = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: ${(props) => (props.inWishlist ? "red" : "white")};
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 10px;
  transition: all 0.5s ease;
  cursor: pointer;

  &:hover {
    background-color: ${(props) => (props.inWishlist ? "red" : "#e9f5f5")};
    transform: scale(1.1);
  }
`;
