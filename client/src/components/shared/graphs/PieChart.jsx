import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

import { PIE_CHART_COLORS } from "../../../config/utils/constants"

export const MyPieChart = ({entryCounts, showLegend}) => {
    const data = Object.entries(entryCounts).map(([name, value]) => ({
      name,
      value
    }));
    const allZero = data.every(item => item.value === 0);

    if (allZero) {
        return (
            <div style={{ width: 300, height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span>No data available</span>
            </div>
        );
    }

    return (
        <div>
            <PieChart width={300} height={250}>
                <Pie
                    data={data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    fill="#8884d8"
                    label
                >
                    {data.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={PIE_CHART_COLORS[index % PIE_CHART_COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                {showLegend && <Legend />}
            </PieChart>
        </div>
    );
};
