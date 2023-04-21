exports.server = {
    port: 5000,
    host: '127.0.0.1',
    phost: '127.0.0.1',

    serverUrl() {
        return `http://${this.phost}:${this.port}`;
    },
    apiUrl() {
        return `http://${this.phost}:${this.port}/api`;
    }
};

exports.database = {
    host: "127.0.0.1",
    user: "root",
    password: "",
    db: "crelevator",
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
}

exports.config = {
    emailServer: 'email-smtp.eu-west-3.amazonaws.com',
    emailPort: 465,
    emailUser: 'AKIATTCGLGHVRG7FLSU7',
    emailPasswd: 'BM+ef9B2oAgXskMjYQIATPyGKcC3VWCOcM4qW60qR4Gj',
    adminEmail: 'contact@easyprez.fr',

    projectPath: 'public/WORKER',

    declareXML: '<?xml version="1.0" encoding="UTF-8"?>\n<!DOCTYPE mlt SYSTEM "https://raw.githubusercontent.com/mltframework/mlt/master/src/modules/xml/mlt-xml.dtd">',
};