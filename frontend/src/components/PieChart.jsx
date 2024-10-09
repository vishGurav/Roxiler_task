import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

Chart.register(ArcElement, Tooltip, Legend);

const PieChart = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [{
            label: 'Items per Category',
            data: [],
            backgroundColor: [],
        }]
    });
    
    const [selectedMonth, setSelectedMonth] = useState("March"); 

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    useEffect(() => {
        const fetchPieChartData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/products/pie-chart?month=${selectedMonth}`);
                const categories = response.data;

                // Prepare data for the chart
                const labels = categories.map(item => item.category);
                const data = categories.map(item => item.count);
                const backgroundColor = categories.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`); 

                setChartData({
                    labels,
                    datasets: [{
                        label: 'Items per Category',
                        data,
                        backgroundColor,
                    }]
                });
            } catch (error) {
                console.error('Error fetching pie chart data:', error);
            }
        };

        fetchPieChartData();
    }, [selectedMonth]);

    const handleMonthChange = (event) => {
        setSelectedMonth(event.target.value);
    };

    return (
        <div className="w-full  bg-[#FFF7FC] drop-shadow-md">
        <div className='w-full  p-10 py-20 bg-[#FFF7FC] rounded-lg shadow-lg  border-gray-300'>
            <h1 className='px-8  py-4 text-4xl font-extrabold text-orange-500'>Transactions Pie Char</h1>
            <div className="w-full h-20 flex items-center justify-between px-10">

            <h2 className='text-3xl font-bold text-orange-400 mb-6'>Pie Chart for {selectedMonth}</h2>

            <div className=''>
                <label htmlFor="month-select" className='text-lg font-bold text-orange-500 p-4'>Select Month:</label>
                <select 
                    id="month-select"
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className='w-40 h-12 text-center shadow-md border'
                >
                    {months.map(month => (
                        <option key={month} value={month}>{month}</option>
                    ))}
                </select>
            </div>
            </div>

            <div className='h-[600px] bg-gradient-to-br from-gray-50 to-gray-200 p-6 rounded-2xl shadow-2xl relative'>
                <div className="absolute inset-0 bg-white opacity-5 rounded-2xl transform translate-x-2 translate-y-2"></div> {/* Adds a subtle 3D shadow effect */}
                <Pie data={chartData} />
            </div>
        </div>
        </div>
    );
};

export default PieChart;
