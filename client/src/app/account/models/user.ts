export class User {
    userName: string;
    name: string;
    imageUrl?: string;
}


export class UserVm {
    constructor(public userName: string = '', public password: string = '') {
    }
}
