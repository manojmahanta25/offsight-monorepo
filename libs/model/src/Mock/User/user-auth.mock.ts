export let UserAuthMock = [];

const mockUserAuthModel = {
    findOne: jest.fn(),
    destroy: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findAll: jest.fn(),
};

mockUserAuthModel.destroy.mockImplementation((options) => {
    if (options.where) {
        if (options.where.id) {
            UserAuthMock = UserAuthMock.filter((userAuth) => userAuth.id !== options.where.id);
        }
    }
    return Promise.resolve([1,[UserAuthMock]]);
});

mockUserAuthModel.create.mockImplementation((options) => {
    const userAuth = options;
    userAuth.id = UserAuthMock.length + 1;
    UserAuthMock.push(userAuth);
    return Promise.resolve(userAuth);
});

mockUserAuthModel.update.mockImplementation((options) => {
    console.log('update',options);

    return Promise.resolve([1,[UserAuthMock]]);
});

mockUserAuthModel.findOne.mockImplementation((options) => {
    let result = UserAuthMock;
    if (options.where) {
        if (options.where.id) {
            result = result.filter((userAuth) => userAuth.id === options.where.id);
        }
        if (options.where.userId) {
            result = result.filter((userAuth) => userAuth.userId === options.where.userId);
        }
        if (options.where.clientId) {
            result = result.filter((userAuth) => userAuth.userSid === options.where.clientId);
        }
        if (options.where.device_identifier) {
            result = result.filter((userAuth) => userAuth.device_identifier === options.where.device_identifier);
        }
        if (options.where.refresher_token) {
            result = result.filter((userAuth) => userAuth.refresher_token === options.where.refresher_token);
        }
    }
    if (result.length < 1) {
        return Promise.resolve(null);
    }
    return Promise.resolve(result[0]);
});

mockUserAuthModel.findAll.mockImplementation((options) => {
    let result = UserAuthMock;
    if (options.where) {
        if (options.where.id) {
            result = result.filter((userAuth) => userAuth.id === options.where.id);
        }
        if (options.where.userId) {
            result = result.filter((userAuth) => userAuth.userId === options.where.userId);
        }
        if (options.where.clientId) {
            result = result.filter((userAuth) => userAuth.userSid === options.where.clientId);
        }
        if (options.where.device_identifier) {
            result = result.filter((userAuth) => userAuth.device_identifier === options.where.device_identifier);
        }
        if (options.where.refresher_token) {
            result = result.filter((userAuth) => userAuth.refresher_token === options.where.refresher_token);
        }
    }
    return Promise.resolve(result);
});

export default mockUserAuthModel;