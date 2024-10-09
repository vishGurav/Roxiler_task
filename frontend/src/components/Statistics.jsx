import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Statistics = () => {
    const [statistics, setStatistics] = useState({
        totalSaleAmount: 0,
        soldItems: 0,
        notSoldItems: 0,
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [month, setMonth] = useState('March'); 

    const fetchStatistics = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/products/statistics`, {
                params: { month },
            });
            setStatistics(response.data);
            setLoading(false);
        } catch (err) {
            console.error('Error fetching statistics:', err);
            setError('Failed to fetch statistics');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatistics(); 
    }, [month]);

    const handleMonthChange = (event) => {
        setMonth(event.target.value); 
    };

    if (loading) {
        return <p>Loading statistics...</p>; 
    }

    if (error) {
        return <p>{error}</p>; 
    }

    return (
            <div className='border- border-red-400 py-20 px-20  bg-[#FCF8F3] drop-shadow-md' >
            <div className="w-full h-20 flex items-center justify-between px-10">
            <h1 className="text-4xl font-extrabold mb-4  text-orange-500"> Transctions Statistics</h1>
            <div className="">
                <label htmlFor="month" className='text-lg font-bold text-orange-500 p-4'>Select Month : </label>
                <select id="month" value={month} onChange={handleMonthChange} className='w-40 h-12 text-center shadow-md border'>
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
            

            <div className="flex flex-col justify-around border- w-[50%] border-red-500 p-8 px-12 mt-10 rounded-lg shadow-lg hover:shadow-xl bg-white">
                <div className="text-start flex w-full justify-between p-4 border-">
                    <h3 className="font-bold text-2xl text-orange-500">Total Sale Amount</h3>
                    <p className="text-2xl font-bold">${statistics.totalSaleAmount}</p>
                </div>
                <div className="text-start flex w-full justify-between p-4 border-">
                    <h3 className="font-bold text-2xl text-orange-500">Sold Items</h3>
                    <p className="text-2xl font-bold">{statistics.soldItems}</p>
                </div>
                <div className="text-start flex w-full justify-between p-4 border-">
                    <h3 className="font-bold text-2xl text-orange-500">Unsold Items</h3>
                    <p className="text-2xl font-bold">{statistics.notSoldItems}</p>
                </div>
            </div>
        </div>
    );
};

export default Statistics;

