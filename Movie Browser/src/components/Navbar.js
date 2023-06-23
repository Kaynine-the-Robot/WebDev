import { useNavigate, Link } from "react-router-dom";

const NavBar = ({ searchText, setSearchText }) => {
    const navigate = useNavigate()

    const updateSearchText = (e) => {
      navigate('/movie-browser/search')
      setSearchText(e.target.value)
    }

    const searchOverride = clicked => {
      clicked.preventDefault();
      navigate("/movie-browser/search");
      setSearchText(searchText);
    }

    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/movie-browser/">Movie Browser</Link>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" to="/movie-browser/">Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/movie-browser/about">About Us</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link disabled" to="/" tabIndex="-1" aria-disabled="true">Coming Soon</Link>
              </li>
            </ul>
            <form className="d-flex">
              <input className="form-control me-2"  type="search" placeholder="Search" value={searchText} onChange={updateSearchText} />
              <button className="btn btn-outline-success" type="submit" onClick={searchOverride}>Search</button>
            </form>
          </div>
        </div>
      </nav>
    )
  }

export default NavBar;