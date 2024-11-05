describe('GET /tasks', () => {

    beforeEach(() => {
        cy.fixture('tasks/get').then(function (tasks) {
            this.tasks = tasks;
        })
    })

    it('list tasks', function () {

        const { user, tasks } = this.tasks.list

        cy.task('removeUser', user.email)
        cy.postUser(user)

        cy.task('removeTasksLike', 't4sk')

        cy.postSession(user)
            .then(userResp => {
                tasks.forEach(task => {
                    cy.postTask(task, userResp.body.token)
                });

                cy.getTasks(userResp.body.token)
                    .then(response => {
                        expect(response.status).to.eq(200)
                    }).its('body')
                    .should('be.an', 'array')
                    .and('have.length', tasks.length)
            })

    })
})

describe('GET /tasks/:id', () => {
    beforeEach(function () {
        cy.fixture('tasks/get').then(function (tasks) {
            this.tasks = tasks
        })
    })

    it('get unique task', function () {
        const { user, task } = this.tasks.unique

        cy.task('removeTask', task.name, user.email)
        cy.task('removeUser', user.email)
        cy.postUser(user)

        cy.postSession(user)
            .then(userResp => {
                cy.postTask(task, userResp.body.token)
                    .then(taskResp => {
                        cy.getUniqueTask(taskResp.body._id, userResp.body.token)
                            .then(response => {
                                expect(response.status).to.eq(200)
                            })
                    })
            })
    })

    it('task not found', function () {
        const { user, task } = this.tasks.notFound

        cy.task('removeTask', task.name, user.email)
        cy.task('removeUser', user.email)
        cy.postUser(user)

        cy.postSession(user)
            .then(userResp => {
                cy.postTask(task, userResp.body.token)
                    .then(taskResp => {

                        cy.deleteTask(taskResp.body._id, userResp.body.token)
                        .then(response =>
                            expect(response.status).to.eq(204)
                        )

                        cy.getUniqueTask(taskResp.body._id, userResp.body.token)
                            .then(response => {
                                expect(response.status).to.eq(404)
                            })
                    })
            })
    })
})

