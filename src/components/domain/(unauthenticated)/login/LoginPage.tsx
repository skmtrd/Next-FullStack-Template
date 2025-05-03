"use client";

import PageContainer from "@/components/common/PageContainer";
import { authClient } from "@/lib/auth-client";
import { Box, Button } from "@mui/material";

const LoginPage = () => {
  async function handleGoogleSignIn() {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/dashboard",
      });
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <PageContainer>
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Button variant="contained" onClick={handleGoogleSignIn}>
          Googleログイン
        </Button>
      </Box>
    </PageContainer>
  );
};

export default LoginPage;
