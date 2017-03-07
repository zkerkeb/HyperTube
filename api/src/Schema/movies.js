import mongoose from '../mongoose';

const movie = mongoose.Schema({
  id: Number,
  imdb_code: String,
  title: String,
  year: Number,
  rating: Number,
  genres: Object,
  summary: String,
  description: String,
  duration: String,
  released: String,
  cast: Array,
  genres: Array,
  directors: Array,
  writers: Array,
  review: {
    type: Object,
    default: {
      rating: {
        type: String,
        default: '-',
      },
      text: {
        type: String,
        default: '',
      },
    },
  },
  language: String,
  seenBy: Array,
  mediumImage: String,
  largeImage: String,
  provider: String,
  torrents: Object,
});

const Movie = mongoose.model('movies', movie);

export default Movie;
