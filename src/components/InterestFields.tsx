import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend } from "recharts";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import "./InterestFields.css";

export default function InterestFields() {
  const re = /^\d+\.?\d*$/;
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [time, setTime] = useState("");
  const [showSI, setShowSI] = useState(true);
  const [showCI, setShowCI] = useState(true);
  const [showSIEarned, setShowSIEarned] = useState(false);
  const [showCIEarned, setShowCIEarned] = useState(false);
  const [loading, setLoading] = useState(true);

  const computeSimple = (n: number) => {
    if (loading) {
      return 0;
    }
    const interest = n * +principal * (+rate / 100);
    return interest + +principal;
  };

  const computeCompound = (n: number) => {
    if (loading) {
      return 0;
    }
    const result = +principal * Math.pow(1 + +rate / 100, n);
    return result.toFixed(2);
  };

  const data = Array.from({ length: +time + 1 }, (_v, index) => ({
    name: "Yr " + index,
    "Simple Interest": computeSimple(index),
    "Simple Interest Earned": computeSimple(index) - +principal,
    "Compound Interest": computeCompound(index),
    "Compound Interest Earned": +computeCompound(index) - +principal,
  }));

  useEffect(() => {
    if (principal && rate && time) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [principal, rate, time]);

  return (
    <Card variant="outlined" className="main-card">
      <Box sx={{ p: 2 }} className="fields">
        <div>
          <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="center"
          >
            <TextField
              label="Principal"
              value={principal || ""}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              variant="outlined"
              onChange={(e) => {
                if (e.target.value === "" || re.test(e.target.value)) {
                  setPrincipal(e.target.value);
                }
              }}
            />
            <TextField
              label="Rate"
              value={rate || ""}
              InputProps={{
                endAdornment: <InputAdornment position="end">%</InputAdornment>,
              }}
              variant="outlined"
              onChange={(e) => {
                if (e.target.value === "" || re.test(e.target.value)) {
                  setRate(e.target.value);
                }
              }}
            />
          </Stack>
          <Stack
            direction="row"
            justifyContent="space-around"
            alignItems="center"
          >
            <TextField
              label="Time (years)"
              value={time || ""}
              variant="outlined"
              onChange={(e) => {
                if (e.target.value === "" || re.test(e.target.value)) {
                  setTime(e.target.value);
                }
              }}
            />
            <TextField
              label="nth in years"
              value="1"
              focused
              variant="outlined"
              disabled
            />
          </Stack>
        </div>

        <Stack direction="row" alignItems="center" className="filters">
          <FormGroup>
            <FormControlLabel
              control={
                <Switch
                  disabled={loading}
                  checked={showSI}
                  onChange={() => setShowSI(!showSI)}
                />
              }
              label="Show Simple Interest"
            />
            <FormControlLabel
              control={
                <Switch
                  disabled={loading}
                  checked={showSIEarned}
                  onChange={() => setShowSIEarned(!showSIEarned)}
                />
              }
              label="Show Simple Interest Earned"
            />
            <FormControlLabel
              control={
                <Switch
                  disabled={loading}
                  checked={showCI}
                  onChange={() => setShowCI(!showCI)}
                />
              }
              label="Show Compound Interest"
            />
            <FormControlLabel
              control={
                <Switch
                  disabled={loading}
                  checked={showCIEarned}
                  onChange={() => setShowCIEarned(!showCIEarned)}
                />
              }
              label="Show Compound Interest Earned"
            />
          </FormGroup>
        </Stack>
      </Box>
      <Divider />
      <div className="result">
        {loading || !(showCI || showSI || showCIEarned || showSIEarned) ? (
          <CircularProgress color="inherit" />
        ) : (
          <>
            <LineChart width={700} height={500} data={data}>
              <XAxis dataKey="name" tickCount={10} />
              <YAxis tickCount={10} />
              <Tooltip />
              <Legend />
              {showSI && (
                <Line
                  type="monotone"
                  dataKey="Simple Interest"
                  stroke="#8884d8"
                />
              )}
              {showCI && (
                <Line
                  type="monotone"
                  dataKey="Compound Interest"
                  stroke="#82ca9d"
                />
              )}
              {showSIEarned && (
                <Line
                  type="monotone"
                  dataKey="Simple Interest Earned"
                  stroke="#66B2FF"
                />
              )}
              {showCIEarned && (
                <Line
                  type="monotone"
                  dataKey="Compound Interest Earned"
                  stroke="#FBBC04"
                />
              )}
            </LineChart>
          </>
        )}
      </div>
    </Card>
  );
}
