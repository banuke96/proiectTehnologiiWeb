const service = require('./../service/service');

const uploadProject = async(request, response) => {
    const phaseFE = request.body;
    
    if (phaseFE.nameProject && phaseFE.name && (phaseFE.linkServer || phaseFE.linkVideo)) {
        try {
            await service.service.uploadProject(phaseFE);
            response.status(200).send({
                message: 'Project successfully uploaded.'
            });
        }
        catch (err) {
            if (err.message) {
                response.status(404).send({
                    message: err.message
                });
            }
            else {
                response.status(500).send({
                    message: 'Internal Server Error.'
                });
            }
        }
    }
    else {
        response.status(400).send({
            message: 'Fields missing'
        });
    }
};

const getProjects = async(request, response) => {
    const userId = request.params.idUser;
    if (userId) {
        try {
            const projectList = await service.service.getProjects(userId);
            response.status(200).send({
                list: projectList
            });
        }
        catch (err) {
            response.status(500).send({
                message: 'Internal Server Error.'
            });
        }
    }
    else {
        response.status(400).send({
            message: 'Fields missing'
        });
    }
};

const getRowsTeacher = async(request, response) => {
    try {
        const rows = await service.service.getRows();
        response.status(200).send({
            rows
        });
    }
    catch (err) {
        response.status(500).send({
            message: err.message
        });
    }
};

module.exports = {
    uploadProject,
    getProjects,
    getRowsTeacher
};