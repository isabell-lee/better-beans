import { useState } from 'react';
import { gql, useMutation } from '@apollo/client';
// import BeanSelected from './BeanSelected';
import axios from 'axios';
import { useAuth } from '../firebase/auth_context';

export default function CreateReview(props) {
  const Bean = '/bean-small.svg';
  const [rating, setRatings] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [photos, setPhotos] = useState([]);
  const [files, setFiles] = useState([]);
  const { authUser } = useAuth();

  const selectRating = (value) => {
    setRatings(value);
  };

  const CREATE_REVIEW = gql`
    mutation CreateReview(
      $name: String!
      $body: String!
      $rating: Int
      $shop_id: String!
      $user_id: String!
    ){
      createReview(
        name: $name
        body: $body
        rating: $rating
        shop_id: $shop_id
        user_id: $user_id
      ) {
        id
      }
    }
  `;

  const CREATE_PHOTO = gql`
    mutation CreatePhoto(
      $review_id: Int!
      $url: String!
    ) {
      createPhoto(
        review_id: $review_id
        url: $url
      ) {
        id
      }
    }
  `;

  const [createReview, { data, loading, err }] = useMutation(CREATE_REVIEW);
  const [createPhoto, { photoData }] = useMutation(CREATE_PHOTO);

  if (loading) return 'Submitting...';
  if (err) return `Submission error! $${err.message}`;

  // transfer photos to URL
  const handleAPI = (reviewId) => {
    for (let i = 0; i < files.length; i++) {
      let formData = new FormData();
      formData.append('file', files[i]);
      formData.append('upload_preset', 'asosdlts');

      axios.post('https://api.cloudinary.com/v1_1/dkw2yrk06/upload', formData)
        .then((response) => {
          createPhoto({
            variables: {
              review_id: reviewId,
              url: response.data.secure_url,
            },
          });
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    createReview({
      variables: {
        name: authUser.name,
        body: body,
        rating: rating,
        shop_id: 'Simple',
        user_id: authUser.uid,
      },
    })
      .then((res) => {
        handleAPI(res.data.createReview.id);
      })
      .catch((error) => console.log('Error creating review', error));
  };

  const handleImage = (e) => {
    e.preventDefault();
    if (e.target.files) {
      const fileArray = Array.from(e.target.files).map((file) => URL.createObjectURL(file));
      const selectedFileArray = Array.from(e.target.files);
      setFiles(prevFile => prevFile.concat(selectedFileArray));
      setPhotos(prevImg => prevImg.concat(fileArray));
      Array.from(e.target.files).map((file) => URL.revokeObjectURL(file));
      // handleAPI();
    }
  };

  const renderImg = (source) => {
    // console.log(authUser);
    return source.map(image => {
      return <img src={image} key={image} height="80"></img>;
    });
  };

  return (
    <div>
      {authUser.name}
      <div id="review">
        <form onSubmit={(e) => { handleSubmit(e); }}>
          <div>
            Select your rating
            <br />
            <img src={Bean} className={rating >= 1 ? 'selected' : 'selectBean'} onClick={() => selectRating(1)} />
            <img src={Bean} className={rating >= 2 ? 'selected' : 'selectBean'} onClick={() => selectRating(2)} />
            <img src={Bean} className={rating >= 3 ? 'selected' : 'selectBean'} onClick={() => selectRating(3)} />
            <img src={Bean} className={rating >= 4 ? 'selected' : 'selectBean'} onClick={() => selectRating(4)} />
            <img src={Bean} className={rating >= 5 ? 'selected' : 'selectBean'} onClick={() => selectRating(5)} />
            <br />
            {rating}
          </div>
          <br />
          <label>
            Title:
            <br />
            <input onChange={(e) => { e.preventDefault(); setTitle(e.target.value); }} />
          </label>
          <label>
            Write your reviews down
            <br />
            <textarea onChange={(e) => { e.preventDefault(); setBody(e.target.value); }} />
          </label>
          <br />
          <label>
            Your photos(optional)
          </label>
          <br />

          <input type="file" multiple={true} onChange={(e) => { handleImage(e); }} />
          <div>
            {renderImg(photos)}
          </div>
          {/* <div onClick = {handleAPI}> confirm photo</div> */}

          <button type="submit"> Submit Review</button>

        </form>
      </div>
    </div>
  );
}
