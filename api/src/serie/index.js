import { Serie } from '../Schema';
import { Comment } from '../Joi';
import Joi from 'joi';

export const serie = (req, res) => {
  const data = req.params.id;
  Serie.find({ imdb_code: data })
  .exec()
    .then((results) => {
      res.send(results);
    });
};

export const episode = (req, res) => {
  const data = req.params.serie_id;
  console.log(data);
  Serie.find({ imdb_code: data })
  .exec()
    .then((results) => {
      // console.log(results[0].content);
      const episodeInfo = results[0].content.filter((ep) => {
        if (ep.tvdb_id === Number(req.params.id)) {
          return ep;
        }
      });
      res.send({ status: true, details: episodeInfo });
    });
};

export const addComment = async (req, res) => {
  console.log('iddd serie', req.body.serieId);
  console.log('iddd episode', req.body.episodeId);
  const { error } = await Joi.validate({ comment: req.body.comment }, Comment, { abortEarly: false });
  if (error) {
    return res.send({ status: false, errors: error.details });
  }
  const { username, id, comment, serieId, episodeId } = req.body;
  console.log(req.body.username);
  console.log(req.body.id);
  Serie.find({ imdb_code: serieId })
  .exec()
    .then((results) => {
      console.log('entered resultss');
      let filteredEpisode = results[0].content.filter((episode) => {
        if (episode.tvdb_id === Number(episodeId)) {
          return episode;
        }
      });
      if (!filteredEpisode.comments) {
        console.log('entered if');
        filteredEpisode.comments = [];
      }
      filteredEpisode.comments.unshift({ comment, id, username });
      // IL NE VEUT PAS SAVE !! mais le console log de filteredEpisode est parfait
      filteredEpisode.save().then((err) => { console.log(err);})
      res.send({ status: true, results });
    })
    .catch((err) => console.log(err));
};
