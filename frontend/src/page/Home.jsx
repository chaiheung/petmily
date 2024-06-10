import React from "react";
import { Box } from "@chakra-ui/react";
import { Outlet } from "react-router-dom";

export function Home() {
  return (
    <Box>
      <Outlet />
    </Box>
  );
}
