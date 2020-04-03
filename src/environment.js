/**
 * @brief API keys and links
 */

const DevEnvironment = {
    production: false,
    testUrl: 'http://localhost:3001/users'
};

const ProdEnvironment = {
    production: true,
    testUrl: 'TODO'
};

const Environment = (process.env.NODE_ENV === 'production') ? ProdEnvironment : DevEnvironment;
export default Environment;
