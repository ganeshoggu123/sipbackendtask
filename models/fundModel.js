// const db = require("../utility/dbManager");


// const createFund = (fundData, callback) => {
//     const query = `
//         INSERT INTO mutual_fund (
//             fund_id,
//             amc_id,
//             fund_name,
//             fund_category,
//             fund_type
//         ) VALUES (?, ?, ?, ?, ?)
//     `;

//     db.run(
//         query,
//         [
//             fundData.fund_id,
//             fundData.amc_id,
//             fundData.fund_name,
//             fundData.fund_category,
//             fundData.fund_type
//         ],
//         callback
//     );
// };


// const getAllFunds = (callback) => {
//     const query = `
//         SELECT * FROM mutual_fund
//     `;

//     db.all(query, [], callback);
// };

// const updateFundNav = (fundId, navValue, navDate, callback) => {
//     const query = `
//         INSERT INTO nav_history (
//             fund_id,
//             nav_value,
//             nav_date
//         ) VALUES (?, ?, ?)
//     `;

//     db.run(query, [fundId, navValue, navDate], callback);
// };

// module.exports = {
//     createFund,
//     getAllFunds,
//     updateFundNav
// };


const client = require("../pgManager");

const createFund = (fundData, callback) => {

    client.query(
        `INSERT INTO mutual_fund (
            fund_id,
            amc_id,
            fund_name,
            fund_category,
            fund_type
        )
        VALUES (
            '${fundData.fund_id}',
            '${fundData.amc_id}',
            '${fundData.fund_name}',
            '${fundData.fund_category}',
            '${fundData.fund_type}'
        )
        RETURNING *;`,

        (error, result) => {

            if (error) {
                callback(error, null);
            } else {
                console.log("Fund Created Successfully");
                callback(null, result.rows);
            }

        }
    );

};

const getAllFunds = (callback) => {

    client.query(
        `SELECT * FROM mutual_fund;`,

        (error, result) => {

            if (error) {
                callback(error, null);
            } else {
                console.log("Funds Fetched Successfully");
                callback(null, result.rows);
            }

        }
    );

};

const updateFundNav = (fundId, navValue, navDate, callback) => {

    client.query(
        `INSERT INTO nav_history (
            fund_id,
            nav_value,
            nav_date
        )
        VALUES (
            '${fundId}',
            '${navValue}',
            '${navDate}'
        )
        RETURNING *;`,

        (error, result) => {

            if (error) {
                callback(error, null);
            } else {
                console.log("NAV Updated Successfully");
                callback(null, result.rows);
            }

        }
    );

};

module.exports = {
    createFund,
    getAllFunds,
    updateFundNav
};