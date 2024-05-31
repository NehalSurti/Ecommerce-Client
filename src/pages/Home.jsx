import React from "react";
import Navbar from "../components/Navbar";
import Announcement from "../components/Announcement";
import Slider from "../components/Slider";
import Categories from "../components/Categories";
import Products from "../components/Products";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      <Announcement />
      <Navbar />
      <Slider />
      <Categories />
      <Products />
      <Button
        onClick={() =>
          navigate("/products")
        }
      >
        SHOW ALL
      </Button>
      <Newsletter />
      <Footer />
    </>
  );
}

const Button = styled.button`
  padding: 10px;
  font-size: 20px;
  background-color: transparent;
  cursor: pointer;
  display: block;
  margin: 0px auto 20px auto;

  &:hover {
    box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.19),
      0 5px 5px 0 rgba(0, 0, 0, 0.19);
  }
`;
