
export let UserClientPivotMock = [
    {
        id: 1,
        userId: 1,
        clientId: 1,
        userType: 'IOT',
        userEmail: '',
        userGroupId: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 2,
        userId: 2,
        clientId: 1,
        userType: 'IOT',
        userEmail: '',
        userGroupId: 1,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    },
    {
        id: 3,
        userId: 2,
        clientId: 2,
        userType: 'IOT',
        userEmail: '',
        userGroupId: 3,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
    }

]

const mockUserClientPivotModel = {
    findOne: jest.fn(),
};

export default mockUserClientPivotModel;