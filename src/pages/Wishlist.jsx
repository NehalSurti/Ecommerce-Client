import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Announcement from "../components/Announcement";
import Footer from "../components/Footer";
import { mobile } from "../utils/responsive";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../services/ToastOptions";
import { useDispatch } from "react-redux";
import { deleteProductFromWishlistAsync } from "../redux/features/wishlist/wishlistThunks";
import Newsletter from "../components/Newsletter";

export default function Wishlist() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const wishlist = useSelector((state) => state.wishlist);
  const user = useSelector((state) => state.user.currentUser);

  const handleProductDelete = (productId) => {
    try {
      dispatch(
        deleteProductFromWishlistAsync({
          userId: user._id,
          productId,
        })
      );
    } catch (error) {
      console.log("Error deleting Product from wishlist");
    }
  };

  return (
    <>
      <Container>
        <Navbar></Navbar>
        <Announcement></Announcement>
        <Wrapper>
          {wishlist && wishlist.wishlistProducts?.length !== 0 && (
            <>
              <Title>
                WISHLIST<span>{`(${wishlist.wishlistQuantity} Items)`}</span>
              </Title>
              <Top>
                <TopButton onClick={() => navigate("/")}>
                  CONTINUE SHOPPING
                </TopButton>
              </Top>
              <Bottom>
                <Info>
                  {wishlist &&
                    wishlist.wishlistProducts?.map((product) => {
                      return (
                        <Product>
                          <ProductDetail>
                            <ImageContainer>
                              <Image src={product.img}></Image>
                            </ImageContainer>
                            <Details>
                              <ProductName
                                onClick={() =>
                                  navigate(`/product/${product.productId}`)
                                }
                              >
                                {product.title}
                              </ProductName>
                              <ProductId>
                                <b>ID :</b>
                                {product.productId}
                              </ProductId>
                            </Details>
                          </ProductDetail>
                          <PriceDetail>
                            <ProductPrice>₹{product.price}</ProductPrice>
                            <ProductHandling>
                              <ProductDelete
                                onClick={() =>
                                  handleProductDelete(product.productId)
                                }
                              >
                                REMOVE
                              </ProductDelete>
                            </ProductHandling>
                          </PriceDetail>
                        </Product>
                      );
                    })}
                </Info>
              </Bottom>
            </>
          )}
          {wishlist && wishlist.wishlistProducts.length === 0 && (
            <div className="productsNotAvailable">Wishlist Empty!</div>
          )}
        </Wrapper>
        <Newsletter></Newsletter>
        <Footer></Footer>
      </Container>
      <ToastContainer />
    </>
  );
}

const Container = styled.div``;

const Wrapper = styled.div`
  padding: 20px;
  ${mobile({ padding: "10px" })}

  .productsNotAvailable {
    margin: auto;
    height: 70vh;
    width: 200px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 25px;
  }
`;

const Title = styled.h1`
  font-weight: 500;
  text-align: center;

  span {
    font-size: 25px;
    font-weight: 200;
  }
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding: 20px;
  width: 70%;
  margin: auto;
`;

const TopButton = styled.button`
  padding: 10px;
  font-weight: 600;
  cursor: pointer;
  border: ${(props) => props.type === "filled" && "none"};
  background-color: ${(props) =>
    props.type === "filled" ? "black" : "transparent"};
  color: ${(props) => props.type === "filled" && "white"};

  &:hover {
    box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.19),
      0 5px 5px 0 rgba(0, 0, 0, 0.19);
  }
`;

const Bottom = styled.div`
  display: flex;
  justify-content: center;
  ${mobile({ flexDirection: "column" })}
`;

const Info = styled.div`
  /* flex: 3; */
  width: 68%;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  ${mobile({ flexDirection: "column" })}
  margin-bottom: 15px;
  border: 1px solid lightgray;
  border-radius: 10px;
  padding: 15px 15px 15px 0px;
`;

const ProductDetail = styled.div`
  flex: 3;
  display: flex;
`;

const ImageContainer = styled.div``;

const Image = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ProductName = styled.span`
  font-weight: 600;
  letter-spacing: 0.5px;
  font-size: 18px;
  cursor: pointer;

  &:hover {
    color: #2874f0;
  }
`;

const ProductId = styled.span`
  letter-spacing: 0.5px;
  margin-top: 10px;
  b {
    margin-right: 10px;
    font-weight: 550;
  }
`;

const ProductColorSpan = styled.span`
  display: flex;
  align-items: center;
  letter-spacing: 0.5px;

  b {
    margin-right: 10px;
    font-weight: 550;
  }
`;

const ProductColor = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
`;

const ProductSize = styled.span`
  display: flex;
  align-items: center;
  letter-spacing: 0.5px;

  b {
    margin-right: 10px;
    font-weight: 550;
  }
`;

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`;

const ProductAmountContainer = styled.div`
  display: flex;
  align-items: center;

  .AddIcon {
    border: 1px solid #c2c2c2;
    cursor: pointer;
    border-radius: 50%;
    font-size: 22px !important;

    &.iconClicked {
      opacity: 50%;
      cursor: not-allowed;
      pointer-events: none;
    }

    &:hover {
      background-color: #c2c9d6;
    }
  }

  .RemoveIcon {
    border: 1px solid #c2c2c2;
    cursor: pointer;
    border-radius: 50%;
    font-size: 22px !important;

    &.iconClicked {
      opacity: 50%;
      cursor: not-allowed;
      pointer-events: none;
    }

    &:hover {
      background-color: #c2c9d6;
    }
  }
`;

const ProductAmount = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 46px;
  height: 28px;
  border-radius: 2px;
  background-color: #fff;
  border: 1px solid #c2c2c2;
  margin: 0 5px;
  font-size: 18px;
  ${mobile({ margin: "5px 15px" })}

  &.iconClicked {
    opacity: 50%;
    cursor: not-allowed;
    pointer-events: none;
  }
`;

const ProductPrice = styled.div`
  font-size: 20px;
  line-height: 24px;
  font-weight: 700;
  ${mobile({ marginBottom: "20px" })}
`;

// const Hr = styled.hr`
//   background-color: #eee;
//   border: none;
//   height: 1px;
// `;

const ProductHandling = styled.div`
  display: flex;
  gap: 10px;
  padding: 5px 5px 0px 5px;
`;

const ProductToWatchlist = styled.span`
  margin-right: 10px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  color: #007185 !important;
  border-right: 1px solid lightgray;
  padding-right: 15px;

  &:hover {
    text-decoration: underline;
  }
`;

const ProductDelete = styled.span`
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  color: #007185 !important;

  &:hover {
    text-decoration: underline;
  }
`;
