import React from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Announcement from "../components/Announcement";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import { mobile } from "../utils/responsive";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

export default function Orders() {
  const navigate = useNavigate();

  const orders = useSelector((state) => state.order.orders);

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "long", year: "numeric" };
    const formattedDate = new Date(dateString).toLocaleDateString(
      "en-US",
      options
    );
    return formattedDate;
  };

  return (
    <>
      <Container>
        <Navbar></Navbar>
        <Announcement></Announcement>
        <Wrapper>
          {orders && orders.length !== 0 && (
            <>
              <Title>YOUR ORDERS</Title>
              <Top>
                <TopButton onClick={() => navigate("/")}>
                  CONTINUE SHOPPING
                </TopButton>
              </Top>
              <Bottom>
                <Info>
                  {orders.map((order) => {
                    return (
                      <>
                        <DistinctOrders>
                          <Summary>
                            <Left>
                              <OrderPlaced>
                                <OrderPlacedTitle>
                                  ORDER PLACED
                                </OrderPlacedTitle>
                                <OrderPlacedValue>
                                  {formatDate(order.createdAt)}
                                </OrderPlacedValue>
                              </OrderPlaced>
                              <OrderTotal>
                                <OrderTotalTitle>TOTAL</OrderTotalTitle>
                                <OrderTotalValue>
                                  ₹{order.amounts}
                                </OrderTotalValue>
                              </OrderTotal>
                              <DeliveryTo>
                                <DeliveryToTitle>DISPATCH TO</DeliveryToTitle>
                                <DeliveryToValue>
                                  {order.address.Name}
                                  <KeyboardArrowDownIcon></KeyboardArrowDownIcon>
                                  <ToolTip></ToolTip>
                                  <DeliveryToValueToolTip>
                                    <UserInfoFormPartTwoRadioAddress>
                                      <RadioAddressFullName>
                                        {order?.address?.Name}
                                      </RadioAddressFullName>
                                      <br></br>
                                      {order?.address?.Add}
                                      <br></br>
                                      {order?.address?.Country}
                                      <br></br>
                                      {order?.address?.Postcode}
                                    </UserInfoFormPartTwoRadioAddress>
                                  </DeliveryToValueToolTip>
                                </DeliveryToValue>
                              </DeliveryTo>
                              <OrderStatus>
                                <OrderStatusTitle>
                                  ORDER STATUS
                                </OrderStatusTitle>
                                <OrderStatusValue>
                                  {order.status.charAt(0).toUpperCase() +
                                    order.status.slice(1)}
                                </OrderStatusValue>
                              </OrderStatus>
                              <PaymentStatus>
                                <PaymentStatusTitle>
                                  PAYMENT STATUS
                                </PaymentStatusTitle>
                                <PaymentStatusValue>
                                  {order.paymentStatus.charAt(0).toUpperCase() +
                                    order.paymentStatus.slice(1)}
                                </PaymentStatusValue>
                              </PaymentStatus>
                            </Left>
                            <Right>
                              <OrderNo>
                                <OrderNoTitle>ORDER NO.</OrderNoTitle>
                                <OrderNoValue>{order._id}</OrderNoValue>
                              </OrderNo>
                            </Right>
                          </Summary>
                          {order.products.map((product, index) => {
                            return (
                              <Product
                                productIndex={index === 0 ? true : false}
                              >
                                <ProductDetail>
                                  <ImageContainer
                                    imgAvailable={product.img ? true : false}
                                  >
                                    {product.img ? (
                                      <Image src={product.img}></Image>
                                    ) : (
                                      <ImageNotAvailable>
                                        Image Not Available
                                      </ImageNotAvailable>
                                    )}
                                  </ImageContainer>
                                  <Details
                                    imgAvailable={product.img ? true : false}
                                  >
                                    <ProductName
                                      onClick={() =>
                                        navigate(
                                          `/product/${product.productId}`
                                        )
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
                                    <ProductQuantity>
                                      <b>Quantity :</b>
                                      {product.quantity}
                                    </ProductQuantity>
                                  </Details>
                                </ProductDetail>
                                <PriceDetail>
                                  <ProductPrice>
                                    ₹
                                    {product.totalPrice ||
                                      product.quantity * product.price}
                                  </ProductPrice>
                                </PriceDetail>
                              </Product>
                            );
                          })}
                        </DistinctOrders>
                      </>
                    );
                  })}
                </Info>
              </Bottom>
            </>
          )}
          {orders && orders.length === 0 && (
            <div className="productsNotAvailable">No Orders Yet!</div>
          )}
        </Wrapper>
        <Newsletter></Newsletter>
        <Footer></Footer>
      </Container>
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
  width: 53%;
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
  width: 60%;
`;

const DistinctOrders = styled.div`
  border: 1px solid lightgray;
  border-radius: 10px;
  padding: 65px 20px 20px 20px;
  margin-bottom: 25px;
  position: relative;
  overflow: hidden;
`;

const Summary = styled.div`
  position: absolute;
  background-color: #dee3ed;
  width: 100%;
  height: 65px;
  top: 0;
  left: 0;
  display: flex;
  justify-content: space-between;
`;

const Left = styled.div`
  display: flex;
  gap: 20px;
  width: 70%;
`;

const OrderPlaced = styled.div`
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  justify-content: center;
  color: #565959;
  padding-left: 20px;
`;

const OrderPlacedTitle = styled.h5``;

const OrderPlacedValue = styled.span`
  font-size: 14px;
`;

const OrderTotal = styled.div`
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  justify-content: center;
  color: #565959;
`;

const OrderTotalTitle = styled.h5``;

const OrderTotalValue = styled.span`
  font-size: 14px;
`;

const DeliveryTo = styled.div`
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  justify-content: center;
  color: #565959;
`;

const ToolTip = styled.div`
  position: absolute;
  top: 50%;
  left: 25%;
  transform: translateX(-25%);
  border-width: 10px;
  border-style: solid;
  border-color: transparent transparent #f0f0f0 transparent;
  z-index: 1;
  visibility: hidden;
`;

const DeliveryToValueToolTip = styled.div`
  position: absolute;
  width: 140px;
  height: fit-content;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 5px;
  top: 155%;
  left: 0%;
  transform: translateX(-30%);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  visibility: hidden;
`;

const DeliveryToTitle = styled.h5``;

const DeliveryToValue = styled.span`
  font-size: 14px;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;

  &:hover ${DeliveryToValueToolTip} {
    visibility: visible;
  }
  &:hover ${ToolTip} {
    visibility: visible;
  }
  &:hover {
    text-decoration: underline;
  }

  svg {
    font-size: 14px;
  }
`;

const UserInfoFormPartTwoRadioAddress = styled.div`
  display: inline-flex;
  font-weight: 350;
  font-size: 14px;
`;

const RadioAddressFullName = styled.b`
  display: contents;
`;

const OrderStatus = styled.div`
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  justify-content: center;
  color: #565959;
`;

const OrderStatusTitle = styled.h5``;

const OrderStatusValue = styled.span`
  font-size: 14px;
`;

const PaymentStatus = styled.div`
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  justify-content: center;
  color: #565959;
`;

const PaymentStatusTitle = styled.h5``;

const PaymentStatusValue = styled.span`
  font-size: 14px;
`;

const Right = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const OrderNo = styled.div`
  padding: 5px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  justify-content: center;
  color: #565959;
  padding-right: 20px;
`;

const OrderNoTitle = styled.h5``;

const OrderNoValue = styled.span`
  font-size: 14px;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  /* ${mobile({ flexDirection: "column" })} */
  /* border-bottom: 1px solid lightgray; */
  padding: 10px 10px 10px 0px;
  border-top: ${(props) => (props.productIndex ? "" : "1px solid lightgray")};
`;

const ProductDetail = styled.div`
  flex: 5;
  display: flex;
`;

const Image = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
`;

const Details = styled.div`
  display: flex;
  gap: 5px;
  flex-wrap: wrap;
  justify-content: space-between;
  width: ${(props) => (props.imgAvailable ? "" : "80%")};
`;

const ProductName = styled.span`
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  width: 100%;
  margin-bottom: 10px;

  &:hover {
    color: #2874f0;
  }
`;

const ProductId = styled.span`
  letter-spacing: 0.5px;
  width: 70%;
  font-size: 14px;
  b {
    margin-right: 5px;
    font-weight: 300;
  }
`;

const ProductColorSpan = styled.span`
  display: flex;
  align-items: center;
  letter-spacing: 0.5px;
  font-size: 14px;
  width: 20%;

  b {
    margin-right: 5px;
    font-weight: 300;
  }
`;

const ProductColor = styled.div`
  width: 15px;
  height: 15px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  border: 1px solid lightgray;
`;

const ProductSize = styled.span`
  display: flex;
  align-items: center;
  letter-spacing: 0.5px;
  font-size: 14px;
  width: 70%;

  b {
    margin-right: 5px;
    font-weight: 300;
  }
`;

const PriceDetail = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
`;

const ProductQuantity = styled.span`
  display: flex;
  align-items: center;
  letter-spacing: 0.5px;
  font-size: 14px;
  width: 20%;
  b {
    margin-right: 5px;
    font-weight: 300;
  }
`;

const ProductPrice = styled.div`
  font-size: 14px;
  line-height: 24px;
  font-weight: 600;
  /* ${mobile({ marginBottom: "20px" })} */
`;

const ImageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  /* height: ${(props) => (props.imgAvailable ? "" : "80px")}; */
  width: ${(props) => (props.imgAvailable ? "" : "15%")};
`;

const ImageNotAvailable = styled.div`
  width: 80%;
  height: 100%;
  border-right: 1px solid lightgray;
  display: flex;
  align-items: center;
  text-align: center;
  font-size: 14px;
`;
