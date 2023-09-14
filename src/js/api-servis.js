import axios from 'axios';

export class UnsplashAPI {
  static BASE_URL = 'https://pixabay.com/api/';
  static API_KEY = '39381164-baeec6123c69d947a42ded8c3';

  constructor() {
    this.query = null;
    this.page = 1;
  }

  fetchPhotosByQuery() {
   
      const axiosOptions = {
          params: {
              key: UnsplashAPI.API_KEY,
              q: this.query,
              page: this.page,
              image_type: 'photo',
              per_page: 40,
              orientation: 'horizontal',
                     
          },
      }
     
          return axios.get(`${UnsplashAPI.BASE_URL}`, axiosOptions);
    };
}
  