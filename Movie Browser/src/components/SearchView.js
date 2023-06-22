import Hero from "./Hero";
import { Link } from "react-router-dom";


const MovieCard = ({ movie }) => {
  let posterUrl = `https://www.clipartmax.com/png/middle/336-3363941_file-high-contrast-video-x-generic-svg-movie-icon-white-transparent-background.png`
  if(movie.poster_path) {
    posterUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`
  }
  const detailURL = `/movie-browser/movies/${movie.id}`

  return (
    <div className="col-lg-3 col-md-3 col-2 my-4">
      <div className="card">
        <img src={posterUrl} className="card-img-top" alt={movie.original_title}/>
        <div className="card-body">
          <h5 className="card-title">{movie.original_title}</h5>
          <p className="card-text">Some quick example text</p>
          <Link to={detailURL} className="btn btn-primary">Go To Details</Link>
        </div>
      </div>
    </div>
  )
}

const SearchView = ({ keyword, searchResults}) => {
    const title = `You are searching for ${keyword}`
    
    let resultsHtml = `Sorry, No Results For: ${keyword}`
    if(searchResults.length > 0){
      resultsHtml = searchResults.map((obj, i) => {
        return <MovieCard movie={obj} key={i} />
      })
    }
    
    return (
      <div>
        <Hero text= {title}/>
        {resultsHtml &&
          <div className="container">
            <div className="row">
              {resultsHtml}
            </div>
          </div>
        }
      </div>
    )
  }

export default SearchView;