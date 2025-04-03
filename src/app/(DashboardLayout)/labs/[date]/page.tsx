"use client";
import {
  Box,
  Button,
  CardContent,
  Chip,
  Grid,
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
import { SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { IconUser, IconUserPlus } from "@tabler/icons-react";
moment.locale("th");
import { useForm } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);

const LabPage = (params: any) => {
  const { register } = useForm();
  dayjs.locale("th");

  const [date, setDate] = useState<Dayjs | null>(
    dayjs(params["params"]["date"])
  ); //2021-03-15
  // const [value, setValue] = React.useState<Dayjs | null>(dayjs('2022-04-17'));
  console.log("date = " + date);
  console.log("dayjs = " + dayjs(date).format("YYYY-MM-DD"));
  let dayJs = dayjs(date).format("YYYY-MM-DD");
  // const [value, setValue] = useState(null);
  // const strDate = ' วันที่ '+moment(dayJs).format('DD')+' เดือน '+moment(dayJs).format('MMMM')+' พ.ศ. '+moment(dayJs).add(543, 'year').format('YYYY');
  const strDate = dayjs(date).format("DD MMMM BBBB");
  // const initDate = "2021-03-15"

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [labs, setLabs] = useState({ blogs: [] });

  const [search, setSearch] = useState<any>("");
  let i = 1;

  const [pg, setpg] = useState<number>(0);
  const [rpg, setrpg] = useState<number>(10);

  function handleChangePage(event: any, newpage: React.SetStateAction<number>) {
    setpg(newpage);
  }

  function handleChangeRowsPerPage(event: { target: { value: string } }) {
    setrpg(parseInt(event.target.value, 10));
    setpg(0);
  }

  const fetchLabs = async () => {
    setIsLoading(true);
    let paramsDate = dayjs(date).format("YYYY-MM-DD");
    console.log("paramsDate = " + paramsDate);
    let uri = `/api/labs/date/${paramsDate}`;
    console.log(uri);
    try {
      const { data } = await axios.get(uri);
      console.log(data);
      setLabs({ blogs: data });
      setIsLoading(false);
      // setClassLevelName(data.classLevelName)
    } catch (error) {}
  };

  useEffect(() => {
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
      title="LAB 2.0 :  Lab Page"
      description="this is Sample page"
    >
      <DashboardCard
        title={`รายชื่อผู้มารับบริการ รายการตรวจแล็บ ${strDate}`}
        action={
          <Box mb={1}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="วันที่"
                value={date}
                onChange={(newValue) => setDate(newValue)}
              />
            </LocalizationProvider>
          </Box>
        }
      >
        <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
          <CardContent>
            <Grid item xs={12} md={12} lg={12}>
              <form noValidate autoComplete="off">
                <Grid container spacing={5}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="ค้นหา"
                      placeholder="ค้นหาเลขที่บัตรประชาชน-ชื่อผู้มารับบริการ"
                      {...register("search", {
                        onChange: (e) => {
                          setSearch(e.target.value);
                        },
                        onBlur: (e) => {},
                      })}
                    />
                  </Grid>
                </Grid>
              </form>
            </Grid>
            <Table
              aria-label="simple table"
              sx={{
                whiteSpace: "nowrap",
                mt: 2,
              }}
            >
              <TableHead>
                <TableRow>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      HN-CID
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      ชื่อ-สกุล
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      เพศ
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      อายุ
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      สิทธิ์การรักษา
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      ประเภทแล็บ
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      จัดการ
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {isLoading ? (
                  <TableRowsLoader rowsNum={5} />
                ) : (
                  labs.blogs
                    .filter((row: any) => {
                      return search.toLowerCase() === ""
                        ? row
                        : row["patientName"].toLowerCase().includes(search) ||
                            row["idcard"].includes(search);
                    })
                    .slice(pg * rpg, pg * rpg + rpg)
                    .map((row: any, index: any) => (
                      <TableRow key={row.visitno}>
                        <TableCell align="center">
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Box>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {row.pid}
                              </Typography>
                              <Typography
                                color="textSecondary"
                                sx={{
                                  fontSize: "13px",
                                }}
                              >
                                {row.idcard}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "center",
                            }}
                          >
                            <Box>
                              <Typography variant="subtitle2" fontWeight={600}>
                                {row.patientName}
                              </Typography>
                              <Typography
                                color="textSecondary"
                                sx={{
                                  fontSize: "13px",
                                }}
                              >
                                {dayjs(row.datecheck).format("DD/MM/BBBB")}{" "}
                                {row.timestart}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="center">
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            <Chip
                              sx={{
                                px: "4px",
                                backgroundColor: row.sex == 1 ? "green" : "red",
                                color: "#fff",
                              }}
                              size="small"
                              label={row.sex == 1 ? "ชาย" : "หญิง"}
                            ></Chip>
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            {row.AGE} ปี
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            {row.rightname}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Typography variant="h6">${row.budget}k</Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Link href={`visit-no/${row["visitno"]}`}>
                            <Button
                              color="primary"
                              variant="outlined"
                              startIcon={<IconUser width={18} />}
                            >
                              รายละเอียด
                            </Button>
                          </Link>
                          {row["visitno"]}
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 20, 50]}
              component="div"
              count={labs.blogs.length}
              rowsPerPage={rpg}
              page={pg}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </CardContent>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default LabPage;
