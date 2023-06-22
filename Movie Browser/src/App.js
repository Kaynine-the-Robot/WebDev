import './App.css';
import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Home from './components/Home'
import AboutView from './components/AboutView'
import SearchView from './components/SearchView'
import MovieView from './components/MovieView'
import { Routes, Route, Navigate } from 'react-router-dom'



function App() {

  // Using the set things will re-render entire component
  // Here this is the whole app which is bad
  const [searchResults, setSearchResults] = useState([])
  const [searchText, setSearchText] = useState('')

  useEffect(() => {
    if(searchText) {
      fetch(`https://api.themoviedb.org/3/search/movie?api_key=6ccb78febb6d9651ea6829679899746d&language=en-US&query=${searchText}&page=1&include_adult=false`)
        .then(response => response.json())
        .then(data => {
          setSearchResults(data.results)
        })
      }
    }, [searchText])

  function PageNotFound() {
    return (
      <div>
          <p>404 Page not found</p>
      </div>
    );
  }

  return (
    <div>
      <Navbar searchText={searchText} setSearchText={setSearchText}/>
      <Routes>
        <Route path="/movie-browser" element={<Home/>} />
        <Route path="/movie-browser/about" element={<AboutView/>} />
        <Route path="/movie-browser/search" element={<SearchView keyword={searchText} searchResults={searchResults}/>} />
        <Route path="/movie-browser/movies/:id" element={<MovieView/>} />
        <Route path="/movie-browser/404" element={<PageNotFound/>} />
        <Route path="*" element={<Navigate to="/movie-browser/404"/>} />
      </Routes>
    </div>
  );
}

export default App;
