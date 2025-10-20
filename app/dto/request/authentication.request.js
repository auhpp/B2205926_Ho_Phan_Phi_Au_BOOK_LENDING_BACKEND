class AuthenticationRequest {
    constructor(payload, role) {
        this.userName = payload.userName;
        this.password = payload.password;
        this.role = role;
    }
}

export default AuthenticationRequest;