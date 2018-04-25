export interface User {
    username: string,
}

export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterCredentials {
    username: string;
    password: string;
}

export interface State {
    user?: User,
    pending: boolean, 
}

export interface Getters {
    user: User,
    isLoggedIn: boolean,
    isLoggingIn: boolean,
}

export interface Mutations {
    setUser: User,
    setPending: boolean,
}

export interface Actions {
    logout: void,
    authenticate: {},
    login: LoginCredentials,
    register: RegisterCredentials,
}
