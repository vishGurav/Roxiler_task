const Product = require('../models/productModel');
const axios = require('axios');

exports.initializeDatabase = async (req, res) => {
    try {
        const { data } = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
        await Product.insertMany(data);
        
        res.status(201).json({ message: 'Database initialized with seed data' });
    } catch (err) {
        res.status(500).json({ error: 'Failed to initialize database' });
    }
};


exports.getTransactions = async (req, res) => {
    const { page = 1, perPage = 10, search = '', month } = req.query; 
    const searchQuery = search.trim();

    let query = {};

    if (month) {
        query = {
            ...query,
            $expr: {
                $eq: [
                    { $month: { $toDate: "$dateOfSale" } }, 
                    getMonthNumber(month)
                ]
            }
        };
    }

    if (searchQuery) {
        query.$or = [
            { title: { $regex: searchQuery, $options: 'i' } },
            { description: { $regex: searchQuery, $options: 'i' } } 
        ];

        const price = parseFloat(searchQuery);
        if (!isNaN(price)) {
            query.$or.push({ price: { $eq: price } });
        }
    }

    try {
        const transactions = await Product.find(query)
            .skip((page - 1) * parseInt(perPage)) 
            .limit(parseInt(perPage));

        const total = await Product.countDocuments(query);

        res.json({
            transactions,
            totalPages: Math.ceil(total / perPage),
            currentPage: parseInt(page), 
        });

    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.getStatistics = async (req, res) => {
    const { month } = req.query;
  
    try {
      const statistics = await Product.aggregate([
        {
          $addFields: {
            saleMonth: { $month: { $toDate: "$dateOfSale" } }, 
          }
        },
        {
          $match: {
            saleMonth: getMonthNumber(month) 
          }
        },
        {
          $group: {
            _id: null, 
            totalSaleAmount: { $sum: "$price" },
            soldItems: { $sum: { $cond: [{ $eq: ["$sold", true] }, 1, 0] } }, 
            totalItems: { $sum: 1 }, 
          }
        }
      ]);
  
      const stats = statistics.length > 0 ? statistics[0] : { totalSaleAmount: 0, soldItems: 0, totalItems: 0 };
      
      const notSoldItems = stats.totalItems - stats.soldItems;
  
      res.json({
        totalSaleAmount: stats.totalSaleAmount,
        soldItems: stats.soldItems,
        notSoldItems
      });
  
    } catch (err) {
      console.error("Error fetching statistics:", err);
      res.status(500).json({ error: "Error fetching statistics" });
    }
  };
  

exports.getBarChartData = async (req, res) => {
    const { month } = req.query;
try{
    const priceRanges = [
        { _id:0, range:"0-100", },
        { _id:101, range:"101",  },
        { _id:201, range:"201-300", },
        { _id:301, range:"301-400", },
        { _id:401, range:"401-500", },
        { _id:501, range:"501-600", },
        { _id:601, range:"601-700", },
        { _id:701, range:"701-800", },
        { _id:801, range:"801-900", },
        { _id:901, range:"901+", max: Infinity },
      ];
      const barchartresult = await Product.aggregate([
        {
          $addFields: {
            saleMonth: { $month: { $toDate: "$dateOfSale" } }, 
          }
        },
        {
          $match: {
            saleMonth: getMonthNumber(month) 
          }
        },
        {
        $bucket: {
          groupBy: "$price",
          boundaries: [0, 101, 201, 301, 401, 501, 601, 701, 801, 901],
          default: "901+", 
          output: {
            count: { $sum: 1 }, 
          }
        }
      }
      ]);

    
    const result = priceRanges.map((range) => {
        const matchedRange = barchartresult.find(
          (r) => r._id == range._id || (r._id == "901+" && range._id == "901+")
        );
        return {
          range: range.range,
          count: matchedRange ? matchedRange.count : 0, 
        };
      }); 

    res.send(result)

} catch(error)
{
    console.error('Error fetching Data:', error);
    res.status(500).json({ error: 'Server Error' });
}
    };

exports.getPieChartData = async (req, res) => {
    const { month } = req.query;

    try {
        const categoriesdata = await Product.aggregate([
            {
                $addFields: {
                    saleMonth: { $month: { $toDate: "$dateOfSale" } }, 
                }
            },
            {
                $match: {
                    saleMonth: getMonthNumber(month) 
                }
            },
            {
                $group: {
                    _id: '$category',
                    itemCount: { $sum: 1 }
                }
            },
            { $sort: { itemCount: -1 } }
        ]);

        const formattedResult = categoriesdata.map(item => ({
            category: item._id,
            count: item.itemCount
        }));

        res.json(formattedResult);
    } catch (error) {
        console.error('Error fetching category data:', error);
        res.status(500).json({ error: 'Server Error' });
    }
};

exports.getCombinedData = async (req, res) => {
    const { month } = req.query;

    try {
        const baseUrl = 'http://localhost:8000/api/products';

        const [statisticsResponse, barChartResponse, pieChartResponse] = await Promise.all([
            axios.get(`${baseUrl}/statistics`, { params: { month } }), 
            axios.get(`${baseUrl}/bar-chart`, { params: { month } }),  
            axios.get(`${baseUrl}/pie-chart`, { params: { month } })   
        ]);

        const statistics = statisticsResponse.data;
        const priceRanges = barChartResponse.data;
        const categoryData = pieChartResponse.data;

        res.json({
            statistics,
            priceRanges,
            categoryData
        });

    } catch (err) {
        console.error('Error fetching combined data:', err);
        res.status(500).json({ error: 'Error fetching combined data' });
    }
};

const getMonthNumber = (month) => {
    const months = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12
    };
    return months[month];
};
