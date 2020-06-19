const service = require('./../service/service');

//post register
const createUser = async(request, response) => {
    const userFE = request.body;
    console.log(userFE);
    if (userFE.name && userFE.email && userFE.password) {
        try {
            service.service.register(userFE);
            
            response.status(201).send({
                message: 'User created successfully!'
            });
        }
        catch (err) {
            response.status(404).send({
                message: err.message
            });
        }
    }
    else {
        response.status(400).send({
            message: 'Fields missing!'
        });
    }
};

//post login user
const loginUser = async(request, response) => {
    const userFE = request.body;
    if (userFE.email && userFE.password) {
        try {
            const result = await service.service.login(userFE);
            response.status(200).send({
                message: "Logged in successfully.",
                idUser: result.idUser,
                idTeam: result.idTeam
            });
        }
        catch (err) {
            response.status(404).send({
                message: err.message
            });
        }
    }
    else {
        response.status(400).send({
            message: 'Fields missing'
        });
    }
};

const getUser = async(request, response) => {
    const userId = request.params.idUser;
    if (userId) {
        try {
            const result = await service.service.userInfo(userId);
            response.status(200).send({
                result
            });
        }
        catch (err) {
            response.status(404).send({
                message: err.message
            });
        }
    }
    else {
        response.status(400).send({
            message: 'Fields missing'
        });
    }
};

//post register-teacher
const createTeacher = async(request, response) => {
    const userFE = request.body;
    if (userFE.name && userFE.email && userFE.password) {
        try {
            await service.service.registerTeacher(userFE);
            response.status(201).send({
                message: 'User created successfully!'
            });
        }
        catch (err) {
            response.status(404).send({
                message: err.message
            });
        }
    }
    else {
        response.status(400).send({
            message: 'Fields missing!'
        });
    }
}

const getUserByEmail = async(request, response) => {
    const user = request.body;
    if (user.email) {
        try {
            const result = await service.service.userByEmail(user.email);
            response.status(200).send({
                result
            });
        }
        catch (err) {
            response.status(404).send({
                message: err.message
            });
        }
    }
    else {
        response.status(400).send({
            message: 'Fields missing'
        });
    }
}

module.exports = {
    createUser,
    loginUser,
    getUser,
    createTeacher,
    getUserByEmail
};
