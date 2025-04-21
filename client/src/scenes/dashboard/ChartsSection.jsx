import React from "react";
import { Box, Typography, useTheme } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const ChartBox = ({ title, data, dataKey, chartType = "line", color }) => {
  const theme = useTheme();

  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#00c49f", "#0088fe", "#ffbb28", "#ff4444"];

  return (
    <Box
      backgroundColor={theme.palette.background.alt}
      p="1.25rem"
      borderRadius="0.55rem"
      boxShadow={2}
    >
      <Typography variant="h6" sx={{ color: theme.palette.secondary[100], mb: 2 }}>
        {title}
      </Typography>
      <ResponsiveContainer width="100%" height={250}>
        {chartType === "bar" ? (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey={dataKey} fill={color} />
          </BarChart>
        ) : chartType === "line" ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey={dataKey} stroke={color} />
          </LineChart>
        ) : chartType === "pie" || chartType === "donut" ? (
          <PieChart>
            <Tooltip />
            <Legend />
            <Pie
              data={data}
              dataKey={dataKey}
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              innerRadius={chartType === "donut" ? 60 : 0}
              paddingAngle={5}
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
          </PieChart>
        ) : null}
      </ResponsiveContainer>
    </Box>
  );
};

export default ChartBox;
