const client = require("../pgManager");
const createSip = (sipData, callback) => {

    client.query(
        `INSERT INTO sip_registration (
            sip_id,
            portfolio_id,
            fund_id,
            sip_amount,
            sip_date,
            start_date,
            status
        )
        VALUES (
            '${sipData.sip_id}',
            '${sipData.portfolio_id}',
            '${sipData.fund_id}',
            '${sipData.sip_amount}',
            '${sipData.sip_date}',
            '${sipData.start_date}',
            '${sipData.status}'
        )
        RETURNING *;`,

        (error, result) => {

            if (error) {
                callback(error, null);
            } else {
                console.log("SIP Created Successfully");
                callback(null, result.rows);
            }

        }
    );

};

const getSipById = (sipId, callback) => {

    client.query(
        `SELECT * FROM sip_registration
         WHERE sip_id = '${sipId}';`,

        (error, result) => {

            if (error) {
                callback(error, null);
            } else {
                console.log("SIP Fetched Successfully");
                callback(null, result.rows);
            }

        }
    );

};

const processSip = (sipId, callback) => {

    client.query(
        `INSERT INTO investment_transaction (
            transaction_id,
            sip_id,
            fund_id,
            transaction_amount,
            nav_at_purchase,
            units_allocated,
            transaction_date
        )
        SELECT
            'TXN' || EXTRACT(EPOCH FROM NOW()),
            s.sip_id,
            s.fund_id,
            s.sip_amount,
            n.nav_value,
            (s.sip_amount / n.nav_value),
            CURRENT_DATE
        FROM sip_registration s
        JOIN nav_history n
        ON s.fund_id = n.fund_id
        WHERE s.sip_id = '${sipId}'
        ORDER BY n.nav_date DESC
        LIMIT 1
        RETURNING *;`,

        (error, result) => {

            if (error) {
                callback(error, null);
            } else {
                console.log("SIP Processed Successfully");
                callback(null, result.rows);
            }

        }
    );

};

const getSipTransactions = (sipId, callback) => {

    client.query(
        `SELECT * FROM investment_transaction
         WHERE sip_id = '${sipId}';`,

        (error, result) => {

            if (error) {
                callback(error, null);
            } else {
                console.log("SIP Transactions Fetched Successfully");
                callback(null, result.rows);
            }

        }
    );

};

module.exports = {
    createSip,
    getSipById,
    processSip,
    getSipTransactions
};