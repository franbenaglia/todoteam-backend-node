const Eureka = require('eureka-js-client').Eureka;

const client = new Eureka({
    // application instance information
    instance: {
        app: 'todoteam-backend',
        instanceId: 'tt-backend',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        port: {
            '$': 8080,
            '@enabled': true,
        },
        vipAddress: 'tt-backend',
        registerWithEureka: true,
        fetchRegistry: true,
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        // eureka server host / port
        host: 'localhost',
        port: 8761,
        servicePath: '/eureka/apps/'
    },
});

const getPorts = () => {

    let ports = [];
    const instances = client.getInstancesByAppId('todoteam-sec');

    for (let i of instances.values()) {
        if (i.app === 'TODOTEAM-SEC') {
            console.log(i.port.$);
            ports.push(i.port.$);
        }
    }

    return ports;
};

module.exports = { client, getPorts };