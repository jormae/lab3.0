"use client";
import {
  Alert,
  AlertTitle,
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
  const [officerposition, setOfficerPosition] = useState<any>();
  const [email, setEmail] = useState<any>();
  // console.log('get username = '+username)
  // console.log('telephone = '+telephone)
  // console.log('fullname = '+fullname)

  const [open, setOpen] = useState<boolean>(false);

  const handleClickOpen = async (username: string) => {
    setOpen(true);
    let uri = `/api/users/${username}`;
    try {
      const { data } = await axios.get(uri);
      setUsername(data[0]["username"]);
      setFullname(data[0]["fullname"]);
      setTelephone(data[0]["telephone"]);
      setEmail(data[0]["email"]);
      setOfficerPosition(data[0]["officerposition"]);
      setIsLoading(false);
    } catch (error) {}
  };

  const handleClose = () => {
    setLoading(false);
    setOpen(false);
    setUsername("");
    setFullname("");
    setTelephone("");
    setEmail("");
    setOfficerPosition("");
    setError(false);
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

  const {
    handleSubmit,
    formState: { errors },
  } = useForm();

  const fetchUsers = async () => {
    setIsLoading(true);
    let uri = `/api/users`;
    try {
      const { data } = await axios.get(uri);
      setUsers({ blogs: data });
      setIsLoading(false);
    } catch (error) {}
  };

  const onSubmit = () => {
    setLoading(true);
    const data = {
      username: username,
      fullname: fullname,
      telephone: telephone,
      officerposition: officerposition,
      email: email,
    };

    console.log(" data = " + data);
    console.log("submit data = " + JSON.stringify(data));
    if (
      !data.fullname ||
      !data.telephone ||
      !data.officerposition ||
      !data.email
    ) {
      setError(true);
      setMessage("กรุณาใส่ข้อมูลให้ครบทุกช่อง");
      setLoading(false);
    } else {
      setError(false);

      let uri = `/api/users/${username}`;
      console.log(uri);

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
            setUsername("");
            setFullname("");
            setTelephone("");
            setEmail("");
            setOfficerPosition("");
            toast.success(data.message);
            fetchUsers();
            setOpen(false);
          } else {
            toast.error(data.message || data.errors[0].msg);
          }
        })
        .catch(function (error) {
          console.log(JSON.stringify(error));
        });
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [username]);

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
      </TableRow>
    ));
  };

  return (
    <PageContainer
      title="LAB 2.0 : Users Page"
      description="this is Sample page"
    >
      <Toaster />
      <DashboardCard title={`ทะเบียนบัญชีผู้ใช้ระบบ`}>
        <Box sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}>
          <CardContent>
            <Dialog open={open} onClose={handleClose} fullWidth>
              <DialogTitle>ข้อมูลบัญชีผู้ใช้ระบบ</DialogTitle>
              <DialogContent>
                {err ? (
                  <Alert
                    severity="error"
                    variant="filled"
                    sx={{ color: "#fff" }}
                  >
                    <AlertTitle>Error</AlertTitle>
                    {message}
                  </Alert>
                ) : (
                  ""
                )}
                <form
                  noValidate
                  autoComplete="off"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <Grid item xs={12} md={12} lg={12}>
                    <Grid container spacing={2} rowSpacing={3}>
                      <Grid item xs={6} mt={4}>
                        <FormControl fullWidth>
                          <TextField
                            InputLabelProps={{ shrink: true }}
                            label="ชื่อบัญชี"
                            variant="outlined"
                            value={username}
                            disabled
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6} mt={4}>
                        <FormControl fullWidth>
                          <TextField
                            InputLabelProps={{ shrink: true }}
                            label="ชื่อ-สกุล"
                            variant="outlined"
                            value={fullname}
                            onChange={(event) => {
                              setFullname(event.target.value);
                            }}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <TextField
                            InputLabelProps={{ shrink: true }}
                            label="โทรศัพท์"
                            variant="outlined"
                            value={telephone}
                            onChange={(event) => {
                              setTelephone(event.target.value);
                            }}
                            required
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={6}>
                        <FormControl fullWidth>
                          <TextField
                            InputLabelProps={{ shrink: true }}
                            label="อีเมล"
                            variant="outlined"
                            type="email"
                            value={email}
                            onChange={(event) => {
                              setEmail(event.target.value);
                            }}
                            required
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <FormControl fullWidth>
                          <TextField
                            InputLabelProps={{ shrink: true }}
                            label="ตำแหน่ง"
                            variant="outlined"
                            value={officerposition}
                            onChange={(event) => {
                              setOfficerPosition(event.target.value);
                            }}
                            required
                          />
                        </FormControl>
                      </Grid>
                    </Grid>
                  </Grid>
                </form>
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
                      ชื่อบัญชี
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      ชื่อ-สกุล
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      ตำแหน่ง
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      โทรศัพท์
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Typography variant="subtitle2" fontWeight={600}>
                      อีเมล
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
                  users.blogs
                    .filter((row: any) => {
                      return search === ""
                        ? row
                        : row["username"].includes(search) ||
                            row["fullname"].includes(search);
                    })
                    .slice(pg * rpg, pg * rpg + rpg)
                    .map((row: any, index: any) => (
                      <TableRow key={row.username}>
                        <TableCell>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            {row.username}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            {row.fullname}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            {row["officerposition"]}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            {row["telephone"]}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography
                            color="textSecondary"
                            variant="subtitle2"
                            fontWeight={400}
                          >
                            {row["email"]}
                          </Typography>
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            color={"primary"}
                            variant="outlined"
                            startIcon={<IconUser width={18} />}
                            onClick={(e) => handleClickOpen(row["username"])}
                            sx={{ alignContent: "right" }}
                            value={row["username"]}
                          >
                            รายละเอียด
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                )}
              </TableBody>
            </Table>
            <TablePagination
              rowsPerPageOptions={[10, 20, 50]}
              component="div"
              count={users.blogs.length}
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

export default UserPage;
