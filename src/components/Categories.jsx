import React from "react";
import styled from "styled-components";
import { categories } from "../utils/data";
import CategoryItem from "./CategoryItem";
import {mobile} from "../utils/responsive";

export default function Categories() {
  return (
    <Container>
      {categories.map((item) => {
        return <CategoryItem item={item} key={item.id}></CategoryItem>;
      })}
    </Container>
  );
}

const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    padding: 20px;
    justify-content: space-between;
    ${mobile({padding:"0px", flexDirection:"column"})}
`;
