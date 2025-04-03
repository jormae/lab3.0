"use client";
// components
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import Logo from "@/app/(DashboardLayout)/layout/shared/logo/Logo";
import AuthLogin from "../auth/AuthLogin";
import React, { useState } from "react";
import {
  Box,
  Grid,
  Card,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
  FormHelperText,
  Alert,
  TextField,
} from "@mui/material";
import Link from "next/link";

import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import { useForm } from "react-hook-form";
import { LoadingButton } from "@mui/lab";

const Login2 = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState<boolean>(false);
  const [err, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<any>();

  const onSubmit = (data: any) => {
    console.log(data);
    setLoading(true);
    let uri = `/api/users`;
    console.log(uri);
    fetch(uri, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        if (data.status == "success") {
          localStorage.setItem("username", data.username);
          localStorage.setItem("fullname", data.fullname);
          localStorage.setItem("token", data.token);
          document.location.href = "/labs";
        } else {
          setError(true);
          setLoading(false);
          setMessage(data.message);
        }
      })
      .catch((error) => {
        // console.error('Error:', error)
      });
  };

  return (
    <PageContainer title="Login" description="this is Login page">
      <Box
        sx={{
          position: "relative",
          "&:before": {
            content: '""',
            background: "radial-gradient(#d2f1df, #d3d7fa, #bad8f4)",
            backgroundSize: "400% 400%",
            animation: "gradient 15s ease infinite",
            position: "absolute",
            height: "100%",
            width: "100%",
            opacity: "0.3",
          },
        }}
      >
        <Grid
          container
          spacing={0}
          justifyContent="center"
          sx={{ height: "100vh" }}
        >
          <Grid
            item
            xs={12}
            sm={12}
            lg={4}
            xl={3}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Card
              elevation={9}
              sx={{ p: 4, zIndex: 1, width: "100%", maxWidth: "500px" }}
            >
              <Box display="flex" alignItems="center" justifyContent="center">
                <Logo />
              </Box>
              {err ? <Alert severity="error">{message}</Alert> : ""}
              <form
                noValidate
                autoComplete="off"
                onSubmit={handleSubmit(onSubmit)}
              >
                <Stack>
                  <Box>
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      component="label"
                      htmlFor="username"
                      mb="5px"
                    >
                      Username
                    </Typography>
                    <TextField
                      id="username"
                      variant="outlined"
                      fullWidth
                      {...register("username", { required: true })}
                    />
                    {errors.username && errors.username.type === "required" && (
                      <FormHelperText id="username" sx={{ color: "#d32f2f" }}>
                        Error : กรุณาใส่ชื่อบัญชี
                      </FormHelperText>
                    )}
                  </Box>
                  <Box mt="25px">
                    <Typography
                      variant="subtitle1"
                      fontWeight={600}
                      component="label"
                      htmlFor="password"
                      mb="5px"
                    >
                      Password
                    </Typography>
                    <TextField
                      id="password"
                      type="password"
                      variant="outlined"
                      fullWidth
                      {...register("password", { required: true })}
                    />
                    {errors.password && errors.password.type === "required" && (
                      <FormHelperText id="password" sx={{ color: "#d32f2f" }}>
                        Error : กรุณาใส่รหัสผ่าน
                      </FormHelperText>
                    )}
                  </Box>
                  <Stack
                    justifyContent="space-between"
                    direction="row"
                    alignItems="center"
                    my={2}
                  >
                    <FormGroup>
                      <FormControlLabel
                        control={<Checkbox defaultChecked />}
                        label="Remeber this Device"
                      />
                    </FormGroup>
                    <Typography
                      component={Link}
                      href="/"
                      fontWeight="500"
                      sx={{
                        textDecoration: "none",
                        color: "primary.main",
                      }}
                    >
                      Forgot Password ?
                    </Typography>
                  </Stack>
                </Stack>
                <Box>
                  <LoadingButton
                    fullWidth
                    type="submit"
                    color="primary"
                    onClick={handleSubmit(onSubmit)}
                    loading={loading}
                    loadingPosition="start"
                    variant="contained"
                    size="large"
                  >
                    เข้าสู่ระบบ
                  </LoadingButton>
                </Box>
              </form>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};
export default Login2;
