import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import _ from 'lodash';
import './sass/BestOfMovies.sass';

export default class BestOfMovies extends Component {

  componentDidMount = () => {
    const { actions } = this.props;
    actions.movies.TenBestMovies();
    // console.log('ten best movies props did mount', this.props);
  }

  goMoviePage = (id) => {
    browserHistory.push(`/app/movies/${id}`);
  }

  seen = (movie) => {
    if (movie && movie.seenBy) {
      const seen = movie.seenBy.map((user) => {
        if(user === this.props.user.id)
        {
          return "Seen";
        }
      });
      seen = seen.filter((see) => {
        if (see){
          return see
          }
      })

      console.log("SEEEN" ,seen);
      if (seen.length !== 0) return "movieSeen";
      else return "movie";
    }
  }


  render(){
    let allMovies = [];
    const {current} = this.props.translation;

    let { movies } = this.props;
    if (movies && movies.length > 0) {
      movies = _.uniqBy(movies, 'id');
      movies = movies.slice(0, 8);
      allMovies = movies.map((movie, key) => {
        return (
        <div className="allInfo" key={key}>
            <div onClick={() => this.goMoviePage(movie.id)}
              className={this.seen(movie)}
              style={{ backgroundImage: `url('${movie.largeImage}')` }}
            >
              <div className="textContainer">
                <p>{current.rate}: {movie.rating} </p>
                <p>{movie.year} </p>
              </div>
            </div>
        <div className="title">
          <p>{movie.title} </p>
        </div>
      </div>
      )
    });
    }
    return(
      <div>
      <div className="BestMovies">
        <p>{current.bestMovies}</p>
      </div>
      <div className="TenBestMovies">
        {allMovies}
      </div>
    </div>
    )
  }
}
