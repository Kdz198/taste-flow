import { Eureka } from 'eureka-js-client';

export const eurekaClient = new Eureka({
    instance: {
        app: 'MENU-SERVICE', // Tên service
        instanceId: 'localhost:MENU-SERVICE:8083',
        hostName: 'localhost',
        ipAddr: '127.0.0.1',
        statusPageUrl: 'http://localhost:3000/info',
        port: {
            '$': 3000,
            '@enabled': true,
        },
        vipAddress: 'menu-service',
        dataCenterInfo: {
            '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
            name: 'MyOwn',
        },
    },
    eureka: {
        host: 'localhost',         // Host Eureka Server (Spring boot)
        port: 8761,                // Port Eureka Server
        servicePath: '/eureka/apps/',
    },
});
