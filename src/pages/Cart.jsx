import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Announcement from "../components/Announcement";
import Footer from "../components/Footer";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { mobile } from "../utils/responsive";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../services/ToastOptions";
import {
  deleteProductFromCartAsync,
  updateProductQuantityInCartAsync,
} from "../redux/features/cart/cartThunks";
import { useDispatch } from "react-redux";
import Newsletter from "../components/Newsletter";
import { addOrUpdateWishlistAsync } from "../redux/features/wishlist/wishlistThunks";

export default function Cart() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [quantityClicked, setQuantityClicked] = useState(false);

  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.currentUser);
  const wishlist = useSelector((state) => state.wishlist);

  const handleProductDelete = (itemId) => {
    try {
      dispatch(deleteProductFromCartAsync({ userId: user._id, itemId }));
    } catch (error) {
      console.log("Error deleting Product from cart");
    }
  };

  function handleQuantity(type, prevQuantity, itemId) {
    setQuantityClicked(true);
    let newQuantity;
    if (type === "dec") {
      if (prevQuantity > 1) {
        newQuantity = prevQuantity - 1;
      } else {
        newQuantity = null;
      }
    } else {
      newQuantity = prevQuantity + 1;
    }

    if (newQuantity !== null) {
      try {
        const updProd = dispatch(
          updateProductQuantityInCartAsync({
            userId: user._id,
            itemId,
            newQuantity,
          })
        );
        console.log("updProd : ", updProd.payload);
        toast.success("Product quantity updated.", toastOptions);
      } catch (error) {
        console.log("Error updating Product quantity");
        toast.error("Error updating Product quantity.", toastOptions);
      } finally {
        setQuantityClicked(false);
      }
    } else {
      toast.error("Minimum one quantity is required.", toastOptions);
      setQuantityClicked(false);
    }
  }

  async function handleProductToWatchlist(
    productId,
    title,
    img,
    price,
    itemId
  ) {
    const productFind = wishlist.wishlistProducts.find(
      (pdt) => pdt.productId === productId
    );

    if (productFind) {
      dispatch(deleteProductFromCartAsync({ userId: user._id, itemId }));
      toast.success("Product moved to wishlist.", toastOptions);
    } else {
      try {
        const wishlistProduct = await dispatch(
          addOrUpdateWishlistAsync({
            userId: user._id,
            productId: productId,
            title,
            img,
            price,
          })
        );
        if (wishlistProduct.payload) {
          dispatch(deleteProductFromCartAsync({ userId: user._id, itemId }));
          toast.success("Product moved to wishlist.", toastOptions);
        } else {
          console.log("Error moving Product to wishlist");
          toast.error("Error moving Product to wishlist.", toastOptions);
        }
      } catch (error) {
        console.log("Error moving Product to wishlist");
        toast.error("Error moving Product to wishlist.", toastOptions);
      }
    }
  }

  return (
    <>
      <Container>
        <Navbar></Navbar>
        <Announcement></Announcement>
        <Wrapper>
          {cart && cart.products.length !== 0 && (
            <>
              <Title>SHOPPING BAG</Title>
              <Top>
                <TopButton onClick={() => navigate("/")}>
                  CONTINUE SHOPPING
                </TopButton>
                <TopButton type="filled" onClick={() => navigate("/checkout")}>
                  CHECKOUT NOW
                </TopButton>
              </Top>
              <Bottom>
                <Info>
                  {cart.products.map((product) => {
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
                            <ProductColorSpan>
                              <b>Color :</b>
                              <ProductColor
                                color={product.color}
                              ></ProductColor>
                            </ProductColorSpan>
                            <ProductSize>
                              <b>Size :</b>
                              {product.size}
                            </ProductSize>
                            <ProductAmountContainer>
                              <RemoveIcon
                                className={
                                  quantityClicked
                                    ? "RemoveIcon iconClicked"
                                    : "RemoveIcon"
                                }
                                onClick={() =>
                                  handleQuantity(
                                    "dec",
                                    product.quantity,
                                    product._id
                                  )
                                }
                              ></RemoveIcon>
                              <ProductAmount
                                className={quantityClicked ? "iconClicked" : ""}
                              >
                                {product.quantity}
                              </ProductAmount>
                              <AddIcon
                                className={
                                  quantityClicked
                                    ? "AddIcon iconClicked"
                                    : "AddIcon"
                                }
                                onClick={() =>
                                  handleQuantity(
                                    "inc",
                                    product.quantity,
                                    product._id
                                  )
                                }
                              ></AddIcon>
                            </ProductAmountContainer>
                          </Details>
                        </ProductDetail>
                        <PriceDetail>
                          <ProductPrice>₹{product.totalPrice}</ProductPrice>
                          <ProductHandling>
                            <ProductToWatchlist
                              onClick={() =>
                                handleProductToWatchlist(
                                  product.productId,
                                  product.title,
                                  product.img,
                                  product.price,
                                  product._id
                                )
                              }
                            >
                              MOVE TO WISHLIST
                            </ProductToWatchlist>
                            <ProductDelete
                              onClick={() => handleProductDelete(product._id)}
                            >
                              REMOVE
                            </ProductDelete>
                          </ProductHandling>
                        </PriceDetail>
                      </Product>
                    );
                  })}
                  {/* <Hr></Hr> */}
                </Info>
                <Summary>
                  <SummaryTitle>
                    ORDER SUMMARY <span>{`(${cart.quantity} Items)`}</span>
                  </SummaryTitle>
                  <SummaryItem>
                    <SummaryItemText>Subtotal</SummaryItemText>
                    <SummaryItemPrice>₹{cart.total}</SummaryItemPrice>
                  </SummaryItem>
                  <SummaryItem>
                    <SummaryItemText>Estimated Shipping</SummaryItemText>
                    <SummaryItemPrice>₹5.90</SummaryItemPrice>
                  </SummaryItem>
                  <SummaryItem>
                    <SummaryItemText>Shipping Discount</SummaryItemText>
                    <SummaryItemPrice>₹-5.90</SummaryItemPrice>
                  </SummaryItem>
                  <SummaryItem type="total">
                    <SummaryItemText>Total</SummaryItemText>
                    <SummaryItemPrice>₹{cart.total}</SummaryItemPrice>
                  </SummaryItem>
                  <Button onClick={() => navigate("/checkout")}>
                    CHECKOUT NOW
                  </Button>
                </Summary>
              </Bottom>
            </>
          )}
          {cart && cart.products.length === 0 && (
            <div className="productsNotAvailable">Cart Empty!</div>
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
`;

const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px;
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
  justify-content: space-between;
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
  width: 200px;
  height: 200px;
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
  border: 1px solid lightgray;
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

const Summary = styled.div`
  border: 0.5px solid lightgray;
  border-radius: 10px;
  padding: 20px;
  height: max-content;
  width: 30%;
`;

const SummaryTitle = styled.h1`
  font-weight: 500;
  border-bottom: 1px solid lightgray;
  font-size: 25px;
  padding-bottom: 10px;

  span {
    font-size: 20px;
    font-weight: 200;
  }
`;

const SummaryItem = styled.div`
  margin: ${(props) =>
    props.type === "total" ? "20px 0px 15px 0px" : "30px 0px "};
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === "total" && "500"};
  font-size: ${(props) => props.type === "total" && "24px"};
  border-top: ${(props) => props.type === "total" && "1px dotted gray"};
  padding-top: ${(props) => props.type === "total" && "10px"};
`;

const SummaryItemText = styled.span``;

const SummaryItemPrice = styled.span``;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: black;
  color: white;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.19),
      0 5px 5px 0 rgba(0, 0, 0, 0.19);
  }
`;
