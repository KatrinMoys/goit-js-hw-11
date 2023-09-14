import { UnsplashAPI } from './js/api-servis';
import { createGalleryCards } from './js/gallery-cards';
import './css/index.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";


const searchFormEl = document.querySelector('#search-form');
const galleryEl = document.querySelector('.gallery');
const intersectingEl = document.querySelector('.js-intersecting-element');

let sumOfPhotos = 0;

const unsplashAPI = new UnsplashAPI();

const observerOptions = {
  root: null,
  rootMargin: '0px 0px 600px 0px',
  threshold: 1.0,
};

const onIntersectingElIntersectingViewport = async entries => {

  if (!entries[0].isIntersecting) {
    return;
  }

   unsplashAPI.page += 1;
    
  try { 

    const { data } = await unsplashAPI.fetchPhotosByQuery();

    galleryEl.insertAdjacentHTML('beforeend', createGalleryCards(data.hits));

    lightbox.refresh();
    
    sumOfPhotos += data.hits.length; 
      
    if (sumOfPhotos >= data.totalHits) {
        
      observer.unobserve(intersectingEl);
      
      Notify.warning('We re sorry, but you ve reached the end of search results.');

      return;
      }

  } catch (err) { console.log(err) };

}

const observer = new IntersectionObserver(
  onIntersectingElIntersectingViewport,
  observerOptions
);


const onSearchFormElSubmit = async event => {

  event.preventDefault();

  observer.unobserve(intersectingEl);

  galleryEl.innerHTML = '';
   
  unsplashAPI.query = event.target.elements.searchQuery.value.trim();
  
  unsplashAPI.page = 1;

    // let sumOfPhotos = 0;
    // if (unsplashAPI.query === '') {
    //     return
    // }
  
  try {
    const { data } = await unsplashAPI.fetchPhotosByQuery();

    sumOfPhotos = 0 + data.hits.length;
    console.log(sumOfPhotos)
 
    if (data.totalHits === 0) {
          
      Notify.failure('Sorry, there are no images matching your search query. Please try again.');

      event.target.reset();

      galleryEl.innerHTML = '';

      observer.unobserve(intersectingEl);

        return;
    }
    console.log(data)
    

    galleryEl.innerHTML = createGalleryCards(data.hits);

    lightbox.refresh();

    Notify.success(`Hooray! We found ${data.total} images.`);
    
   
      observer.observe(intersectingEl);

    if (sumOfPhotos === data.totalHits) {

      observer.unobserve(intersectingEl);
      
      return;
   }

   } catch (err) { console.log(err) };
  
 };

searchFormEl.addEventListener('submit', onSearchFormElSubmit);

var lightbox = new SimpleLightbox('.photo-card a', {
    captionsData: 'alt',
    captionDelay: 250,
});