import React from "react";
import styled from "styled-components";
import { mobile } from "../utils/responsive";
import CancelIcon from "@mui/icons-material/Cancel";
import { useNavigate } from "react-router-dom";

export default function Cancel() {
  const navigate = useNavigate();
  return (
    <Container>
      <Wrapper>
        <Title>
          <TitleImage>
            <CancelIcon
              style={{ fontSize: window.innerWidth <= 380 ? "20px" : "50px" }}
            ></CancelIcon>
          </TitleImage>
          <TitleText>Checkout canceled !</TitleText>
        </Title>
        <Desc>
          Forgot to add something to your cart? Shop around then come back to
          pay! <br></br>
          <br></br>
          If you have any questions, please email
          <a href="mailto:orders@trends.com"> orders@trends.com</a>
        </Desc>
        <Button onClick={()=>navigate('/')}>OK</Button>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
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
  margin-right: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: red;
  ${mobile({ height: "20px", marginRight: "8px" })}
`;

const TitleText = styled.h1`
  color: red;
  font-weight: 600;
  letter-spacing: 0.5px;
  ${mobile({ fontSize: "17px" })}
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
  background-color: #024d76;
  color: white;
  cursor: pointer;
  font-weight: 500;
  letter-spacing: 1.5px;
  font-size: 15px;

  &:hover {
    background-color: #0674b0;
  }
  ${mobile({ width: "30%", marginBottom: "10px", fontSize: "12px" })}
`;
