"use client";
import {
  Alert,
  Box,
  Button,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import Link from "next/link";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { SetStateAction, useEffect, useMemo, useState } from "react";
import axios from "axios";
import moment from "moment";
import {
  IconDeviceFloppy,
  IconFlask,
  IconListCheck,
  IconPrinter,
  IconUser,
  IconUserPlus,
} from "@tabler/icons-react";
moment.locale("th");
import { useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
import { LoadingButton } from "@mui/lab";
import toast, { Toaster } from "react-hot-toast";
import { useJwt } from "react-jwt";

const UserPage = (params: any) => {
  const token: any =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const { decodedToken, isExpired } = useJwt<any>(token);
  // const orgId = decodedToken?.orgId
  if (isExpired) {
    window.location.assign("/authentication/login");
  }

  dayjs.extend(buddhistEra);
  dayjs.locale("th");

  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState<Dayjs | null>(dayjs()); //2021-03-15
  const [selectedVisitNo, setSelectedVisitNo] = useState<any>();
  const [labTypeId, setUserTypeId] = useState<any>();
  const [username, setUsername] = useState<any>();
  // const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const strDate = dayjs(date).format("DD MMMM BBBB");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [users, setUsers] = useState({ blogs: [] });
  const [user, setUser] = useState<any>();
  const [err, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<any>();
  const [fullname, setFullname] = useState<any>();
  const [telephone, setTelephone] = useState<any>();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: async () => {
      let uri = `/api/org`;
      try {
        const data = await axios.get(uri, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + token,
          },
        });
        return {
          orgName: data.data[0].orgName,
          orgShortName: data.data[0].orgShortName,
          orgAddress: data.data[0].orgAddress,
          orgDocNo: data.data[0].orgDocNo,
        };
      } catch (error) {
        console.error(error);
      }
    },
  });

  const onSubmit = (data: any) => {
    setLoading(true);

    let uri = `/api/org`;
    fetch(uri, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        if (data.status == "success") {
          toast.success(data.message);
        } else {
          toast.error(data.error.message);
        }
      })
      .catch(function (error) {
        console.error(JSON.stringify(error));
      });
  };

  return (
    <PageContainer
      title="LAB 2.0 : Organization Page"
      description="this is Sample page"
    >
      <Toaster />
      <DashboardCard title={`ข้อมูลหน่วยงาน`}>
        <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
          <CardContent>
            <Toaster />
            <Grid item xs={12} md={12} lg={12}>
              <Grid container spacing={3} rowSpacing={2}>
                <Grid container item spacing={2}>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <TextField
                        InputLabelProps={{ shrink: true }}
                        label="ชื่อเต็มหน่วยงาน"
                        variant="outlined"
                        {...register("orgName")}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <TextField
                        InputLabelProps={{ shrink: true }}
                        label="ชื่อย่อหน่วยงาน"
                        variant="outlined"
                        {...register("orgShortName")}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <TextField
                        InputLabelProps={{ shrink: true }}
                        label="ที่อยู่"
                        variant="outlined"
                        {...register("orgAddress")}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={6}>
                    <FormControl fullWidth>
                      <TextField
                        InputLabelProps={{ shrink: true }}
                        label="เลขที่หนังสือ"
                        variant="outlined"
                        {...register("orgDocNo")}
                      />
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <LoadingButton
                      type="submit"
                      color="primary"
                      onClick={handleSubmit(onSubmit)}
                      loading={loading}
                      loadingPosition="start"
                      startIcon={<IconDeviceFloppy />}
                      variant="contained"
                    >
                      บันทึก
                    </LoadingButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </CardContent>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default UserPage;
