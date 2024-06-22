"use client";
import { signIn, useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button, Input, Label } from "@repo/ui";
const Signin = () => {
  const session = useSession();
  const router = useRouter();
  const redirected = useRef(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [checkingPassword, setCheckingPassword] = useState(false);
  const [requiredError, setRequiredError] = useState({
    emailReq: false,
    passReq: false,
  });
  const [credentials, setCredentials] = useState({ email: "", password: "" });

  function togglePasswordVisibility() {
    setIsPasswordVisible((prevState: any) => !prevState);
  }

  function handleSubmit() {}

  return (
    <div className="flex bg-black">
      <div className="w-full md:w-2/5 bg-black flex justify-center items-center h-screen max-sm:hidden max-md:hidden">
        <div>
          <h1 className="text-4xl font-bold mb-4 text-white">One For All</h1>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(9)].map((_, index) => (
              <div key={index} className="opacity-50">
                <i className="fas fa-arrow-down fa-3x"></i>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="w-full h-screen md:w-3/5 bg-gray-900 flex justify-center items-center">
        <div className="w-full max-w-md">
          <div className="p-5">
            <h2 className="text-2xl font-semibold mb-2 text-white text-center">
              Log In
            </h2>
          </div>
          <div className=" mb-4  justify-center py-1 sm:px-6 lg:px-8 ">
            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
              <div className="bg-white py-12 px-4 shadow sm:rounded-lg sm:px-10">
                <div className="flex flex-col items-center justify-center gap-4">
                  <p className="font-normal text-2xl text-gray-900">Welcome</p>

                  <p className="font-light text-sm text-gray-600">
                    Log in to continue to One-For-All.
                  </p>
                  <div className="grid w-full items-center gap-4">
                    <div className="flex flex-col gap-4">
                      <Input
                        name="email"
                        id="email"
                        placeholder="name@email.com"
                        onChange={(e) => {
                          setRequiredError((prevState) => ({
                            ...prevState,
                            emailReq: false,
                          }));
                          setCredentials((prevState) => {
                            return { ...prevState, email: e.target.value };
                          });
                        }}
                      />
                      {requiredError.emailReq && (
                        <span className=" text-red-500">Email is required</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-4 relative">
                      <div className="flex border rounded-lg">
                        <Input
                          className="border-0"
                          name="password"
                          type={isPasswordVisible ? "text" : "password"}
                          id="password"
                          placeholder="••••••••"
                          onChange={(e) => {
                            setRequiredError((prevState) => ({
                              ...prevState,
                              passReq: false,
                            }));
                            setCredentials((prevState) => {
                              return { ...prevState, password: e.target.value };
                            });
                          }}
                          onKeyDown={async (e) => {
                            if (e.key === "Enter") {
                              setIsPasswordVisible(false);
                              handleSubmit();
                            }
                          }}
                        />
                        <button
                          className="right-0 flex items-center px-4 text-gray-600 absolute bottom-0 h-10"
                          onClick={togglePasswordVisibility}
                        >
                          {isPasswordVisible ? (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88"
                              />
                            </svg>
                          ) : (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              strokeWidth={1.5}
                              stroke="currentColor"
                              className="w-5 h-5"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                          )}
                        </button>
                      </div>
                      {requiredError.passReq && (
                        <span className=" text-red-500">
                          Password is required
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    className="my-3 w-full text-black border border-black"
                    disabled={checkingPassword}
                    onClick={handleSubmit}
                  >
                    Login
                  </Button>

                  <button
                    type="submit"
                    className="w-full flex justify-center items-center gap-2 py-3 px-4 border rounded font-light text-md text-gray-900 hover:bg-gray-200 focus:outline-none focus:ring-2 "
                    onClick={async () => {
                      await signIn("google");
                    }}
                  >
                    <Image
                      src="/google.svg"
                      className="w-5 h-5 mr-2"
                      alt="Google Icon"
                      width={25}
                      height={25}
                    />
                    Continue with Google
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
