let redisValue=[];

const redisMock = {
    setValueToRedis: jest.fn().mockImplementation((keyId, value) => {
        redisValue[keyId] = value;
    }),
    getValueToRedis: jest.fn().mockImplementation((keyId) => {
        return Promise.resolve(redisValue[keyId]);
    }),
    checkKeyExist: jest.fn().mockImplementation((keyId) => {
        const exist = redisValue[keyId] ? 1 : 0;
        return Promise.resolve(exist);
    }),
    delKey: jest.fn().mockImplementation((keyId) => {
        delete redisValue[keyId];
        return Promise.resolve(1);
    }),
}
export default redisMock;