import logo from '../assets/images/logo.png';

export const GENERATE_TOKEN_URL = `${process.env.REACT_APP_API_SERVICE_HOST}/api/v1/misc/generate-token`;
export const COMPANY_NAME = 'Sariska';
export const COMPANY_LOGO = logo;
export const GET_PRESIGNED_URL = `${process.env.REACT_APP_API_SERVICE_HOST}/api/v1/misc/get-presigned`;

//For Sariska
//export const GENERATE_TOKEN_URL = process.env.NODE_ENV === 'development' ? "https://api.dev.sariska.io/api/v1/misc/generate-token" : "https://api.sariska.io/api/v1/misc/generate-token";
