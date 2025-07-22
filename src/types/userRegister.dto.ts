export interface UserRegisterInterface {
    id?:number,
    firstname: string, 
    lastname: string, 
    email:string,
    phone_number: string,
    is_active?: boolean,
    role_id?: number,
    password: string,
    avatar_url?: string,
    verify_email?: boolean,
    created_at?: Date,
    updated_at?: Date
}