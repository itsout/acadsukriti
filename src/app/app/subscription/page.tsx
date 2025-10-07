"use client";
import React from "react";
import Paid from "../components/paid";
import { getPaymentClient } from "@/utils/getCookieClient";
import NotPaid from "../components/notPaid";

const Page = () => {
  const cookie = getPaymentClient();
  if (!cookie) return <NotPaid />;
  return <Paid />;
};

export default Page;
