let baseURL:string;
baseURL='';

if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://localhost:4005';
}

if (process.env.NODE_ENV === 'production') {
  baseURL = 'https://devnotes-bui.herokuapp.com';
}

export default baseURL;