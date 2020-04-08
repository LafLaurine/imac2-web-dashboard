/**
 * @brief API keys and links
 */

const DevEnvironment = {
    production: false,
    dbNomicsUrl: 'http://localhost:3001/'
};

const ProdEnvironment = {
    production: true,
    dbNomicsUrl: 'https://api.db.nomics.world'
};

const Environment = (process.env.NODE_ENV === 'production') ? ProdEnvironment : DevEnvironment;
export default Environment;
