export class GetUserDto {
    id: string;
    email: string;
    isActivated: boolean;
    roles: string[]
    constructor(model){
        this.id = model.id;
        this.email = model.email;
        this.isActivated = model.isActivated;
        this.roles = model.roles;
    }
}
