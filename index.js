require('dotenv').config();
const pool = require('./db/postgres-connection');
const HEARTBEAT_UPDATE_MS = 2000;
let client = null;

// keeping single client for file
const getClient = async () => {
    if (!client) {
        client = await pool.connect();
    }

    return client;
}

/** updates heart beat in every few seconds */
const updateHeartBeat = async () => {
    try {
        const client = await getClient();
        const query = `INSERT INTO public.system_status(
                        time_stamp, is_system_up)
                        VALUES (now(), true);`

        await client.query(query)
    } catch (e) {
        console.log(e);
        // absorbed error intentionally
    }
}

/**
 * updates system heart beat
 */
const sendHeartBeat = async () => {
    setInterval(() => {
        updateHeartBeat();
    }, HEARTBEAT_UPDATE_MS);
}

/**
 * returns next id according to offset
 * @param {Number} offset - records to be offset 
 * @returns {Numver} - next id
 */
const getPaginatedData = async (offset) => {
    const client = await getClient();
    const query = `SELECT id FROM jobs_raw where is_valid is null
                order by id asc
                offset $1 limit 1;`;


    const jobsRawData = await client.query(query, [offset]);

    return (jobsRawData && jobsRawData.rows && jobsRawData.rows[0] && jobsRawData.rows[0].id) || null;
}

/**
 * returns leveshtein distance data according to a record id
 * @param {Number} id 
 * @returns {Array} - array of objects containing data
 */
const getLevenshteinDistanceData = async (id) => {
    const client = await getClient();

    const query = `SELECT count(*) as count, source_type, json_agg(id) AS ids_list FROM jobs_raw
        where levenshtein(title, (select title from jobs_raw where id = $1)) <= 
        (select ((length(title)*2)/10) from jobs_raw where id = $1)
        and is_valid is null
        group by source_type order by count`;

    const data = await client.query(query, [id]);

    return data.rows;
}

/**
 * marks records as valid or invalid
 * @param {Array} distanceData 
 * @returns {Void} - empty
 */
const markRecordsAsValidOrInvalid = async (distanceData) => {
    const client = await getClient();
    for (let i = 0; i < distanceData.length; i++) {
        if (i === 0) {
            const query = `UPDATE jobs_raw set is_valid = true where id = ANY ($1)`;
            await client.query(query, [distanceData[i].ids_list]);
        } else {
            const query = `UPDATE jobs_raw set is_valid = false where id = ANY ($1)`;
            await client.query(query, [distanceData[i].ids_list]);
        }
    }
}

/**
 * updates records is_valid status
 * @returns {Void} - null
 */
const updateRecordStatus = async () => {
    try {
        sendHeartBeat();
        let isDataAvailable = true;

        while (isDataAvailable) {
            // always getting only one document
            // as we have condition to get on ones where is_valid is null
            const jobRawDataid = await getPaginatedData(0);

            if (jobRawDataid) {
                const distanceData = await getLevenshteinDistanceData(jobRawDataid);

                if (distanceData && distanceData.length) {
                    // process things
                    // instead of keeping data in storage and marking at the end
                    // marking while processing
                    await markRecordsAsValidOrInvalid(distanceData);
                }
            } else {
                isDataAvailable = false;
            }
        }

        console.log('Done with data processing! GoodBye!');
        process.exit(0);
    } catch (e) {
        console.log(e);
        process.exit(1);
    }
};

if (require.main === module) {
    if (process.argv[2] === 'complete') {
        updateRecordStatus();
    } else {
        console.log('Invalid input');
    }
} else {
    module.exports = {
        updateRecordStatus,
    };
}
