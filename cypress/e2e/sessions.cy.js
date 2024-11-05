describe('POST /sessions', () => {

    beforeEach(() => {
        cy.fixture('users').then(function(users) {
            this.users = users
        })
    })

    it('user session', function () {

        const userData = this.users.session

        cy.task('removeUser', userData.email)
        cy.postUser(userData)

        cy.postSession(userData)
            .then(response => {
                expect(response.status).to.eq(200)

                const { user, token } = response.body

                expect(user.name).to.eq(userData.name)
                expect(user.email).to.eq(userData.email)
                expect(token).not.to.be.empty
            })
    })

    it('invalid password', function () {
        
        const user = this.users.invalidPassword 

        cy.postSession(user)
            .then(response => {
                expect(response.status).to.eq(401)
            })
    })

    it('email not found', function () {
        const user = this.users.email404

        cy.postSession(user)
            .then(response => {
                expect(response.status).to.eq(401)
            })
    })
})

