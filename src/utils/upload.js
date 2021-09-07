import axios from 'axios';
import { getURL } from '../utils/common';

export const upload = (images, folders) => {
  // let runningPaperPromise = null, routePermitPromise = null;
  if (!(images instanceof (Array))) {
    images = [images];
  }
  if (!(folders instanceof (Array))) {
    folders = images.map(() => folders);
  }
  return Promise.all(images.map((image, i) => {
    let formData = new FormData();
    formData.append("image", image)
    return axios.post(getURL(`upload/${folders[i]}`), formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    }).then(response => {
      return response.data.file.id
    })
      .catch((err) => {
        console.log(err)
      });
  }));
}
