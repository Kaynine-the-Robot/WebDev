import Hero from "./Hero";

const Home = () => {
    return (
      <div>
        <Hero text="Welcome to React 201"/>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 my-5">
              <p className="lead">
                This website is for searching up movies! Try it out by typing a movie you want to search up into the search box in the top right of the screen. Have Fun!
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

export default Home;