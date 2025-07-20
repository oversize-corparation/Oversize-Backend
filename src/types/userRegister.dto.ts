export interface UserRegisterInterface {
    lastname: string, 
    firstname: string, 
    phone_number: string,
    avatar_url?: string,
    verify_email?: boolean,
    role_id?: number,
    email:string,
    password: string,
}