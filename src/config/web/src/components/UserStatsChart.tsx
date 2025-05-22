import React from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// Define the interface for our chart data points
interface ChartData {
    name: string;
    activeUsers: number;
    installs: number;
}

const data: ChartData[] = [
    { name: "Jan", activeUsers: 400, installs: 240 },
    { name: "Feb", activeUsers: 300, installs: 139 },
    { name: "Mar", activeUsers: 200, installs: 980 },
    { name: "Apr", activeUsers: 278, installs: 390 },
    { name: "May", activeUsers: 189, installs: 480 },
    { name: "Jun", activeUsers: 239, installs: 380 },
    { name: "Jul", activeUsers: 349, installs: 430 },
    { name: "Aug", activeUsers: 410, installs: 500 },
    { name: "Sep", activeUsers: 380, installs: 450 },
    { name: "Oct", activeUsers: 450, installs: 480 },
    { name: "Nov", activeUsers: 420, installs: 460 },
    { name: "Dec", activeUsers: 480, installs: 520 },
];

// Basic styling adjustments for dark theme
const chartTextStyle: React.CSSProperties = { fill: "rgba(255, 255, 255, 0.7)" }; // Lighter text for dark background
const gridStrokeColor = "rgba(255, 255, 255, 0.1)"; // Subtle grid lines
const tooltipContentStyle: React.CSSProperties = { backgroundColor: "rgba(30, 30, 30, 0.8)", border: "none" }; // Dark tooltip

const UserStatsChart: React.FC = () => {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 0,
                    bottom: 5, // Adjusted margins slightly
                }}
            >
                <CartesianGrid strokeDasharray="3 3" stroke={gridStrokeColor} />
                <XAxis dataKey="name" tick={{ fill: chartTextStyle.fill }} />
                <YAxis tick={{ fill: chartTextStyle.fill }} />
                <Tooltip contentStyle={tooltipContentStyle} itemStyle={chartTextStyle} />
                <Legend wrapperStyle={chartTextStyle} />
                <Line type="monotone" dataKey="activeUsers" name="Active Users" stroke="#8884d8" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="installs" name="Installs" stroke="#82ca9d" />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default UserStatsChart;
