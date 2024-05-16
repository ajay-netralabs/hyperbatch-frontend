const BASE_URL = "https://shcqw7dvxecha7rf4gmpwdzf2q0mkvbi.lambda-url.us-east-2.on.aws"
// const BASE_URL = "http://localhost:8001"
const LOGIN = BASE_URL + "/login"

const REGISTER = BASE_URL + "/register"

const FORGET_PASSWORD = BASE_URL + "/forget_password"

const VERIFY_PASSWORD = BASE_URL + "/verify_password"

export async function registerUser(
    fullname: string,
    email: string,
    password: string
  ) {
    try {
      const res = await fetch(REGISTER, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullname, email, password }),
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  export async function loginUser(
    email: string,
    password: string
  ) {
    try {
      const res = await fetch(LOGIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  }

  export async function forgetPassword(email: string) {
    try {
      const res = await fetch(FORGET_PASSWORD, {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  }
  
  export async function verifyOtp(email: string, otp: number) {
    try {
      const res = await fetch(VERIFY_PASSWORD, {
        method: "POST",
        body: JSON.stringify({email, otp }),
      });
      return res;
    } catch (error) {
      console.log(error);
    }
  }