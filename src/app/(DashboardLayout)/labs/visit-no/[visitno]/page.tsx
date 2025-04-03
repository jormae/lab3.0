"use client";
import {
  Box,
  Button,
  CardContent,
  Divider,
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
import PageContainer from "@/app/(DashboardLayout)/components/container/PageContainer";
import DashboardCard from "@/app/(DashboardLayout)/components/shared/DashboardCard";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import moment from "moment";
import { IconPrinter } from "@tabler/icons-react";
moment.locale("th");
import { useForm } from "react-hook-form";
import dayjs from "dayjs";
import "dayjs/locale/th";
import buddhistEra from "dayjs/plugin/buddhistEra";
dayjs.extend(buddhistEra);
import ReactToPrint from "react-to-print";

const LabPage = (params: any) => {
  dayjs.locale("th");

  const visitno = params["params"]["visitno"];

  const componentRef = useRef<HTMLDivElement>(null);
  const [date, setDate] = useState<any>(); //2021-03-15
  let dayJs = dayjs(date).format("YYYY-MM-DD");
  const [patient, setPatient] = useState<any>();
  const strDate = " วันที่ " + dayjs(date).format("DD MMMM BBBB");

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [labs, setLabs] = useState<any>({ blogs: [] });
  const [org, setOrg] = useState<any>('');

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
    let uri = `/api/labs/visit-no/${visitno}`;
    try {
      const { data } = await axios.get(uri);
      setLabs({ blogs: data });
      setIsLoading(false);
    } catch (error) {}
  };

  const fetchOrg = async () => {
    setIsLoading(true);
    let uri = `/api/org`;
    try {
      const { data } = await axios.get(uri);
      console.log(JSON.stringify(data));
      setOrg(data[0]);
      setIsLoading(false);
    } catch (error) {}
  };

  useEffect(() => {
    fetchLabs();
    fetchOrg();
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
                <CardContent>
                  <Grid item xs={12} md={12} lg={12}>
                    <form noValidate autoComplete="off">
                      <Grid container spacing={3}>
                        <Grid item xs={6}>
                          <Typography variant="h5" fontWeight={600}>
                            ชื่อ-สกุล : {labs.blogs[0]?.prenamelong}
                            {labs.blogs[0]?.fname} {labs.blogs[0]?.lname}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="h5" fontWeight={600}>
                            อายุ : {labs.blogs[0]?.AGE} ปี
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="h6" fontWeight={600}>
                            สิทธิ์การรักษา : {labs.blogs[0]?.rightname}
                          </Typography>
                        </Grid>
                        <Grid item xs={6}>
                          <Typography variant="h6" fontWeight={600}>
                            ที่อยู่ : {labs.blogs[0]?.ADDRESS}
                          </Typography>
                        </Grid>
                      </Grid>
                    </form>
                    <Divider sx={{ m: 3 }} />
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
                            ที่
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="subtitle2" fontWeight={600}>
                            รหัสแล็บ
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="subtitle2" fontWeight={600}>
                            ชื่อรายการแล็บ
                          </Typography>
                        </TableCell>
                        <TableCell align="center">
                          <Typography variant="subtitle2" fontWeight={600}>
                            ผลตรวจ
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
                              : row["patientName"]
                                  .toLowerCase()
                                  .includes(search) ||
                                  row["idcard"].includes(search);
                          })
                          .slice(pg * rpg, pg * rpg + rpg)
                          .map((row: any, index: any) => (
                            <TableRow key={row.visitno}>
                              <TableCell>
                                <Typography
                                  color="textSecondary"
                                  variant="subtitle2"
                                  fontWeight={400}
                                >
                                  {i++}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  color="textSecondary"
                                  variant="subtitle2"
                                  fontWeight={400}
                                >
                                  {row.labcode}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  color="textSecondary"
                                  variant="subtitle2"
                                  fontWeight={400}
                                >
                                  {row.labname}
                                </Typography>
                              </TableCell>
                              <TableCell>
                                <Typography
                                  color="textSecondary"
                                  variant="subtitle2"
                                  fontWeight={400}
                                  align="center"
                                >
                                  {row.labresultdigit ?? "-"}
                                </Typography>
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
                <Grid container spacing={3}>
                  <Grid item xs={12}></Grid>
                </Grid>
              </Box>
            </DashboardCard>
          </Grid>

          <Grid item xs={12} lg={12}>
            <DashboardCard title={`รายการตรวจแล็บ ${strDate}`}>
              <Box
                sx={{ overflow: "auto", width: { xs: "280px", sm: "auto" } }}
              >
                <CardContent>
                  <Grid item xs={12} md={12} lg={12}>
                    <form noValidate autoComplete="off">
                      <div ref={componentRef}>
                        <Typography fontSize={12} align="center">
                          {org.orgShortName}
                        </Typography>
                        <Typography fontSize={12} align="center">
                          วันที่{" "}
                          {dayjs(labs.blogs[0]?.datecheck).format("DD/MM/BBBB")}{" "}
                          เวลา...............
                        </Typography>
                        <Typography fontSize={12} align="center">
                          {labs.blogs[0]?.prenamelong}
                          {labs.blogs[0]?.fname} {labs.blogs[0]?.lname} อายุ :{" "}
                          {labs.blogs[0]?.AGE} ปี{" "}
                        </Typography>
                        <Typography fontSize={12} align="center">
                          HN {labs.blogs[0]?.pid} ({labs.blogs[0]?.labTypeName})
                          ผู้เจาะ..............{" "}
                        </Typography>
                      </div>
                    </form>
                    <ReactToPrint
                      trigger={() => (
                        <Button
                          startIcon={<IconPrinter />}
                          variant="outlined"
                          color="primary"
                        >
                          พิมพ์สติกเกอร์แล็บ
                        </Button>
                      )}
                      content={() => componentRef.current}
                    />
                  </Grid>
                </CardContent>
              </Box>
            </DashboardCard>
          </Grid>
        </Grid>
      </Box>
    </PageContainer>
  );
};

export default LabPage;
