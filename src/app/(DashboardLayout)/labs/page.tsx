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
import { SetStateAction, useEffect, useState } from "react";
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

const LabPage = (params: any) => {
  const token: any =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const { decodedToken, isExpired } = useJwt<any>(token);
  if (isExpired) {
    window.location.assign("/authentication/login");
  }

  dayjs.extend(buddhistEra);
  dayjs.locale("th");

  const [loading, setLoading] = useState<boolean>(false);
  const [date, setDate] = useState<Dayjs | null>(dayjs()); //2021-03-15
  const [selectedVisitNo, setSelectedVisitNo] = useState<any>();
  const [labTypeId, setLabTypeId] = useState<any>();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  let dayJs = dayjs(date).format("YYYY-MM-DD");

  const strDate = dayjs(date).format("DD MMMM BBBB");
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [labs, setLabs] = useState({ blogs: [] });
  const [labTypes, setLabTypes] = useState({ blogs: [] });
  const [err, setError] = useState<boolean>(false);
  const [message, setMessage] = useState<any>();

  const [open, setOpen] = useState<boolean>(false);

  const handleClickOpen = (visitno: string, labTypeId: number, sex: number) => {
    setOpen(true);
    setSelectedVisitNo(visitno);
    setLabTypeId(labTypeId);
    fetchLabTypes(sex);
  };

  const handleClose = () => {
    setOpen(false);
  };

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

  const handleLabTypesChange = (event: any) => {
    if (event) {
      setError(false);
      setLabTypeId(event.target.value as any);
    }
  };

  const fetchLabs = async () => {
    // setIsLoading(true)

    let paramsDate = dayjs(date).format("YYYY-MM-DD");
    let uri = `/api/labs/date/${paramsDate}`;
    console.log(uri);
    try {
      const { data } = await axios.get(uri);
      setLabs({ blogs: data });
      setIsLoading(false);
    } catch (error) {}
  };

  const fetchLabTypes = async (sex: any) => {
    let uri = `/api/lab-types/${sex}`;
    try {
      const { data } = await axios.get(uri);
      setLabTypes({ blogs: data });
    } catch (error) {
      console.error(error);
    }
  };

  const onSubmit = () => {
    setLoading(true);
    const data = { labTypeId: labTypeId };
    if (!labTypeId) {
      setError(true);
      setMessage("กรุณาเลือกประเภทแล็บ");
      setLoading(false);
    } else {
      let uri = `/api/labs/visit-no/${selectedVisitNo}`;
      fetch(uri, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          if (data.status == "success") {
            toast.success(data.message);
            fetchLabs();
            setOpen(false);
            reset({ labTypeId: "" });
          } else {
            toast.error(data.message || data.errors[0].msg);
          }
        })
        .catch(function (error) {
          console.error(JSON.stringify(error));
        });
    }
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
      title="LAB 2.0 : Lab Report"
      description="this is Sample page"
    >
      <Toaster />
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
            <Dialog open={open} onClose={handleClose} fullWidth>
              <DialogTitle>ประเภทแล็บ</DialogTitle>
              <DialogContent>
                {err ? (
                  <Alert severity="error" variant="outlined">
                    {message}
                  </Alert>
                ) : (
                  ""
                )}
                <Grid item xs={12} md={12} lg={12}>
                  <Grid container spacing={5}>
                    <Grid item xs={12} mt={3}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          ประเภทแล็บ
                        </InputLabel>
                        <Select
                          value={labTypeId ?? ""}
                          label="ประเภทแล็บ"
                          onChange={handleLabTypesChange}
                        >
                          {labTypes.blogs.map((item: any) => {
                            return (
                              <MenuItem
                                key={item.labTypeId}
                                value={item.labTypeId}
                              >
                                {item.labTypeName}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleClose}>ยกเลิก</Button>
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
              </DialogActions>
            </Dialog>
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
                                backgroundColor:
                                  row.sex == 1
                                    ? "success.main"
                                    : "warning.main",
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
                        <TableCell align="center">
                          <Button
                            color={row.labTypeName ? "success" : "error"}
                            variant="outlined"
                            startIcon={<IconFlask width={18} />}
                            onClick={(e) =>
                              handleClickOpen(
                                row["visitno"],
                                row["labTypeId"],
                                row["sex"]
                              )
                            }
                            sx={{ alignContent: "right" }}
                            value={row["labTypeId"]}
                          >
                            {row.labTypeName ?? "เลือกประเภทแล็บ"}
                          </Button>
                        </TableCell>
                        <TableCell align="right">
                          <Link href={`/labs/visit-no/${row["visitno"]}`}>
                            <Button
                              color="primary"
                              variant="contained"
                              startIcon={<IconUser width={18} />}
                            >
                              รายละเอียด
                            </Button>
                          </Link>
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
          <Link href={`/labs/print/${dayJs}`}>
            <Button
              startIcon={<IconPrinter />}
              variant="outlined"
              color="primary"
            >
              พิมพ์ใบปะหน้า
            </Button>
          </Link>
        </Box>
      </DashboardCard>
    </PageContainer>
  );
};

export default LabPage;
