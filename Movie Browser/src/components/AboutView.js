import Hero from "./Hero";


const AboutView = ({text}) => {
    return (
      <div>
        <Hero text="About Us"/>
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 my-5">
              <p className="lead">
                This is a simple project built by Kaynen Mitchell to show off some React skills. Thank you to the movie database for the data!
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

export default AboutView;