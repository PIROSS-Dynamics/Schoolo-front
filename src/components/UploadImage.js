// src/components/UploadImage.js
import React, { useState } from 'react';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const UploadImage = () => {
  const [image, setImage] = useState(null);
  const [imageURL, setImageURL] = useState(''); // État pour l'URL de l'image

  const handleImageUpload = (e) => {
    setImage(e.target.files[0]);
  };

  const uploadImage = () => {
    if (image == null) return;

    const imageRef = ref(storage, `images/${image.name}`);
    uploadBytes(imageRef, image).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setImageURL(url); // Met à jour l'état avec l'URL de l'image
        console.log('Image uploaded and available at:', url);
      });
    });
  };

  return (
    <section className="UploadImage" >
      <div >
        <input type="file" onChange={handleImageUpload} />
        <button onClick={uploadImage}>Upload Image</button>
        {imageURL && <img src={imageURL} alt="Uploaded" style={{ marginTop: '20px', width: '300px' }} />}
      </div>
    </section>
  );
};

export default UploadImage;
