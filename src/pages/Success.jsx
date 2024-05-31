import React, { useEffect } from "react";
import styled from "styled-components";
import tick from "../assets/images/404-tick.png";
import { mobile } from "../utils/responsive";
import { useNavigate, Navigate, useParams } from "react-router-dom";
import { resetcurrentOrderSlice } from "../redux/features/order/orderSlice";
import { useDispatch, useSelector } from "react-redux";
import { deleteCartAsync } from "../redux/features/cart/cartThunks";
import { getOrdersAsync } from "../redux/features/order/orderThunks";

export default function Success() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const params = useParams();

  const user = useSelector((state) => state.user.currentUser);

  useEffect(() => {
    dispatch(deleteCartAsync(user._id));
    dispatch(resetcurrentOrderSlice());
    dispatch(getOrdersAsync(user._id));
  }, [dispatch]);

  return (
    <>
      {!params.orderId && <Navigate to="/" replace={true}></Navigate>}
      <Container>
        <Wrapper>
          <Title>
            <TitleImage>
              <Image src={tick}></Image>
            </TitleImage>
            <TitleText>Payment Successful !</TitleText>
          </Title>
          <OrderId>Order Number #{params?.orderId}</OrderId>
          <Desc>
            {" "}
            We appreciate your business! If you have any questions, please email
            <a href="mailto:orders@trends.com"> orders@trends.com</a>
          </Desc>
          <Button onClick={() => navigate("/")}>Home</Button>
        </Wrapper>
      </Container>
    </>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f8f9fa !important;
`;

const Wrapper = styled.div`
  border: none;
  width: 40%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f8f8f8;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  ${mobile({ width: "80%" })}
`;

const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px;
  ${mobile({ margin: "15px" })}
`;

const TitleImage = styled.div`
  height: 50px;
  margin-right: 20px;
  ${mobile({ height: "20px", marginRight: "8px" })}
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const TitleText = styled.h1`
  color: #6fd649;
  font-weight: 600;
  letter-spacing: 1px;
  ${mobile({ fontSize: "17px" })}
`;

const OrderId = styled.h3`
  color: gray;
`;

const Desc = styled.span`
  margin: 20px;
  text-align: center;
  font-size: 18px;
  color: gray;

  a {
    text-decoration: none;
  }
  ${mobile({ margin: "10px", fontSize: "12px" })}
`;

const Button = styled.button`
  width: 20%;
  margin: 20px;
  padding: 10px;
  border: none;
  background-color: #0674b0;
  color: white;
  cursor: pointer;
  font-weight: 500;
  letter-spacing: 1.5px;
  font-size: 15px;

  &:hover {
    background-color: #024d76;
    box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.19),
      0 5px 5px 0 rgba(0, 0, 0, 0.19);
  }
  ${mobile({ width: "30%", marginBottom: "10px", fontSize: "12px" })}
`;
