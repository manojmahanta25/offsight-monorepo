import {ClientModel, UserAuthModel, UserClientPivotModel} from "@app/model";
import {UserClientPivotMock} from "@app/model/Mock/User/user-client-pivot.mock";
import {ClientMock} from "@app/model/Mock/Client/cilent.mock";

export let UserMock: any = [
    {
        id: 1,
        firstName: 'Test User with Single Client',
        lastName: 'Manager',
        email: 'manoj@supertal.io',
        username: 'manager@single.test.com',
        barcodeId: 'test.single-client',
        phoneNumber: '',
        password: 'b56e0b4ea4962283bee762525c2d490f',
        profileImage: '',
        timeZone: '-0400',
        isActive: true,
        user2faEnable: false,
        userSid: null,
        userSlug: 'e422a0bc-0ec1-44c6-a125-e3b7a1052ec0',
        isFirstTime: true,
        clients: [],
        userAuths:[],
        userClientPivots: [],
    },
    {
        id: 2,
        firstName: 'Test User with Multiple Client',
        lastName: 'Manager',
        email: 'manoj@supertal.io',
        username: 'manager@multi.test.com',
        barcodeId: 'test.multi-client',
        phoneNumber: '',
        password: 'b56e0b4ea4962283bee762525c2d490f',
        profileImage: '',
        timeZone: '-0400',
        user2faEnable: false,
        userSid: null,
        userSlug: '674b6365-57d8-43fc-9a6b-0191117a6a31',
        isFirstTime: true,
        clients: [],
        userAuths:[],
        userClientPivots: [],
    }
]


const mockUserModel = {
    findOne: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
};

mockUserModel.findOne.mockImplementation((options) => {
    let result = UserMock;
    if (options.where) {
        if (options.where.username) {
            result = result.filter((user) => user.username === options.where.username);
        }
        if (options.where.email) {
            result = result.filter((user) => user.email === options.where.email);
        }
        if (options.where.id) {
            result = result.filter((user) => user.id === options.where.id);
        }
        if (options.where.userSlug) {
            result = result.filter((user) => user.userSlug === options.where.userSlug);
        }
        if(options.where.barcodeId){
            result = result.filter((user) => user.barcodeId === options.where.barcodeId);
        }
    }
    if (result.length < 1) {
        return Promise.resolve(null);
    }
    let user = result[0]
    if (options.include) {
        if (options.include.includes(ClientModel)) {
            const userPivot = UserClientPivotMock.filter((userPivot) => userPivot.userId === user.id);
            const clientIds = userPivot.map((pivot) => pivot.clientId);
            user.clients = ClientMock.filter((client) => clientIds.includes(client.id));
        }
        if (options.include.map((include) => include.model).includes(UserClientPivotModel)) {
            user.userClientPivots = UserClientPivotMock.filter((userPivot) => userPivot.userId === user.id);
            const condition = options.include.find((include) => include.model === UserClientPivotModel).where;
            if(condition.clientId){
                user.clients = user.clients.filter((client) => client.id === condition.clientId);
                user.userClientPivots = user.userClientPivots.filter((userPivot) => userPivot.clientId === condition.clientId);
            }
        }
    }
    return Promise.resolve(user);
})

mockUserModel.findAll.mockImplementation((options) => {
    let result = UserMock;
    if (options.where) {
        if (options.where.username) {
            result = result.filter((user) => user.username === options.where.username);
        }
        if (options.where.email) {
            result = result.filter((user) => user.email === options.where.email);
        }
        if (options.where.id) {
            result = result.filter((user) => user.id === options.where.id);
        }
        if (options.where.userSlug) {
            result = result.filter((user) => user.userSlug === options.where.userSlug);
        }
        if(options.where.barcodeId){
            result = result.filter((user) => user.barcodeId === options.where.barcodeId);
        }
    }
    if (result.length < 1) {
        return Promise.resolve(null);
    }
    result.map((user) => {
        if (options.include) {
            if (options.include.includes(ClientModel)) {
                const userPivot = UserClientPivotMock.filter((userPivot) => userPivot.userId === user.id);
                const clientIds = userPivot.map((pivot) => pivot.clientId);
                user.clients = ClientMock.filter((client) => clientIds.includes(client.id));
            }
            if (options.include.map((include) => include.model).includes(UserClientPivotModel)) {
                user.userClientPivots = UserClientPivotMock.filter((userPivot) => userPivot.userId === user.id);
                const condition = options.include.find((include) => include.model === UserClientPivotModel).where;
                if (condition.clientId) {
                    user.clients = user.clients.filter((client) => client.id === condition.clientId);
                    user.userClientPivots = user.userClientPivots.filter((userPivot) => userPivot.clientId === condition.clientId);
                }
            }
        }
        return user;
    })
    if(options.include){
        if(options.include.map((include) => include.model).includes(UserClientPivotModel)){
            result = result.filter((user) => user.userClientPivots.length > 0);
        }
       if(options.include.includes(ClientModel)){
            result = result.filter((user) => user.clients.length > 0);
        }
    }


    return Promise.resolve(result);
})

mockUserModel.update.mockImplementation((data, options) => {
    // update partial properties
    if (options.where) {
        if (options.where.id) {
            UserMock = UserMock.map((user) => {
                if (user.id === options.where.id) {
                    return { ...user, ...data };
                }
                return user;
            });
        }
        if (options.where.userSlug) {
            UserMock = UserMock.map((user) => {
                if (user.userSlug === options.where.userSlug) {
                    return { ...user, ...data };
                }
                return user;
            });
        }
    }
    return Promise.resolve([1, UserMock]);
})


export default mockUserModel;