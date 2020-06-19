const service = require('./../service/service');

const assess = async(request, response) => {
    const gradeFE = request.body;
    if (gradeFE.value && gradeFE.userId && gradeFE.phaseName && gradeFE.projectId) {
        try {
            await service.service.assess(gradeFE);
            response.status(200).send({
                message: 'Assessed successfully.'
            });
        } catch(err) {
            response.status(500).send({
                finalGrade: err.message
            });
        }
    }
    else {
        response.status(400).send({
            message: 'Fields missing!'
        });
    }
};

module.exports = {
    assess
};