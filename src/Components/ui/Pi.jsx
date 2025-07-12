"use client";

import { useContext } from "react";
import { Pie, PieChart, Tooltip } from "recharts";
import PatientContext from "../../context/patientContext";

// const { mood } = useContext(PatientContext);

// Sort the data by visitor count

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-800 text-white p-2 rounded-md shadow-lg">
        <p className="font-semibold text-xs">
          {`${payload[0].name}: ${payload[0].value}`}
        </p>
      </div>
    );
  }
  return null;
};

export function Pi({ mood }) {
  return (
    // <>Hello</>
    <div className="w-full h-full bg-gradient-to-t rounded-xl p-2 flex flex-col justify-evenly">
      <PieChart width={100} height={100} className="w-full h-full mx-auto">
        <Pie
          data={mood}
          dataKey="per"
          nameKey="feeling"
          cx="50%"
          cy="50%"
          outerRadius="100%"
          innerRadius="60%"
          isAnimationActive
          animationBegin={400}
          animationDuration={800}
          animationEasing="ease-in-out"
        >
          {mood.map((entry, index) => (
            <cell key={`cell-${index}`} fill={entry.fill} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
      <div>Recorded Mood</div>
    </div>
  );
}
