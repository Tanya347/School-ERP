import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';


const COLORS = ['#48A6A7', '#9ACBD0', '#F2EFE7', '#006A71']; // or any color palette

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
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
                {showLegend && <Legend />}
            </PieChart>
        </div>
    );
};
