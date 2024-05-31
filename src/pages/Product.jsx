import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Navbar from "../components/Navbar";
import Announcement from "../components/Announcement";
import Newsletter from "../components/Newsletter";
import Footer from "../components/Footer";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import { mobile } from "../utils/responsive";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { addProduct } from "../redux/features/cart/cartSlice";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../services/ToastOptions";
import { fetchProductByIdAsync } from "../redux/features/product/productThunks";
import { addWishlistProduct } from "../redux/features/wishlist/wishlistSlice";
import { addOrUpdateWishlistAsync } from "../redux/features/wishlist/wishlistThunks";
import { addOrUpdateCartAsync } from "../redux/features/cart/cartThunks";

export default function Product() {
  const dispatch = useDispatch();
  const location = useLocation();

  const [product, setProduct] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");
  const [loading, setLoading] = useState(true);
  const [clicked, setClicked] = useState(false);

  const id = location.pathname.split("/")[2];
  const wishlist = useSelector((state) => state.wishlist);
  const user = useSelector((state) => state.user.currentUser);

  function handleQuantity(type) {
    if (type === "dec") {
      quantity > 1 && setQuantity(quantity - 1);
    } else {
      setQuantity(quantity + 1);
    }
  }

  async function handleClick() {
    setClicked(true);
    if (color === "") {
      toast.error("Please select a color.", toastOptions);
      setClicked(false);
      return;
    } else if (size === "") {
      toast.error("Please select a size.", toastOptions);
      setClicked(false);
      return;
    }

    try {
      const cartProducts = await dispatch(
        addOrUpdateCartAsync({
          userId: user._id,
          productId: product._id,
          title: product.title,
          img: product.img,
          price: product.price,
          quantity,
          size,
          color,
        })
      );
      if (cartProducts.payload) {
        toast.success("Product added to cart.", toastOptions);
      } else {
        console.log("Error adding Product to cart");
        toast.error("Error adding Product to cart.", toastOptions);
      }
      setClicked(false);
    } catch (error) {
      setClicked(false);
      console.log("Error adding Product to cart");
      toast.error("Error adding Product to cart.", toastOptions);
    }
  }

  async function handleWishlistClick() {
    setClicked(true);

    const productFind = wishlist.wishlistProducts.find(
      (pdt) => pdt.productId === product._id
    );

    if (productFind) {
      console.log("Product already available in the wishlist");
      toast.error("Product already available in the wishlist.", toastOptions);
      setClicked(false);
    } else {
      try {
        const wishlistProduct = await dispatch(
          addOrUpdateWishlistAsync({
            userId: user._id,
            productId: product._id,
            title: product.title,
            img: product.img,
            price: product.price,
          })
        );
        if (wishlistProduct.payload) {
          toast.success("Product added to wishlist.", toastOptions);
        } else {
          console.log("Error adding Product to wishlist");
          toast.error("Error adding Product to wishlist.", toastOptions);
        }
      } catch (error) {
        console.log("Error adding Product to wishlist");
        toast.error("Error adding Product to wishlist.", toastOptions);
      } finally {
        setClicked(false);
      }
    }
  }

  useEffect(() => {
    const getProduct = async () => {
      try {
        const fetchedProduct = await dispatch(fetchProductByIdAsync(id));
        if (fetchedProduct.payload) {
          setProduct(fetchedProduct.payload);
        } else {
          console.log("Error fetching Product");
        }
      } catch (err) {
        console.log("Error fetching Product");
      } finally {
        setLoading(false);
      }
    };
    getProduct();
  }, [id]);

  return (
    <>
      <Container>
        <Navbar></Navbar>
        <Announcement></Announcement>
        <Wrapper>
          {!loading ? (
            <>
              <ImgContainer>
                <Image src={product.img}></Image>
              </ImgContainer>
              <InfoContainer>
                <Title>{product.title}</Title>
                <PriceContainer>
                  <PriceTitle>Price:</PriceTitle>
                  <Price>₹{product.price}</Price>
                </PriceContainer>
                <FilterContainer>
                  <Filter>
                    <FilterTitle>Color:</FilterTitle>
                    <FilterColorContainer>
                      {product.color?.map((colr) => {
                        return (
                          <FilterColor
                            className={color === colr ? "selectedColor" : ""}
                            key={colr}
                            color={colr}
                            onClick={() => setColor(colr)}
                          ></FilterColor>
                        );
                      })}
                    </FilterColorContainer>
                  </Filter>
                  <Filter>
                    <FilterTitle>Size:</FilterTitle>
                    <FilterSize onChange={(e) => setSize(e.target.value)}>
                      <FilterSizeOption disabled selected hidden>
                        Select
                      </FilterSizeOption>
                      {product.size?.map((size) => {
                        return (
                          <FilterSizeOption key={size} value={size}>
                            {size}
                          </FilterSizeOption>
                        );
                      })}
                    </FilterSize>
                  </Filter>
                </FilterContainer>
                <AddContainer>
                  <AmountContainerTitle>Quantity:</AmountContainerTitle>
                  <AmountContainer>
                    <RemoveIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => handleQuantity("dec")}
                    ></RemoveIcon>
                    <Amount>{quantity}</Amount>
                    <AddIcon
                      style={{ cursor: "pointer" }}
                      onClick={() => handleQuantity("inc")}
                    ></AddIcon>
                  </AmountContainer>
                </AddContainer>
                <ButtonContainer>
                  <ButtonOne onClick={handleClick}>
                    <ShoppingCartOutlinedIcon />
                    ADD TO CART
                  </ButtonOne>
                  <ButtonTwo onClick={handleWishlistClick}>
                    <FavoriteBorderIcon />
                    WISHLIST
                  </ButtonTwo>
                </ButtonContainer>
                <DescContainer>
                  <DescTitle>Product Details:</DescTitle>
                  <Desc>{product.desc}</Desc>
                </DescContainer>
              </InfoContainer>
            </>
          ) : (
            <div className="loadingIndicator"></div>
          )}
          {clicked && <div className="clickloadingIndicator"></div>}
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
  padding: 50px;
  display: flex;
  min-height: 90vh;
  position: relative;
  ${mobile({ padding: "10px", flexDirection: "column" })}

  .loadingIndicator {
    position: absolute;
    top: 250px;
    left: 50%;
    border: 16px solid #f3f3f3; /* Light grey */
    border-top: 16px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 80px;
    height: 80px;
    animation: spin 2s linear infinite;
  }

  .clickloadingIndicator {
    position: absolute;
    top: 250px;
    left: 50%;
    border: 16px solid #f3f3f3; /* Light grey */
    border-top: 16px solid #3498db; /* Blue */
    border-radius: 50%;
    width: 80px;
    height: 80px;
    animation: spin 2s linear infinite;
  }

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const ImgContainer = styled.div`
  flex: 1;
`;

const Image = styled.img`
  width: 100%;
  height: 90vh;
  object-fit: contain;
  ${mobile({ height: "40vh" })}
`;

const InfoContainer = styled.div`
  flex: 1;
  padding: 0px 50px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  ${mobile({ padding: "10px" })}
`;

const Title = styled.h1`
  font-weight: 400;
  border-bottom: 1px solid lightgrey;
  font-size: 24px;
  line-height: 32px;
`;

const PriceContainer = styled.div`
  margin-top: 5px;
`;

const PriceTitle = styled.h2`
  font-size: 18px;
  line-height: 20px;
  margin-bottom: 5px;
  letter-spacing: 0.5px;
`;

const Price = styled.span`
  font-size: 30px;
  color: #b12704;
`;

const FilterContainer = styled.div`
  width: 90%;
  margin: 15px 0px;
  display: flex;
  ${mobile({ width: "100%" })}
`;

const Filter = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
`;

const FilterTitle = styled.span`
  font-size: 18px;
  line-height: 20px;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
  font-weight: 700;
`;

const FilterColorContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

const FilterColor = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  background-color: ${(props) => props.color};
  margin: 0px 5px;
  cursor: pointer;
  border: 1px solid lightgray;
  &:hover {
    scale: 1.1;
  }
  &.selectedColor {
    transform: scale(1.3);
  }
`;

const FilterSize = styled.select`
  padding: 5px;
  width: 30%;
`;

const FilterSizeOption = styled.option``;

const AddContainer = styled.div`
  display: flex;
  flex-direction: column;
  ${mobile({ width: "100%" })}
`;

const AmountContainerTitle = styled.div`
  font-size: 18px;
  line-height: 20px;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
  font-weight: 700;
`;

const AmountContainer = styled.div`
  display: flex;
  align-items: center;
  font-weight: 700;

  svg {
    color: gray;
    &:hover {
      scale: 1.2;
    }
  }
`;

const Amount = styled.span`
  width: 30px;
  height: 30px;
  border-radius: 10px;
  border: 1px solid teal;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 5px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.18);
`;

const ButtonContainer = styled.div`
  display: flex;
  width: 100%;
  border-bottom: 1px solid lightgray;
  padding-bottom: 15px;
  gap: 30px;
  margin-top: 15px;
`;

const ButtonOne = styled.button`
  padding: 15px;
  cursor: pointer;
  font-weight: 700;
  width: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: #ff9f00;
  color: white;

  &:hover {
    box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.12);
  }
`;

const ButtonTwo = styled.button`
  padding: 15px;
  cursor: pointer;
  font-weight: 700;
  width: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  background: #fb641b;
  color: white;

  &:hover {
    box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.12);
  }
`;

const DescContainer = styled.div`
  margin-top: 10px;
`;

const DescTitle = styled.h2`
  font-size: 18px;
  line-height: 20px;
  margin-bottom: 10px;
  letter-spacing: 0.5px;
  font-weight: 700;
`;

const Desc = styled.p`
  /* margin: 20px 0px; */
`;
