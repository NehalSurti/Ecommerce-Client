import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Badge } from "@mui/material";
import { mobile } from "../utils/responsive";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/features/user/userSlice";
import { resetWishlist } from "../redux/features/wishlist/wishlistSlice";
import { resetProductSlice } from "../redux/features/product/productSlice";
import { resetCartSlice } from "../redux/features/cart/cartSlice";
import { resetOrderSlice } from "../redux/features/order/orderSlice";

export default function Navbar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  const quantity = useSelector((state) => state.cart.quantity);
  const wishlist = useSelector((state) => state.wishlist);
  const user = useSelector((state) => state.user.currentUser);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  async function handleSignout() {
    dispatch(resetWishlist());
    dispatch(resetProductSlice());
    dispatch(resetCartSlice());
    dispatch(resetOrderSlice());
    dispatch(logout());
  }

  useEffect(() => {
    // Function to close menu when clicking outside
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Adding event listener
    window.addEventListener("click", handleClickOutside);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // TODO Update Link
  function handleAdminNavigatin() {
    try {
      window.open(
        `/admin/login?id=${user._id}`,
        "_blank",
        "noopener,noreferrer"
      );
    } catch (error) {
      console.log("error : ", error);
    }
  }

  return (
    <Container>
      <Wrapper>
        <Left>
          <Language>EN</Language>
          <SearchContainer>
            <Input placeholder="Search"></Input>
            <SearchIcon style={{ color: "gray", fontSize: 16 }}></SearchIcon>
          </SearchContainer>
        </Left>
        <Center>
          <Logo onClick={() => navigate("/")}>TRENDS.</Logo>
        </Center>
        <Right>
          {/* <MenuItem>REGISTER</MenuItem>
          <MenuItem>SIGN IN</MenuItem> */}
          <MenuItem onClick={handleSignout}>SIGN OUT</MenuItem>
          {user.isAdmin && (
            <MenuItem onClick={handleAdminNavigatin}>ADMIN</MenuItem>
          )}
          <MenuItem onClick={() => navigate("/wishlist")}>
            <Badge
              variant={window.innerWidth <= 380 ? "dot" : "null"}
              badgeContent={wishlist.wishlistQuantity}
              color="primary"
            >
              <FavoriteBorderIcon />
            </Badge>
          </MenuItem>
          <MenuItem onClick={() => navigate("/cart")}>
            <Badge
              variant={window.innerWidth <= 380 ? "dot" : "null"}
              badgeContent={quantity}
              color="primary"
            >
              <ShoppingCartOutlinedIcon />
            </Badge>
          </MenuItem>
          <MenuItem className="DropdownMenuWrapper" ref={dropdownRef}>
            <Img
              src={
                user?.img ||
                "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif"
              }
              alt=""
              // className="topAvatar"
              onClick={toggleMenu}
            />
            <BorderLine isOpen={isOpen}></BorderLine>
            <ProfileMenu isOpen={isOpen}>
              {user.isAdmin && (
                <ProfileMenuItem onClick={handleAdminNavigatin}>
                  Admin Panel
                </ProfileMenuItem>
              )}
              <ProfileMenuItem>Your Profile</ProfileMenuItem>
              <ProfileMenuItem onClick={() => navigate("/orders")}>
                Your Orders
              </ProfileMenuItem>
              <ProfileMenuItem onClick={() => navigate("/cart")}>
                Your Cart
              </ProfileMenuItem>
              <ProfileMenuItem onClick={() => navigate("/wishlist")}>
                Your Wishlist
              </ProfileMenuItem>
              <ProfileMenuItem onClick={handleSignout}>
                Sign Out
              </ProfileMenuItem>
            </ProfileMenu>
          </MenuItem>
        </Right>
      </Wrapper>
    </Container>
  );
}

const Container = styled.div`
  height: 60px;
  ${mobile({ height: "50px" })}
`;

const Wrapper = styled.div`
  padding: 10px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  ${mobile({ padding: "10px 0px" })}
`;

const Left = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
`;

const Language = styled.span`
  font-size: 14px;
  cursor: pointer;
  ${mobile({ display: "none" })}
`;

const SearchContainer = styled.div`
  border: 0.5px solid lightgray;
  display: flex;
  align-items: center;
  margin-left: 25px;
  padding: 5px;
`;

const Input = styled.input`
  border: none;
  ${mobile({ width: "50px" })}
`;

const Center = styled.div`
  flex: 1;
  text-align: center;
  cursor: pointer;
`;

const Logo = styled.h1`
  font-weight: bold;
  ${mobile({ fontSize: "24px" })}
`;

const Right = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  ${mobile({ justifyContent: "center" })}
`;

const MenuItem = styled.div`
  font-size: 14px;
  cursor: pointer;
  margin-left: 25px;

  &.DropdownMenuWrapper {
    position: relative;
  }

  ${mobile({
    flex: 1,
    fontSize: "11.5px",
    marginRight: "0px",
    marginLeft: "7px",
  })}

  svg {
    ${mobile({ fontSize: "18px" })}
  }
`;

const Img = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  cursor: pointer;
  object-fit: contain;
`;

const BorderLine = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  width: 40px;
  height: 5px;
  background-color: lightseagreen;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
`;

const ProfileMenu = styled.ul`
  position: absolute;
  top: 110%;
  right: 0;
  background-color: #fff;
  border: 1px solid #ccc;
  padding: 10px;
  list-style: none;
  margin: 0;
  display: ${({ isOpen }) => (isOpen ? "block" : "none")};
  z-index: 100;
  box-shadow: 0 4px 16px 0 rgb(0 0 0/20%);
  width: 110px;
`;

const ProfileMenuItem = styled.li`
  cursor: pointer;
  margin: 5px 0;
  font-size: 14px;
  line-height: 20px;
  &:hover {
    text-decoration: underline;
  }
`;
