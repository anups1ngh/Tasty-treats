import { Link } from "react-router-dom";
import "../../index.css";

const NotFound = () => {
  return (
    <div className="not-found">
      <img
        src={require("../assets/img/error.jpg")}
        alt="Not Found"
        className="image"
      />

      <p className="error-text">Oops! Nothing Found here</p>
      <button className="error-button">
        <Link to="/">Back to Home</Link>
      </button>
    </div>
  );
};

export default NotFound;
