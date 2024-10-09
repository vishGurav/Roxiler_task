import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CombinedComponent = () => {
    const [data, setData] = useState(null); 
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 
    const [month, setMonth] = useState('');

    const fetchData = async (selectedMonth) => {
        setLoading(true); 
        try {
            const response = await axios.get('http://localhost:8000/api/products/combined-data', {
                params: { month: selectedMonth }, 
            });
            setData(response.data); 
            setError(null); 
        } catch (err) {
            console.error('Error fetching data:', err);
            setError('Failed to fetch data'); 
        } finally {
            setLoading(false); 
        }
    };

    useEffect(() => {
        if (month) { 
            fetchData(month);
        }
    }, [month]);

    const handleMonthChange = (event) => {
        setMonth(event.target.value);
        setData(null); 
    };

    return (
        <div className="p-20 bg-[#f8f8f8]">
        <div className="w-full h-20 flex items-center justify-between px-10">

         <h1 className='p-10 text-4xl font-extrabold text-orange-500'> combined Transactions</h1>

            <div className="">
            <label htmlFor="month" className='text-lg font-bold text-orange-500 p-4'>Select Month:</label>
            <select id="month" value={month} onChange={handleMonthChange}     className='w-40 h-12 text-center shadow-md border'
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

            {loading && <p>Loading data...</p>}
            {error && <p>{error}</p>}

            {data && (
                <pre className="bg-gray-100 p-4 rounded-md shadow-md">
                    {JSON.stringify(data, null, 2)} 
                </pre>
            )}
        </div>
    );
};

export default CombinedComponent;
