import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Button,
  Stack,
  Checkbox,
  FormHelperText,
} from "@mui/material";
import Link from "next/link";

import CustomTextField from "@/app/(DashboardLayout)/components/forms/theme-elements/CustomTextField";
import { LoadingButton } from "@mui/lab";

interface loginType {
  title?: string;
  subtitle?: JSX.Element | JSX.Element[];
  subtext?: JSX.Element | JSX.Element[];
}

const AuthLogin = ({ title, subtitle, subtext }: loginType) => {
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
          // localStorage.setItem('token', data.token)
          localStorage.setItem("username", data.username);
          localStorage.setItem("fullname", data.fullname);
          // localStorage.setItem('userTypeId', data.userTypeId)
          // localStorage.setItem('userTypeName', data.userTypeName)
          // localStorage.setItem('orgId', data.orgId)
          // localStorage.setItem('iteach_avatar', data.avatar)
          document.location.href = "/";
        } else {
          setError(true);
          setLoading(false);
          setMessage(data.message);
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  return (
    <>
      {title ? (
        <Typography fontWeight="700" variant="h2" mb={1}>
          {title}
        </Typography>
      ) : null}

      {subtext}
      <form noValidate autoComplete="off" onSubmit={handleSubmit(onSubmit)}>
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
            <CustomTextField
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
            <CustomTextField
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
      </form>
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
      {subtitle}
    </>
  );
};

export default AuthLogin;
