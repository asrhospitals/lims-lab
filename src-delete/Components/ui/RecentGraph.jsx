import React from "react";
import { Area, AreaChart, CartesianGrid, Tooltip, XAxis } from "recharts";

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(210, 70%, 50%)", // Example color
  },
  mobile: {
    label: "Mobile",
    color: "hsl(160, 70%, 50%)", // Example color
  },
  other: {
    label: "Other",
    color: "hsl(50, 70%, 50%)", // Example color
  },
};

// Sample data
const chartData = [
  { month: "January", desktop: 400, mobile: 300, other: 100 },
  { month: "February", desktop: 500, mobile: 400, other: 200 },
  { month: "March", desktop: 100, mobile: 500, other: 300 },
  { month: "April", desktop: 700, mobile: 600, other: 400 },
];

const RecentGraph = () => {
  return (
    <div className="w-80 h-72">
      <AreaChart
        data={chartData}
        margin={{
          top: 12,
          right: 12,
          left: 12,
          bottom: 12,
        }}
        width={320}
        height={288}
        stackOffset="expand"
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => value.slice(0, 3)} // Format month (e.g., "Jan", "Feb")
        />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Area
          dataKey="other"
          type="monotone"
          fill={chartConfig.other.color}
          fillOpacity={0.2}
          stroke={chartConfig.other.color}
          stackId="1"
        />
        <Area
          dataKey="mobile"
          type="monotone"
          fill={chartConfig.mobile.color}
          fillOpacity={0.4}
          stroke={chartConfig.mobile.color}
          stackId="1"
        />
        <Area
          dataKey="desktop"
          type="monotone"
          fill={chartConfig.desktop.color}
          fillOpacity={0.6}
          stroke={chartConfig.desktop.color}
          stackId="1"
        />
      </AreaChart>
    </div>
  );
};

export default RecentGraph;
