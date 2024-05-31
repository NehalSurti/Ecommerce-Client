import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { loginAsync, registerAsync } from "../redux/features/user/userThunks";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptions } from "../services/ToastOptions";
import {
  handleRequiredFields,
  handleValidation,
} from "../services/InputValidation_Register";
import { mobile } from "../utils/responsive";

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(true);

  const { isFetching } = useSelector((state) => state.user);
  const user = useSelector((state) => state.user.currentUser);

  async function handleClick(e) {
    e.preventDefault();
    setLoading(true);

    if (
      handleRequiredFields(fullName, username, email, password, confirmPassword)
    ) {
      toast.error("Please fill all fields!", toastOptions);
      setLoading(false);
      return;
    }

    const validationCheck = handleValidation(
      fullName,
      email,
      password,
      confirmPassword
    );

    if (validationCheck.check) {
      try {
        const registerUser = {
          fullName,
          username,
          email,
          password,
        };

        const register = await dispatch(registerAsync(registerUser));

        if (register.payload) {
          setLoading(false);
          setFullName("");
          setUsername("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          dispatch(loginAsync({ username, password }));
        } else {
          setLoading(false);
          toast.error("Register not successfull", toastOptions);
        }
      } catch (error) {
        setLoading(false);
        toast.error("Register not successfull", toastOptions);
      }
    } else {
      setLoading(false);
      toast.error(validationCheck.toastMsg, toastOptions);
    }
  }

  useEffect(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    user && navigate("/");
  }, [user]);

  return (
    <>
      <Container>
        {!loading && (
          <Wrapper>
            <Title>CREATE AN ACCOUNT</Title>
            <Form>
              <Input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name"
              ></Input>
              <Input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
              ></Input>
              <Input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
              ></Input>
              <Input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                placeholder="Password"
              ></Input>
              <Input
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                type="password"
                placeholder="Confirm Password"
              ></Input>
            </Form>
            <Button onClick={handleClick} disabled={isFetching}>
              CREATE
            </Button>
            <Link onClick={() => navigate("/login")}>
              ALREADY HAVE AN ACCOUNT?
            </Link>
          </Wrapper>
        )}
      </Container>
      <ToastContainer />
    </>
  );
}

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background: linear-gradient(
      rgba(255, 255, 255, 0.5),
      rgba(255, 255, 255, 0.5)
    ),
    url("https://images.pexels.com/photos/6984661/pexels-photo-6984661.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940")
      center;
  background-size: cover;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Wrapper = styled.div`
  width: 40%;
  padding: 20px;
  background-color: white;
  ${mobile({ width: "75%" })}
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 300;
  ${mobile({ marginBottom: "5px" })}
`;

const Form = styled.form`
  display: flex;
  flex-wrap: wrap;
`;

const Input = styled.input`
  flex: 1;
  min-width: 40%;
  margin: 20px 10px 0px 0px;
  padding: 10px;
  max-width: 48%;
  ${mobile({ margin: "5px" })}
`;

const Button = styled.button`
  width: 40%;
  border: none;
  padding: 15px 20px;
  background-color: teal;
  color: white;
  cursor: pointer;
  margin: 10px 0;
`;

const Link = styled.a`
  font-size: 12px;
  text-decoration: underline;
  cursor: pointer;
  display: block;
`;
