export interface UsuarioModel {
  userId?:            number;
  name:              string;
  email:             string;
  password:          string;
  phoneNumber:       string;
  location:          string;
  preferredLanguage: string;
  status:            boolean;
  rolId:             number;
}

export interface UsuarioStringModel {
  name:              string;
  email:             string;
  password:          string;
  phoneNumber:       string;
  location:          string;
  preferredLanguage: string;
  status:            boolean;
  rolId:             number;
  rolIdString:       string;
}

export interface LoginModel {    
    email: string;
    password: string;
}

export interface PasswordModel {    
  passwordAntigua: string;
  passwordNueva: string;
}

export interface UsuarioPuntosModel {
  userPointsId: number;
  points:      number;
  description: string;
}