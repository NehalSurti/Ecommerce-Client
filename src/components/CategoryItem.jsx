import React from "react";
import styled from "styled-components";
import {mobile} from "../utils/responsive";
import { useNavigate } from "react-router-dom";

export default function CategoryItem({ item }) {
  
  const navigate = useNavigate();
  return (
    <Container>
      <Image src={item.img}></Image>
      <Info onClick={()=> navigate(`/products/${item.cat}`)}>
        <Title>{item.title}</Title>
        <Button>SHOP NOW</Button>
      </Info>
    </Container>
  );
}

const Container = styled.div`
  flex: 1 1 22%;
  margin: 3px;
  height: 70vh;
  position: relative;
  max-width: 363px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  ${mobile({height:"30vh"})}
`;

const Info = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Title = styled.h1`
  color: white;
  margin-bottom: 20px;
  text-shadow: 1px 1px 2px #000;
`;

const Button = styled.button`
border: none;
padding: 10px;
background-color: white;
color: gray;
cursor: pointer;
font-weight: 600;

&:hover {
  box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.19),0 5px 5px 0 rgba(0, 0, 0, 0.19);
}
`;
