
export const ClientMock= [
    {
        id: 1,
        name: 'Apple',
        email: 'info@apple.com',
        phone: '',
        address: 'USA',
        city: 'USA',
        state: 'USA',
        country: 'USA',
        contactPerson: '',
        status: true,
        linkUsername: '',
        isTrack: true,
        squareLogo: '',
        logo: '',
    },
    {
        id: 2,
        name: 'Samsung',
        email: 'info@samsung.com',
        phone: '',
        address: 'Korea',
        city: 'Korea',
        state: 'Korea',
        country: 'Korea',
        contactPerson: '',
        status: true,
        linkUsername: '',
        isTrack: true,
        squareLogo: '',
        logo: '',
    },
]

const mockClientModel = {
    findOne: jest.fn(),
};


mockClientModel.findOne.mockImplementation((options) => {
    let result = ClientMock;
    if (options.where) {
        if(options.where.id) {
            result = result.filter((client) => client.id === options.where.id);
        }
    }
    if (result.length < 1) {
        return Promise.resolve(null);
    }
    return Promise.resolve(result[0]);
});

export default mockClientModel;