const Sequelize = require('sequelize');
const { Grade } = require("./../models/modelbuilder");
const { Team } = require("./../models/modelbuilder");
const { User } = require("./../models/modelbuilder");
const { Phase } = require("./../models/modelbuilder");
const { Project } = require("./../models/modelbuilder");

const service = {
    register: async(userFE) => {
        const existentUser = await User.findOne({ //cautam user care are email-ul transmis din front-end
            where: { email: userFE.email }
        });

        if (existentUser) { //daca exista - inseamna ca emailul este deja folosit - se arunca exceptie
            throw new Error("User already exists.");
        }
        else { //daca nu exista 
            var team;

            if (userFE.isLeader === true) { //se verifica daca user-ul este leader //daca da
                team = await Team.findOne({ //cautam echipa cu numele dat din front-end
                    where: { name: userFE.teamName },
                    raw: true
                });

                if (team == null) { //daca nu exista echipa - o cream
                    await Team.create({
                        name: userFE.teamName
                    });
                }
                else { //daca echipa exista deja - se arunca exceptie
                    throw new Error("Team already exists.");
                }
            }

            team = await Team.findOne({ //cautam echipa cu numele dat de user in front-end //daca user-ul e lider, echipa tocmai a fost creata, dar daca nu e lider trebuie sa verificam ca echipa la care vrea sa adere exista
                where: { name: userFE.teamName },
                raw: true
            });

            if (team) { //daca exista 
                await User.create({ //cream user-ul
                    name: userFE.name,
                    email: userFE.email,
                    password: userFE.password,
                    isLeader: userFE.isLeader,
                    isProfessor: userFE.isProfessor,
                    isAssessor: false, //pentru ca inca nu a incarcat proiectul
                    teamId: team.id
                });
            }
            else { //daca nu exista - se arunca exceptie
                throw new Error("Team doesn't exist.");
            }
        }
    },

    registerTeacher: async(userFE) => {
        const existentUser = await User.findOne({
            where: { email: userFE.email }
        });

        if (existentUser) {
            throw new Error("User already exists.");
        }
        else {
            await User.create({
                name: userFE.name,
                email: userFE.email,
                password: userFE.password,
                isLeader: userFE.isLeader,
                isProfessor: userFE.isProfessor,
                isAssessor: false
            });
        }
    },

    login: async(userFE) => {
        const existentUser = await User.findOne({ //cautam user-ul care are email-ul dat in front-end 
            where: { email: userFE.email }
        });
        if (existentUser && existentUser.password === userFE.password) { //daca exista si parola introdusa este corecta
            const response = { //construim raspuns in care punem informatii necesare afisarii corespunzatoare a paginilor urmatoare
                idUser: existentUser.id,
                idTeam: existentUser.teamId
            };
            return response;
        }
        else { //daca nu - se arunca exceptie
            throw new Error("Invalid credentials.");
        }
    },

    //metoda pentru afisarea datelor user-ului logat
    userInfo: async(userId) => {
        const user = await User.findByPk(userId);
        const team = await Team.findByPk(user.teamId);

        const resultUser = {
            name: user.name,
            email: user.email,
            teamName: team.name,
            isLeader: user.isLeader
        };
        return resultUser;
    },

    userByEmail: async(userEmail) => {
        const existentUser = await User.findOne({
            where: { email: userEmail }
        });
        if (existentUser) {
            const response = {
                user: existentUser,
                isProfessor: existentUser.isProfessor
            }
            return response;
        }
        else {
            throw new Error("Invalid credentials.");
        }
    },

    assess: async(gradeFE) => {
        if (parseInt(gradeFE.value) < 0) { //se verifica valoarea notei data de evaluator in front-end
            throw new Error("Invalid grade value.");
        }
        else {
            const phase = await Phase.findOne({ //cautam faza cu id-ul proiectului venit din front-end 
                where: {
                    projectId: gradeFE.projectId,
                    phaseName: gradeFE.phaseName
                }
            });

            await Grade.update({ //se updateaza nota din null in value cu ce a dat evaluatorul in front-end
                value: gradeFE.value
            }, {
                where: {
                    phaseId: phase.id,
                    userId: gradeFE.userId
                }
            });

            var project = await Project.findOne({ //cautam toate notele primite de proiect pana acum
                where: { id: gradeFE.projectId },
                include: {
                    model: Phase,
                    include: {
                        model: Grade
                    }
                }
            });

            var ok = 0; //contor

            for (let phas of project.phases) { //pentru fiecare faza a proiectului
                for (let grade of phas.grades) { //pentru fiecare nota a fiecarei faze 
                    if (grade) { //daca nota este pusa
                        ok++; //crestem contorul (numaram cate note s-au dat proiectului pana acum)
                    }
                }
            }

            if (ok == 15) { //cand ok este 15 (5 evaluatori * 3 faze) => putem calcula nota finala
                const gradeList = await Phase.findAll({ //caut toate notele din toate fazele pentru un proiect
                    where: { projectId: gradeFE.projectId },
                    include: {
                        model: Grade
                    }
                });

                var grades = []; //vector de note pentru notele unui proiect

                for (let phase of gradeList) { //pentru fiecare faza
                    for (let grade of phase.grades) { //pentru fiecare nota a fiecarei faze
                        grades.push(parseInt(grade.value)); //adaugam in vector nota
                    }
                }

                const finalGrade = calculateFinalGrade(grades); //nota finala se calculeaza prin functia apelata cu parametrul vectorul de mai sus
                await Project.update({ //se updateaza nota finala in tabela de proiecte
                    finalGrade: finalGrade
                }, {
                    where: {
                        id: gradeFE.projectId
                    }
                });
                return finalGrade;
            }
        }
    },

    uploadProject: async(phaseFE) => {
        //verificam daca este prima inserare a proiectului in bd (faza 1 - upload 1)
        
        var project = await Project.findOne({
            where: {
                teamId: phaseFE.idTeam,
                name: phaseFE.nameProject
            }
        });

        //liniile 189 - 213 se realizeaza doar daca proiectul e la primul upload. Altfel, dupa linia 185 se trece direct la 216.
        //daca da
        if (project == null) {
            //verificam daca exista un proiect cu acelasi nume in bd 
            project = await Project.findOne({
                where: { name: phaseFE.nameProject }
            });
            //daca nu
            if (project == null) {
                //cream proiectul
                await Project.create({
                    name: phaseFE.nameProject,
                    teamId: phaseFE.idTeam
                });
                //si extragem informatiile proiectului nou creat
                project = await Project.findOne({
                    where: {
                        teamId: phaseFE.idTeam,
                        name: phaseFE.nameProject
                    },
                });
            }
            //daca da - se arunca exceptie
            else {
                throw new Error("Project name already used.");
            }
        }

        //dupa ce s-a creat proiectul/extras informatii verificam daca exista un upload facut in faza aleasa de user in front-end 
        var phase = await Phase.findOne({
            where: {
                projectId: project.id,
                phaseName: phaseFE.name
            }
        });

        //daca exista o faza incarcata cu acelasi nume (faza 1 e incarcata deja si eu vreau sa incarc tot faza 1)
        if (phase) {
            //se updateaza informatiile
            var newLinkServer = phase.linkServer; //noul linkServer e vechiul linkServer
            var newLinkVideo = phase.linkVideo; //noul linkVideo e vechiul linkVideo
            if (phaseFE.linkServer) { //daca userul a scris in front-end un alt linkServer
                newLinkServer = phaseFE.linkServer; //noul linkServer e cel din front-end
            }
            if (phaseFE.linkVideo) { //daca userul a scris in front-end un alt linkVideo
                newLinkVideo = phaseFE.linkVideo; //noul linkVideo e cel din front-end
            }

            //facem update ori cu informatia noua daca a venit din front-end ori cu cea veche in caz contrar
            await Phase.update({
                linkServer: newLinkServer,
                linkVideo: newLinkVideo
            }, {
                where: { projectId: project.id }
            });
        }
        else { //daca e prima incarcare a unei faze (am incarcat faza 1 si acum incarc faza 2)
            if (phaseFE.linkServer) { //daca mi-a dat userul linkServer - obligatoriu sa il puna
                await Phase.create({ //cream faza
                    phaseName: phaseFE.name,
                    linkServer: phaseFE.linkServer,
                    linkVideo: phaseFE.linkVideo,
                    projectId: project.id
                });
            }
            else { //daca nu - se arunca exceptie
                throw new Error("You must provide a link for server.");
            }
        }

        //odata ce echipa a incarcat proiectul, poate evalua alte proiecte - toti membrii echipei devin evaluatori
        await User.update({ isAssessor: true }, { where: { teamId: phaseFE.idTeam } });

        //construim lista de posibili evaluatori, dintre userii care au isAssessor pe true si care nu sunt in echipa de evaluat
        const projectAssessors = await User.findAll({
            where: {
                isAssessor: true,
                teamId: {
                    [Sequelize.Op.not]: phaseFE.idTeam
                }
            }
        });

        //selectam random 5 evaluatori
        const selectedAssessors = getFiveRandomAssessors(projectAssessors);

        //cautam faza corespunzatoare proiectului incarcat si cu numele fazei dat de utilizator in front-end si vom folosi mai jos id-ul ei
        phase = await Phase.findOne({
            where: {
                projectId: project.id,
                phaseName: phaseFE.name
            }
        });

        //in tabela de note se adauga id-ul fiecarui evaluator selectat impreuna cu id-ul fazei pe care trebuie sa o evalueze el
        for (let assessor of selectedAssessors) {
            await Grade.create({
                userId: assessor.id,
                phaseId: phase.id
            });
        }
    },

    //metoda ce aduce pentru un user lista cu proiectele pe care el trebuie sa le evalueze
    getProjects: async(idUser) => {
        const projectList = await Project.findAll({
            include: {
                model: Phase,
                include: {
                    model: Grade,
                    where: { userId: idUser }
                }
            }
        });

        var projectsFE = []; //lista ce va aparea in front-end (dinamic) cu proiectele pe care evaluatorul le are de evaluat
        for (let proj of projectList) { //pentru fiecare proiect
            if (proj.phases.length > 0) { //care are cel putin o faza
                for (let phas of proj.phases) { //pentru fiecare faza
                    if (phas.grades.length > 0) { //care are cel putin o nota data sau de dat (poate fi null - ceea ce inseamna ca un evaluator a fost asignat)
                        for (let grade of phas.grades) { //pentru fiecare nota
                            var projFE = { //se creaza un obiect in front-end (dinamic)
                                projectId: proj.id,
                                projectName: proj.name,
                                phaseName: phas.phaseName,
                                gradeValue: grade.value,
                                linkServer: phas.linkServer,
                                linkVideo: phas.linkVideo
                            };
                        }
                    }
                }
                projectsFE.push(projFE); //pun obiectul in lista 
            }
        }
        return projectsFE; //returnez lista
    },

    //metoda ce aduce (dinamic) in front-end lista cu proiectele pentru profesor
    getRows: async() => {
        const teams = await Team.findAll({
            include: {
                model: Project,
            }
        });

        var teamList = []; //lista de echipe

        for (let team of teams) { //pentru fiecare echipa 
            for (let proj of team.projects) { //pentru fiecare proiect al echipei
                var row = { //se construieste un rand ce va fi afisat in tabelul din front-end
                    teamName: team.name,
                    projectName: proj.name,
                    finalGrade: proj.finalGrade
                };
                teamList.push(row); //se adauga in lista
            }
        }
        return teamList; //se returneaza lista
    }
};

//metoda de algoritm random //projectAssessors = evaluatori posibili in total
const getFiveRandomAssessors = (projectAssessors) => {
    var noOfSelectedAssessors = 5;
    const selectedAssessors = [];
    const noOfAssessors = projectAssessors.length;
    var randomAssessorIndex;
    if (noOfAssessors <= 5) { //daca numarul de evaluatori este mai mic sau egal 5 ii returnam pe toti
        return projectAssessors;
    }
    else { //daca avem din ce sa alegem
        for (let i = 0; i < noOfSelectedAssessors; i++) {
            randomAssessorIndex = parseInt(Math.random() * projectAssessors.length); //calculez random pozitia de pe care iau un evaluator
            selectedAssessors.push(projectAssessors[randomAssessorIndex]); //adaugam in lista de evaluatori selectati
            projectAssessors.splice(randomAssessorIndex, 1); //elimin din lista de evaluatori posibili evaluatorul selectat mai sus
        }
        return selectedAssessors; //se returneaza lista
    }
};

const calculateFinalGrade = (grades) => {
    var sum = 0;
    var max = 0;
    var min = 10; //se initializeaza cu cea mai mare nota ca sa putem gasi mai tarziu un minim
    for (let i = 0; i < grades.length; i++) {
        if (grades[i] < min) {
            min = grades[i];
        }
        if (grades[i] > max) {
            max = grades[i];
        }
        sum += grades[i];
    }
    sum = sum - min - max;

    return sum.toFixed(2) / (grades.length - 2);
};

module.exports = {
    service
};
