import React, { useState } from 'react';

const TransactionsTable = ({ transactions }) => {
    const [search, setSearch] = useState('');
    const [filteredTransactions, setFilteredTransactions] = useState(transactions);

    // Filter transactions based on search input
    const handleSearch = (e) => {
        const value = e.target.value.toLowerCase();
        setSearch(value);
        setFilteredTransactions(transactions.filter(transaction =>
            transaction.title.toLowerCase().includes(value) ||
            transaction.description.toLowerCase().includes(value) ||
            transaction.price.toString().includes(value)
        ));
    };

    return (
        <div>
            
            <h2 className="text-xl font-bold mb-4">Transactions Table</h2>
            <input
                className="border p-2 rounded-md mb-4"
                type="text"
                placeholder="Search transactions"
                value={search}
                onChange={handleSearch}
            />
            <table className="min-w-full bg-white border">
                <thead>
                    <tr className="bg-gray-200 text-left">
                        <th className="p-2">Title</th>
                        <th className="p-2">Description</th>
                        <th className="p-2">Price</th>
                        <th className="p-2">Date of Sale</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTransactions.map((transaction, index) => (
                        <tr key={index} className="border-t">
                            <td className="p-2">{transaction.title}</td>
                            <td className="p-2">{transaction.description}</td>
                            <td className="p-2">${transaction.price}</td>
                            <td className="p-2">{new Date(transaction.dateOfSale).toLocaleDateString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default TransactionsTable;
