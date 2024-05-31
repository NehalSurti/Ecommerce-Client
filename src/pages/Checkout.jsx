import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector, useDispatch } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { deleteProductFromCartAsync } from "../redux/features/cart/cartThunks";
import { mobile } from "../utils/responsive";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../services/ToastOptions";
import {
  handleRequiredFields,
  handleValidation,
} from "../services/InputValidation_Checkout";
import ArrowRightAltIcon from "@mui/icons-material/ArrowRightAlt";
import { addOrderAsync } from "../redux/features/order/orderThunks";
import { currentOrderSlice } from "../redux/features/order/orderSlice";

function Checkout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [inputs, setInputs] = useState({});
  const [street, setStreet] = useState("");
  const [country, setCountry] = useState("");
  const [postcode, setPostcode] = useState("");
  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("cash");
  const [orderUserDetails, setOrderUserDetails] = useState({});

  const cart = useSelector((state) => state.cart);
  const user = useSelector((state) => state.user.currentUser);

  function handleChange(e) {
    setSelectedAddress("");
    setInputs((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  }

  const handleProductDelete = (itemId) => {
    try {
      dispatch(deleteProductFromCartAsync({ userId: user._id, itemId }));
    } catch (error) {
      console.log("Error deleting Product from cart");
    }
  };

  async function handleClick() {
    if (handleRequiredFields(orderUserDetails)) {
      toast.error("Please fill all fields!", toastOptions);
      return;
    }

    const validationCheck = handleValidation(orderUserDetails);

    if (validationCheck.check) {
      if (orderUserDetails.paymentMethod === "cash") {
        try {
          const newOrder = await dispatch(addOrderAsync(orderUserDetails));

          if (newOrder.payload) {
            setInputs({});
            setStreet("");
            setCountry("");
            setPostcode("");
            setSelectedAddress("");
            // dispatch(deleteCartAsync(newOrder.payload.userId));
            navigate(`/success/${newOrder.payload._id}`);
          } else {
            toast.error("Error in completing the order.", toastOptions);
          }
        } catch (error) {
          toast.error("Error in completing the order.", toastOptions);
        }
      } else if (orderUserDetails.paymentMethod === "card") {
        try {
          const newOrder = await dispatch(addOrderAsync(orderUserDetails));

          if (newOrder.payload) {
            setInputs({});
            setStreet("");
            setCountry("");
            setPostcode("");
            setSelectedAddress("");
            dispatch(currentOrderSlice(newOrder.payload));
            navigate(`/stripe-checkout`);
          } else {
            toast.error("Error in completing the order.", toastOptions);
          }
        } catch (error) {
          toast.error("Error in completing the order.", toastOptions);
        }
      }
    } else {
      toast.error(validationCheck.toastMsg, toastOptions);
    }
  }

  const handleAddressChange = (event) => {
    const { value } = event.target;
    setSelectedAddress((prevAddress) => (prevAddress === value ? "" : value));

    setOrderUserDetails({
      userId: user._id,
      address: {
        Name: user.fullName,
        Add: user.address.Add,
        Country: user.address.Country,
        Postcode: user.address.Postcode,
      },
      products: cart.products,
      amounts: cart.total,
      email: user.email,
      phone: user.phone,
    });

    setInputs({});
    setStreet("");
    setCountry("");
    setPostcode("");
  };

  const handlePaymentChange = (event) => {
    const { value } = event.target;
    setSelectedPayment(value);
  };

  const handleRadioClick = (event) => {
    if (event.target.checked) {
      setSelectedAddress("");
    }
  };

  useEffect(() => {
    if (
      Object.keys(inputs).length !== 0 &&
      street !== "" &&
      country !== "" &&
      postcode !== ""
    ) {
      setOrderUserDetails({
        userId: user._id,
        address: {
          Name: inputs.fullName,
          Add: street,
          Country: country,
          Postcode: postcode,
        },
        products: cart.products,
        amounts: cart.total,
        email: inputs.email,
        phone: inputs.phone,
        paymentMethod: selectedPayment,
      });
    }
  }, [inputs, street, country, postcode, selectedPayment]);

  useEffect(() => {
    selectedAddress === "" && setOrderUserDetails({});
  }, [selectedAddress]);

  useEffect(() => {
    if (selectedAddress !== "") {
      setOrderUserDetails({
        ...orderUserDetails,
        paymentMethod: selectedPayment,
      });
    }
  }, [selectedAddress, selectedPayment]);

  return (
    <>
      {cart.products.length === 0 && (
        <Navigate to="/" replace={true}></Navigate>
      )}
      <Container>
        <Wrapper>
          <LeftSection>
            <UserInfo>
              <UserInfoTitle>Contact Information</UserInfoTitle>
              <UserInfoForm>
                <UserInfoFormPartOne>
                  <UserInfoFormItem>
                    <UserInfoFormItemlabel>Full Name</UserInfoFormItemlabel>
                    <UserInfoFormItemInput
                      name="fullName"
                      type="text"
                      value={
                        Object.keys(inputs).length !== 0 ? inputs.fullName : ""
                      }
                      placeholder="Enter Fullname..."
                      onChange={handleChange}
                    />
                  </UserInfoFormItem>
                  <UserInfoFormItem>
                    <UserInfoFormItemlabel>Email</UserInfoFormItemlabel>
                    <UserInfoFormItemInput
                      name="email"
                      type="email"
                      value={
                        Object.keys(inputs).length !== 0 ? inputs.email : ""
                      }
                      placeholder="Enter Email..."
                      onChange={handleChange}
                    />
                  </UserInfoFormItem>
                  <UserInfoFormItem>
                    <UserInfoFormItemlabel>Phone</UserInfoFormItemlabel>
                    <UserInfoFormItemInput
                      name="phone"
                      type="text"
                      value={
                        Object.keys(inputs).length !== 0 ? inputs.phone : ""
                      }
                      placeholder="Enter Phone..."
                      onChange={handleChange}
                    />
                  </UserInfoFormItem>

                  <UserInfoFormItem style={{ width: "100%" }}>
                    <UserInfoFormItemlabel>
                      Shipping Address
                    </UserInfoFormItemlabel>
                    <AddressFormGroup>
                      <AddressFormGroupLabel htmlFor="street">
                        Street:
                      </AddressFormGroupLabel>
                      <AddressFormGroupInput
                        type="text"
                        id="street"
                        placeholder="Enter Street..."
                        value={street}
                        onChange={(e) => {
                          setStreet(e.target.value);
                          setSelectedAddress("");
                        }}
                      />
                    </AddressFormGroup>
                    <AddressFormGroup>
                      <AddressFormGroupLabel htmlFor="country">
                        Country:
                      </AddressFormGroupLabel>
                      <AddressFormGroupInput
                        type="text"
                        id="country"
                        placeholder="Enter Country..."
                        value={country}
                        onChange={(e) => {
                          setCountry(e.target.value);
                          setSelectedAddress("");
                        }}
                      />
                    </AddressFormGroup>
                    <AddressFormGroup>
                      <AddressFormGroupLabel htmlFor="postcode">
                        Postcode:
                      </AddressFormGroupLabel>
                      <AddressFormGroupInput
                        type="text"
                        id="postcode"
                        placeholder="Enter Postcode..."
                        value={postcode}
                        onChange={(e) => {
                          setPostcode(e.target.value);
                          setSelectedAddress("");
                        }}
                      />
                    </AddressFormGroup>
                  </UserInfoFormItem>
                </UserInfoFormPartOne>
              </UserInfoForm>
              <UserInfoFormPartTwo>
                <UserInfoFormPartTwoTitle>Addresses</UserInfoFormPartTwoTitle>
                <UserInfoFormPartTwoSpan>
                  Select Existing Address :
                </UserInfoFormPartTwoSpan>
                <UserInfoFormPartTwoRadio>
                  <UserInfoFormPartTwoRadioLeft>
                    <UserInfoFormPartTwoRadioInput
                      type="radio"
                      id={`address-${user?._id}`}
                      name="existing-address"
                      value={user?._id}
                      checked={selectedAddress === user?._id}
                      onChange={handleAddressChange}
                      onClick={handleRadioClick}
                    />
                    <UserInfoFormPartTwoRadioLabel
                      htmlFor={`address-${user?._id}`}
                    >
                      <UserInfoFormPartTwoRadioAddress>
                        <RadioAddressFullName>
                          {user?.fullName}
                        </RadioAddressFullName>
                        <br></br>
                        {user?.email}
                        <br></br>
                        {user?.address?.Add}
                        <br></br>
                        {user?.address?.Country}
                        <br></br>
                        {user?.address?.Postcode}
                      </UserInfoFormPartTwoRadioAddress>
                    </UserInfoFormPartTwoRadioLabel>
                  </UserInfoFormPartTwoRadioLeft>
                  <UserInfoFormPartTwoRadioRight>
                    <span>Phone</span> : {user?.phone}
                  </UserInfoFormPartTwoRadioRight>
                </UserInfoFormPartTwoRadio>
              </UserInfoFormPartTwo>
              <UserInfoFormPartThree>
                <UserInfoFormPartThreeTitle>
                  Payment Methods
                </UserInfoFormPartThreeTitle>
                <UserInfoFormPartThreeSpan>
                  Select One :
                </UserInfoFormPartThreeSpan>
                <UserInfoFormPartThreeRadio>
                  <UserInfoFormPartThreeRadioOne>
                    <UserInfoFormPartThreeRadioInput
                      type="radio"
                      id="cash"
                      name="cash"
                      value="cash"
                      checked={selectedPayment === "cash"}
                      onChange={handlePaymentChange}
                    />
                    <UserInfoFormPartThreeRadioLabel htmlFor={"cash"}>
                      Cash
                    </UserInfoFormPartThreeRadioLabel>
                  </UserInfoFormPartThreeRadioOne>
                  <UserInfoFormPartThreeRadioTwo>
                    <UserInfoFormPartThreeRadioInput
                      type="radio"
                      id="card"
                      name="card"
                      value="card"
                      checked={selectedPayment === "card"}
                      onChange={handlePaymentChange}
                    />
                    <UserInfoFormPartThreeRadioLabel htmlFor="card">
                      Card Payment
                    </UserInfoFormPartThreeRadioLabel>
                  </UserInfoFormPartThreeRadioTwo>
                </UserInfoFormPartThreeRadio>
              </UserInfoFormPartThree>
            </UserInfo>
          </LeftSection>
          <RightSection>
            <RightSectionTitle>Your Cart</RightSectionTitle>
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

                        <ProductColorSpan>
                          <b>Color :</b>
                          <ProductColor color={product.color}></ProductColor>
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
                      <ProductPrice>₹{product.totalPrice}</ProductPrice>
                      <ProductHandling>
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
            </Info>
            <Summary>
              <SummaryItem>
                <SummaryItemText>Subtotal</SummaryItemText>
                <SummaryItemPrice>₹{cart.total}</SummaryItemPrice>
              </SummaryItem>
              <SummaryItem>
                <SummaryItemText>Shipping</SummaryItemText>
                <SummaryItemPrice>₹5.90</SummaryItemPrice>
              </SummaryItem>
              <SummaryItem>
                <SummaryItemText>Discount</SummaryItemText>
                <SummaryItemPrice>₹-5.90</SummaryItemPrice>
              </SummaryItem>
              <SummaryItem type="total">
                <SummaryItemText>Total</SummaryItemText>
                <SummaryItemPrice>₹{cart.total}</SummaryItemPrice>
              </SummaryItem>
              <Button onClick={handleClick}>COMPLETE ORDER</Button>
              <SummaryContinueShopping onClick={() => navigate("/")}>
                or Continue Shopping <ArrowRightAltIcon></ArrowRightAltIcon>
              </SummaryContinueShopping>
            </Summary>
          </RightSection>
        </Wrapper>
      </Container>
      <ToastContainer></ToastContainer>
    </>
  );
}

export default Checkout;

const Container = styled.div`
  width: 100vw;
  /* height: 100vh; */
  display: flex;
  /* align-items: center; */
  justify-content: center;
  padding: 20px;
  background-color: #f8f9fa !important;
`;

const Wrapper = styled.div`
  width: 85%;
  /* height: 90%; */
  display: flex;
  justify-content: space-between;
`;

const LeftSection = styled.div`
  height: max-content;
  width: 55%;
  border: 1px solid lightgray;
  border-radius: 10px;
  background-color: white;
`;

const UserInfo = styled.div`
  padding: 20px;
  width: 100%;
`;

const UserInfoTitle = styled.h2`
  padding-left: 15px;
`;

const UserInfoForm = styled.form`
  display: flex;
  flex-direction: column;
  margin-top: 15px;
  padding-bottom: 20px;
  border-bottom: 1px solid lightgray;
`;

const UserInfoFormPartOne = styled.div`
  display: flex;
  flex-wrap: wrap;
  column-gap: 2%;
  row-gap: 5px;
  justify-content: space-between;
  padding: 0 15px;
`;

const UserInfoFormItem = styled.div`
  width: 300px;
  display: flex;
  flex-direction: column;
  margin-top: 10px;
`;

const UserInfoFormItemlabel = styled.label`
  margin-bottom: 5px;
  font-size: 14px;
  font-weight: 600;
  color: black;
`;

const UserInfoFormItemInput = styled.input`
  height: 20px;
  padding: 15px;
  border: 1px solid gray;
  border-radius: 5px;
`;

const UserInfoFormSelect = styled.select`
  width: 20%;
`;

const UserInfoFormOption = styled.option``;

const AddressFormGroup = styled.div`
  margin-bottom: 5px;
`;

const AddressFormGroupLabel = styled.label`
  font-size: 14px;
  font-weight: 350;
  color: black;
  display: inline-block;
  width: 70px;
`;

const AddressFormGroupInput = styled.input`
  height: 10px;
  padding: 10px;
  border: 1px solid gray;
  border-radius: 5px;
`;

const UserInfoFormPartTwo = styled.div`
  padding-bottom: 10px;
  border-bottom: 1px solid lightgray;
`;

const UserInfoFormPartTwoTitle = styled.h3`
  padding: 20px 10px 10px 10px;
`;

const UserInfoFormPartTwoSpan = styled.span`
  padding: 10px;
  font-size: 14px;
`;

const UserInfoFormPartTwoRadio = styled.div`
  padding: 10px;
  border: 1px solid lightgray;
  margin: 5px 0 10px 0;
  display: flex;
`;
const UserInfoFormPartTwoRadioLeft = styled.div`
  flex: 4;
`;

const UserInfoFormPartTwoRadioInput = styled.input`
  cursor: pointer;
`;

const UserInfoFormPartTwoRadioLabel = styled.label`
  padding: 10px;
`;

const UserInfoFormPartTwoRadioAddress = styled.div`
  display: inline-flex;
  font-weight: 350;
  font-size: 14px;
`;

const RadioAddressFullName = styled.b`
  display: contents;
`;

const RadioAddressEmail = styled.b`
  display: contents;
`;

const UserInfoFormPartTwoRadioRight = styled.div`
  flex: 1;
  font-weight: 350;
  font-size: 14px;

  span {
    font-weight: 500;
  }
`;

const UserInfoFormPartThree = styled.div``;

const UserInfoFormPartThreeTitle = styled.h3`
  padding: 20px 10px 10px 10px;
`;

const UserInfoFormPartThreeSpan = styled.span`
  padding: 10px;
  font-size: 14px;
`;

const UserInfoFormPartThreeRadio = styled.div`
  padding: 10px;
  border: 1px solid lightgray;
  margin: 5px 0 10px 0;
  display: flex;
  flex-direction: column;
`;

const UserInfoFormPartThreeRadioOne = styled.div`
  margin: 0 0 5px 0;
`;

const UserInfoFormPartThreeRadioTwo = styled.div`
  margin: 5px 0 0 0;
`;

const UserInfoFormPartThreeRadioInput = styled.input`
  cursor: pointer;
`;

const UserInfoFormPartThreeRadioLabel = styled.label`
  padding: 10px;
  font-weight: 500;
  font-size: 14px;
`;

const RightSection = styled.div`
  /* background-color: yellow; */
  height: max-content;
  width: 40%;
  border: 1px solid lightgray;
  border-radius: 10px;
  padding: 15px 0;
  background-color: white;
`;

const RightSectionTitle = styled.h2`
  padding-left: 20px;
  margin-bottom: 15px;
`;

const Info = styled.div`
  /* flex: 3; */
  width: 95%;
  margin: auto;
`;

const Product = styled.div`
  display: flex;
  justify-content: space-between;
  /* ${mobile({ flexDirection: "column" })} */
  border-bottom: 1px solid lightgray;
  padding: 10px 10px 10px 0px;
`;

const ProductDetail = styled.div`
  flex: 5;
  display: flex;
`;

const ImageContainer = styled.div``;

const Image = styled.img`
  width: 80px;
  height: 80px;
  object-fit: contain;
`;

const Details = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const ProductName = styled.span`
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;

  &:hover {
    color: #2874f0;
  }
`;

const ProductColorSpan = styled.span`
  display: flex;
  align-items: center;
  letter-spacing: 0.5px;
  font-size: 14px;

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

const ProductHandling = styled.div`
  display: flex;
  gap: 10px;
  padding: 5px 5px 0px 5px;
`;

const ProductDelete = styled.span`
  font-size: 10px;
  font-weight: 600;
  cursor: pointer;
  color: #007185 !important;

  &:hover {
    text-decoration: underline;
  }
`;

const Summary = styled.div`
  padding: 0px 20px 0 20px;
  height: max-content;
  width: 100%;
`;

const SummaryItem = styled.div`
  margin: ${(props) =>
    props.type === "total" ? "5px 0px 5px 0px" : "5px 0px "};
  display: flex;
  justify-content: space-between;
  font-weight: ${(props) => props.type === "total" && "500"};
  font-size: ${(props) => props.type === "total" && "16px"};
  border-top: ${(props) => props.type === "total" && "1px dotted gray"};
  padding-top: ${(props) => props.type === "total" && "10px"};
`;

const SummaryItemText = styled.span`
  margin-left: 5px;
`;

const SummaryItemPrice = styled.span`
  font-size: 14px;
  line-height: 24px;
  font-weight: 600;
`;

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

const SummaryContinueShopping = styled.p`
  text-align: center;
  margin-top: 10px;
  display: flex;
  justify-content: center;
  cursor: pointer;

  &:hover {
    color: #2874f0;
    font-weight: 600;
  }
`;
