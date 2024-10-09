import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [search, setSearch] = useState(''); 
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [perPage] = useState(10); 
    const [month, setMonth] = useState(''); 

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/products/transactions`, {
                params: {
                    page,
                    perPage,
                    search, 
                    month, 
                },
            });
            
            setTransactions(response.data.transactions);
            setTotalPages(response.data.totalPages);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    useEffect(() => {
        fetchTransactions(); 
    }, [page, search, month]);

    const handleSearchChange = (e) => {
        setSearch(e.target.value); 
    };

    const handleMonthChange = (event) => {
        setMonth(event.target.value); 
    };

    return (
        <div className='border- border-red-600 py-10 bg-[#F7F7F8]'>
            <h1  className="text-4xl font-extrabold mb-4  text-orange-500">Transactions Dashboard</h1>

            <div className="w-full h-20 border-green-500 border- flex px-20">
            <div className="w-full h-full flex justify-start items-center border-red-500 border-">
            <input
            className='w-56 h-12 border shadow-md text-center'
                type="text"
                placeholder="Search by title, price..."
                value={search}
                onChange={handleSearchChange} 
            /> 
           
            </div>
            <div className="w-full h-full flex justify-end items-center border-red-500 border-">
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
            
         

            <div className="border-blue-500 border- my-8 overflow-x-auto shadow-xl">
            <table className="min-w-full bg-white border-collapse">
                <thead>
                    <tr className='bg-[#f6b565]'>
                        <th className="py-2 px-4 border">ID</th>
                        <th className="py-2 px-4 border w-48">Title</th>
                        <th className="py-2 px-4 border">Price</th>
                        <th className="py-2 px-4 border">Description</th>
                        <th className="py-2 px-4 border w-40">Category</th>
                        <th className="py-2 px-4 border">Image</th>
                        <th className="py-2 px-4 border">Sold</th>
                        <th className="py-2 px-4 border">Date of Sale</th>
                    </tr>
                </thead>
                <tbody>
                    {transactions.map((product) => (
                        <tr key={product.id} className='' >
                            <td className="py-2 px-4 h-4 overflow-hidden border">{product._id}</td>
                            <td className="py-2 px-4 h-4 overflow-hidden border">{product.title}</td>
                            <td className="py-2 px-4 h-4 overflow-hidden border">${product.price}</td>
                            <td className="py-2 px-4 h-4 overflow-hidden border">{product.description}</td>
                            <td className="py-2 px-4 h-4 overflow-hidden border">{product.category}</td>
                            <td className="py-2 px-4  overflow-hidden border">
                                <img src={product.image} alt={product.title} className="border-2 border-red w-12 h-8" />
                            </td>
                            <td className="py-2 px-4 h-4 overflow-hidden border">{product.sold ? 'Yes' : 'No'}</td>
                            <td className="py-2 px-4 h-4 overflow-hidden border">{new Date(product.dateOfSale).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

            <div className='w-full h-16 border- border-red-500 flex  items-center px-20 justify-around'>
                <button className='text-lg font-semibold bg-orange-100 py-2 px-8 border rounded-md shadow-md hover:text-orange-500' onClick={() => setPage(page > 1 ? page - 1 : 1)}>Previous</button>
                <span className='text-lg font-semibold text-orange-600'> Page {page} of {totalPages} </span>
                <button  className='text-lg font-semibold bg-orange-100 py-2 px-8 border rounded-md shadow-md hover:text-orange-500' onClick={() => setPage(page < totalPages ? page + 1 : page)}>Next</button>
            </div>
        </div>
    );
};

export default Transactions;
