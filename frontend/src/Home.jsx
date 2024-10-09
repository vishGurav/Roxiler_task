import React from 'react'
import BarChart from './components/BarChart';
import PieChart from './components/PieChart';
import Statistics from './components/Statistics';
import Transactions from './components/Transactions';
import Combined from './components/Combined';

const Home = () => {

    return (
        <div className="container mx-auto p-4">          

            <Transactions/>
            <Statistics/>            
            <BarChart />         
            <PieChart  />          
            <Combined/>
            
        </div>
    );
};

export default Home;
