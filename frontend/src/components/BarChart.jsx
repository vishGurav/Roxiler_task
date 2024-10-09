import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';


Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart = () => {
    const [priceRanges, setPriceRanges] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [month, setMonth] = useState('March'); 

   
    const fetchBarChartData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/products/bar-chart`, {
                params: { month },
            });
            setPriceRanges(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching bar chart data:', err);
            setError('Failed to fetch bar chart data');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBarChartData(); 
    }, [month]);

  
    const data = {
        labels: priceRanges.map(range => range.range),
        datasets: [{
            label: 'Number of Items',
            data: priceRanges.map(range => range.count), 
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
        }]
    };

    const handleMonthChange = (event) => {
        setMonth(event.target.value); 
    };

    if (loading) {
        return <p>Loading bar chart data...</p>; 
    }

    if (error) {
        return <p>{error}</p>; 
    }

    return (
        
        <div className="w-full bg-[#effaf6] py-20 ">
        <div className="max-w-7xl mx-auto p-10 bg-gray-50 rounded-lg shadow-lg ">
            <div className="w-full h-20 flex items-center justify-between px-10">
                <h2 className="text-4xl font-extrabold mb-4  text-orange-500">Transactions Bar Char</h2>
                <div className="flex justify-center items-center mb-6">
            <label htmlFor="month" className='text-lg font-bold text-orange-500 p-4'>Select Month : </label>
            <select
                id="month"
                value={month}
                onChange={handleMonthChange}
                className='w-40 h-12 text-center shadow-md border'
            >
                <option value="January">January</option>
                <option value="February">February</option>
                <option value="March">March</option>
                <option value="April">April</option>
                <option value="May">May</option>
                <option value="June">June</option>
                <option value="July">July</option>
                <option value="August">August</option>
                <option value="September">September</option>
                <option value="October">October</option>
                <option value="November">November</option>
                <option value="December">December</option>
            </select>
        </div>
            </div>
        
        
    
        <div className="bg-white p-6 rounded-md shadow-md">
            <Bar
                data={data}
                options={{
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                            labels: {
                                font: {
                                    size: 14,
                                    family: 'Inter, sans-serif',
                                    weight: '500'
                                },
                                color: '#4A5568'
                            }
                        },
                        title: {
                            display: true,
                            text: 'Items Distribution by Price Range',
                            font: {
                                size: 18,
                                family: 'Inter, sans-serif',
                                weight: '600'
                            },
                            color: '#2D3748'
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                stepSize: 1,
                                color: '#4A5568',
                                font: {
                                    size: 12,
                                    family: 'Inter, sans-serif'
                                },
                                callback: function(value) {
                                    return Number.isInteger(value) ? value : null;
                                }
                            }
                        },
                        x: {
                            ticks: {
                                color: '#4A5568',
                                font: {
                                    size: 12,
                                    family: 'Inter, sans-serif'
                                }
                            }
                        }
                    }
                }}
            />
        </div>
    </div>
    </div>
    
    

    );
};

export default BarChart;
