const configuration = require('./../config/configuration.json');
const Sequelize = require('sequelize');

const DB_NAME = configuration.database.database_name;
const DB_USER = configuration.database.username;
const DB_PASS = configuration.database.password;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
    dialect: 'mysql' 
});

sequelize.authenticate().then(() => {
    console.log('Database connection success!');
}).catch(err => {
    console.log(`Database connection error: ${err}`);
});


class Grade extends Sequelize.Model {}
Grade.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    value: {
        type: Sequelize.INTEGER,
        allowNull: true
    }
}, { sequelize, modelName: 'grade' });


class Phase extends Sequelize.Model {}
Phase.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    phaseName: {
        type: Sequelize.STRING,
        allowNull: false
    },
    linkServer: {
        type: Sequelize.STRING,
        allowNull: false
    },
    linkVideo: {
        type: Sequelize.STRING,
        allowNull: true
    }
}, { sequelize, modelName: 'phase' });

class Project extends Sequelize.Model {}
Project.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    finalGrade: {
        type: Sequelize.FLOAT,
        allowNull: true
    }
}, { sequelize, modelName: 'project' });

class Team extends Sequelize.Model {}
Team.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false
    }
}, { sequelize, modelName: 'team' });

class User extends Sequelize.Model {}
User.init({
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    password: {
        type: Sequelize.STRING,
        allowNull: false
    },
    isLeader: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    isProfessor: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    },
    isAssessor: {
        type: Sequelize.BOOLEAN,
        allowNull: false
    }
}, { sequelize, modelName: 'user' });


User.hasMany(Grade); //in grade se creeza userId
Team.hasMany(Project); //in project se creeaza teamId
Project.hasMany(Phase); //in phase se creeaza projectId
Phase.hasMany(Grade); //in grade se creeaza phaseId
Team.hasMany(User); //in user se creeaza teamId

User.sync();
Team.sync();
Project.sync();
Phase.sync();
Grade.sync();

module.exports = {
    User,
    Project,
    Team,
    Phase,
    Grade
};