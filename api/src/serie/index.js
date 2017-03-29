import { Serie } from '../Schema';
import { Comment } from '../Joi';
import _ from 'lodash';
import Joi from 'joi';
import OS from 'opensubtitles-api';
import download from 'download-file';
import srt2vtt from 'srt-to-vtt';
import fs from 'fs';

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
  // console.log(data);
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
      // let filteredEpisode = results[0].content.filter((episode) => {
      //   if (episode.tvdb_id === Number(episodeId)) {
      //     return episode;
      //   }
      // });

      // if (!filteredEpisode.comments) {
      //   console.log('entered if');
      //   filteredEpisode.comments = [];
      // }
      // filteredEpisode.comments.unshift({ comment, id, username });
      // filteredEpisode.save().then((err) => { console.log(err);})

      const index = _.indexOf(results[0].content, _.find(results[0].content, { tvdb_id: Number(episodeId) }));
      console.log("Index Serie", index);

      if (!results[0].content[index].comments) {
        console.log('entered if');
        results[0].content[index].comments = [];
      }
      results[0].content[index].comments.unshift({ comment, id, username });
      console.log("episode Actuel",results[0].content[index]);
      results[0].content.splice(index, 1, results[0].content[index]);

      console.log("============================================ß");
      // IL NE VEUT PAS SAVE !! mais le console log de filteredEpisode est parfait
      results[0].save().then((err) => { console.log(err);})
      res.send({ status: true, ...results[0].content[index] });
    })
    .catch((err) => console.log(err));
};

export const getSubtitles = (req, res) => {
  const OpenSubtitles = new OS('42hypertube');
  console.log('HASH HASH HAHS', req.body);
  let language = '';
  req.body.sublanguageid === 'eng' ? language = 'en' : language = 'fr';
  OpenSubtitles.search({
    sublanguageid: req.body.sublanguageid,
    imdbid: req.body.serieId,
  }).then((subtitles) => {
    console.log('sub api', subtitles);
    const url = subtitles[language].url;
    console.log('filename', subtitles[language].filename);
    const options = {
      directory: './public/subtitles',
      filename: subtitles[language].filename,
    };
    const filename = subtitles[language].filename.replace('.srt', '.vtt');

    download(url, options, (err) => {
      if (err) throw err;
      console.log('meooooowww');
      fs.createReadStream(`./public/subtitles/${subtitles[language].filename}`)
      .pipe(srt2vtt())
      .pipe(fs.createReadStream(`./public/subtitles/${filename}`))
      res.send(filename);
    });
  });
}
