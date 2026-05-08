const client = require("../pgManager");
const users = [
    {
        email:"ganeshoggu@gmail.com",
        password:"12345",
        role:"investor",
        isLoggedIn:false
    }
]


const invalidTokens =[]

const loginUser = (email,password) => {
    const userIndex = users.findIndex(
        (u)=> u.email == email && u.password == password
    )
    if(userIndex != -1){
        users[userIndex] = {...users[userIndex],isLoggedIn: true}
    }
    return users[userIndex]
}

const logoutUser = (email,token) =>{
    const userIndex = users.findIndex((u)=> u.email == email && u.isLoggedIn == true)
    if(userIndex != -1){
        users[userIndex] = {...users[userIndex],isLoggedIn: false}
        invalidTokens.push(token)
        return true
    }
    return false
}

const createInvestor = (investorData, callback) => {

    client.query(
        `INSERT INTO investor (
            investor_id,
            first_name,
            middle_name,
            last_name,
            pancard_no,
            aadhaar_no,
            date_of_birth,
            gender,
            occupation,
            passport_no
        )
        VALUES (
            '${investorData.investor_id}',
            '${investorData.first_name}',
            '${investorData.middle_name}',
            '${investorData.last_name}',
            '${investorData.pancard_no}',
            '${investorData.aadhaar_no}',
            '${investorData.date_of_birth}',
            '${investorData.gender}',
            '${investorData.occupation}',
            '${investorData.passport_no}'
        )
        RETURNING *;`,

        (error, result) => {

            if (error) {
                callback(error, null);
            } else {
                console.log("Investor Created Successfully");
                callback(null, result.rows);
            }

        }
    );

};

module.exports = {
    createInvestor
};


const getInvestorById = (investorId, callback) => {

    client.query(
        `SELECT * 
         FROM investor
         WHERE investor_id = '${investorId}';`,
         
        (error, result) => {

            if (error) {
                callback(error, null);
            } else {
                console.log("Investor Fetched Successfully");
                callback(null, result.rows);
            }

        }
    );

};

const getInvestorHoldings = (investorId, callback) => {

    client.query(
        `SELECT 
            mf.fund_name,
            ph.total_units,
            nh.nav_value,
            (ph.total_units * nh.nav_value) AS current_value
        FROM portfolio p
        JOIN portfolio_holdings ph
            ON p.portfolio_id = ph.portfolio_id
        JOIN mutual_fund mf
            ON ph.fund_id = mf.fund_id
        JOIN nav_history nh
            ON mf.fund_id = nh.fund_id
        WHERE p.investor_id = '${investorId}';`,

        (error, result) => {

            if (error) {
                callback(error, null);
            } else {
                console.log("Investor Holdings Fetched Successfully");
                callback(null, result.rows);
            }

        }
    );

};
const calculateNAV = (investorId, callback) => {

    client.query(
        `SELECT 
            SUM(ph.total_units * nh.nav_value) AS net_worth
        FROM portfolio p
        JOIN portfolio_holdings ph
            ON p.portfolio_id = ph.portfolio_id
        JOIN nav_history nh
            ON ph.fund_id = nh.fund_id
        WHERE p.investor_id = '${investorId}';`,

        (error, result) => {

            if (error) {
                callback(error, null);
            } else {
                console.log("NAV Calculated Successfully");
                callback(null, result.rows);
            }

        }
    );

};






module.exports = {loginUser, logoutUser,getInvestorById,
    getInvestorHoldings,
    calculateNAV,createInvestor, invalidTokens}