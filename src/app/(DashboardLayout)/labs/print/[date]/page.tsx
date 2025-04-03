"use client";
import {
  Avatar,
  Box,
  Button,
  CardContent,
  Chip,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Theme,
  Typography,
  createStyles,
  makeStyles,
} from "@mui/material";
import Link from "next/link";
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { SetStateAction, useEffect, useRef, useState } from "react";
import axios from "axios";
import moment from "moment";
import {
  IconCheckbox,
  IconPrinter,
  IconSquare,
  IconUser,
  IconUserPlus,
} from "@tabler/icons-react";
moment.locale("th");
import { useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);
import ReactToPrint from "react-to-print";
import { roboto_mono, sarabun } from "../../../../fonts";
import localFont from "next/font/local";

const sarabunT9 = localFont({
  src: "./../../../../fonts/THSarabunIT9.ttf",
  display: "swap",
});

const sarabunPSK = localFont({
  src: "./../../../../fonts/THSarabunPSK.ttf",
  display: "swap",
});

const getPageMargins = () => {
  return `@page { margin: 4 !important; }`;
};

const LabPage = (params: any) => {
  dayjs.locale("th");
  let i = 1;

  const username: any =
    typeof window !== "undefined" ? localStorage.getItem("username") : null;
  const componentRef = useRef<HTMLDivElement>(null);
  const [date, setDate] = useState<any>(params["params"]["date"]); //2021-03-15
  const [dense, setDense] = useState(true);
  let dayJs = dayjs(date).format("YYYY-MM-DD");
  const strDate = " วันที่ " + dayjs(date).format("DD MMMM BBBB");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [labs, setLabs] = useState<any>({ blogs: [] });
  const [org, setOrg] = useState<any>();
  const [userInfo, setUserInfo] = useState<any>();

  const fetchLabs = async () => {
    setIsLoading(true);
    let uri = `/api/labs/date/${date}`;
    console.log(uri);
    try {
      const { data } = await axios.get(uri);
      setLabs({ blogs: data });
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchOrg = async () => {
    let uri = `/api/org`;
    try {
      const { data } = await axios.get(uri);
      setOrg(data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchUserInfo = async () => {
    let uri = `/api/users/${username}`;
    try {
      const { data } = await axios.get(uri);
      setUserInfo(data[0]);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchUserInfo();
    fetchOrg();
    fetchLabs();
  }, [date, strDate]);

  const TableRowsLoader = ({ rowsNum }: { rowsNum: any }) => {
    return [...Array(rowsNum)].map((row, index) => (
      <TableRow key={index}>
        <TableCell component="th" scope="row">
          <Skeleton animation="wave" variant="text" />
        </TableCell>
        <TableCell>
          <Skeleton animation="wave" variant="text" />
        </TableCell>
        <TableCell>
          <Skeleton animation="wave" variant="text" />
        </TableCell>
        <TableCell>
          <Skeleton animation="wave" variant="text" />
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <PageContainer
      title={`รายการตรวจแล็บ ${strDate}`}
      description="this is Sample page"
    >
      <Box>
        <Grid container spacing={3}>
          <Grid item xs={12} lg={12}>
            <DashboardCard title={`รายการตรวจแล็บ ${strDate}`}>
              <Box
                sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}
              >
                <div ref={componentRef}>
                  <Grid item xs={12} lg={12}>
                    <Grid container spacing={3} mt={5}>
                      <Grid item xs={5}>
                        <Typography
                          color="textPrimary"
                          fontSize={20}
                          fontWeight={500}
                          className={sarabunT9.className}
                        >
                          ที่ {org?.orgDocNo}
                        </Typography>
                      </Grid>
                      <Grid item xs={2}>
                        <Avatar
                          src={"/images/garuda.png"}
                          variant="square"
                          sx={{
                            mt: "-60px",
                            height: 80,
                            width: 80,
                            position: "absolute",
                          }}
                        />
                      </Grid>
                      <Grid item xs={5}>
                        <Typography
                          color="textPrimary"
                          fontSize={20}
                          fontWeight={500}
                          className={sarabunT9.className}
                        >
                          {org?.orgName}
                        </Typography>
                        <Typography
                          color="textPrimary"
                          fontSize={20}
                          fontWeight={500}
                          className={sarabunT9.className}
                        >
                          {org?.orgAddress}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} lg={12}>
                    <Grid container spacing={3}>
                      <Grid item xs={5}></Grid>
                      <Grid item xs={6}>
                        <Typography
                          color="textPrimary"
                          fontSize={20}
                          fontWeight={500}
                          className={sarabunT9.className}
                          sx={{ textIndent: "40px" }}
                        >
                          {strDate}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs={12} lg={12}>
                    <Grid item lg={12}>
                      <Typography
                        color="textPrimary"
                        fontSize={20}
                        fontWeight={500}
                        className={sarabunT9.className}
                      >
                        เรื่อง ส่งตรวจวิเคราะห์และอ่านผล
                      </Typography>
                      <Typography
                        color="textPrimary"
                        fontSize={20}
                        fontWeight={500}
                        className={sarabunT9.className}
                      >
                        เรียน ผู้อำนวยการโรงพยาบาลบาเจาะ
                      </Typography>
                      <Typography
                        color="textPrimary"
                        fontSize={20}
                        fontWeight={500}
                        className={sarabunT9.className}
                      >
                        สิ่งที่ส่งมาด้วย........................จำนวน..............ราย
                      </Typography>
                      <Typography
                        color="textPrimary"
                        fontSize={20}
                        fontWeight={500}
                        className={sarabunT9.className}
                        sx={{ textIndent: 70 }}
                      >
                        ด้วย{org?.orgName}
                        ยังขาดอุปกรณ์และน้ำยาในการตรวจวิเคราะห์ทางห้องปฏิบัติการ
                        ไม่สามารถทำการวิเคราะห์ได้
                        จึงขอส่งตัวอย่างเพื่อตรวจวิเคราะห์และอ่านผลต่อไป
                      </Typography>
                    </Grid>
                  </Grid>
                  <CardContent>
                    <Grid container spacing={3} sx={{ ml: 0, mr: 4 }}>
                      <List dense={dense}>
                        {labs.blogs.map((row: any, index: any) => (
                          <ListItem key={index}>
                            <Grid item xs={4}>
                              <Typography
                                color="textPrimary"
                                fontSize={20}
                                fontWeight={500}
                                className={sarabunPSK.className}
                              >
                                {i++}.{row["patientName"]} อายุ {row["AGE"]} ปี
                              </Typography>
                              <Typography
                                color="textPrimary"
                                fontSize={20}
                                fontWeight={500}
                                className={sarabunPSK.className}
                              >
                                HN {row["pid"]} cid {row.idcard}
                              </Typography>
                              <Typography
                                color="textPrimary"
                                fontSize={20}
                                fontWeight={500}
                                className={sarabunPSK.className}
                              >
                                สิทธ์ {row.rightname}
                              </Typography>
                            </Grid>
                            <Grid item xs={8} color="textPrimary" fontSize={12}>
                              <Typography
                                color="textPrimary"
                                fontSize={20}
                                fontWeight={500}
                                className={sarabunPSK.className}
                                sx={{ position: "relative" }}
                              >
                                <Typography
                                  fontWeight={600}
                                  sx={{ float: "left", mr: 2 }}
                                >
                                  {row["labTypeName"]}
                                </Typography>{" "}
                                [_] {row["labItemNames"]} อืนๆ..........
                              </Typography>
                            </Grid>
                          </ListItem>
                        ))}
                      </List>
                    </Grid>
                    <Grid item xs={12} lg={12}>
                      <Grid item lg={12}>
                        <Typography
                          color="textPrimary"
                          fontSize={20}
                          fontWeight={500}
                          className={sarabunPSK.className}
                          sx={{ textIndent: 70 }}
                        >
                          เมื่อดำเนินการเสร็จเรียบร้อยแล้วทาง{org?.orgName}
                          จะมาขอรับผลการตรวจในวันถัดไปจึงเรียนมาเพื่อโปรดพิจารณาอนุเคราะห์
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid item xs={12} lg={12}>
                      <Grid container spacing={3} sx={{ pt: 4, pb: 10 }}>
                        <Grid item xs={6}></Grid>
                        <Grid item xs={6}>
                          <Typography
                            color="textPrimary"
                            fontSize={20}
                            fontWeight={500}
                            className={sarabunPSK.className}
                          >
                            ขอแสดงความนับถือ
                          </Typography>
                        </Grid>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <Grid
                    container
                    spacing={3}
                    sx={{
                      position: "relative",
                      clear: "both",
                      left: 0,
                      bottom: 0,
                      width: "100%",
                    }}
                  >
                    <Grid item lg={12}>
                      <Typography
                        color="textPrimary"
                        fontSize={20}
                        fontWeight={500}
                        className={sarabunPSK.className}
                      >
                        ผู้ติดต่อ {userInfo?.fullname} โทรศัพท์{" "}
                        {userInfo?.telephone} อีเมล {userInfo?.email}
                      </Typography>
                    </Grid>
                  </Grid>
                </div>

                <Grid
                  container
                  spacing={3}
                  sx={{
                    position: "relative",
                    clear: "both",
                    left: 0,
                    bottom: 0,
                    width: "100%",
                  }}
                >
                  <Grid item lg={12}>
                    <ReactToPrint
                      pageStyle={
                        "@media print { body { -webkit-print-color-adjust: exact; } @page { size: A4; margin-left: 2.5cm; margin-top:1.5cm; margin-right:1.5cm; !important }}"
                      }
                      trigger={() => (
                        <Button
                          startIcon={<IconPrinter />}
                          variant="outlined"
                          color="primary"
                          sx={{ float: "right" }}
                        >
                          พิมพ์ปะหน้า
                        </Button>
                      )}
                      content={() => componentRef.current}
                    />
                  </Grid>
                </Grid>
              </Box>
            </DashboardCard>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default LabPage;
