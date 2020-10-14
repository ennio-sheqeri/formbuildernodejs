
var config = {};

config.redis={};

config.mongodb = "mongodb://localhost/formbuilder";


config.redis.host = 'localhost';
//config.redis.host = '192.168.33.10';

config.redis.port = 6379;



config.smtpConfig = {
    host: 'deffmsmtp01.emea.tpg.ads',
    port: 25,
    tls: {
        rejectUnauthorized: false
    },
    secure: false // use SSL
};





module.exports = config;
