import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import RestaurantCard from "./RestaurantCard";
import CategoryMenu from "./CategoryMenu";
import { ShimmerCards } from "./Shimmer";
import { filterData } from "../utils/helper";
import useOnline from "../utils/useOnline";
import Loader from "./Loader";
import NotFound from "./NotFound";
import ServiceUnreachable from "./ServiceUnreachable";

const getUserLocation = () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ lat: latitude, lng: longitude });
      },
      (error) => {
        reject(error);
      }
    );
  });
};

const Body = () => {
  const [allRestaurants, setAllRestaurants] = useState([]);
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [categoryMenu, setCategoryMenu] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [restaurantUrl, setRestaurantUrl] = useState(null);
  const [address, setAddress] = useState("Can't Detect Location");
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userLocation = await getUserLocation();
        setRestaurantUrl(
          `https://gofoodsserver.onrender.com/api/restaurants/?lat=${userLocation.lat}&lng=${userLocation.lng}`
          // `https://gofoodsserver.onrender.com/api/restaurants/?lat=22.718684&lng=88.3530653`
        );

        const response = await fetch(restaurantUrl);
        const json = await response.json();
        console.log(json);
        if(json?.data?.cards[0]?.card?.card?.title === "Location Unserviceable"){
          setError(true);
          return;
        }
        if (!response.ok) {
          throw new Error(json?.error?.message);
        }
        const resData = await checkJsonData(json);
        const addr = json?.data?.cards[2]?.card?.card?.header?.title;
        setAddress(addr.replace("chains", ""));
        setCategoryMenu(
          json?.data?.cards[1]?.card?.card?.gridElements?.infoWithStyle?.info
        );
        setAllRestaurants(resData);
        setFilteredRestaurants(resData);
      } catch (error) {
        console.log(error);
      }
    };

    const checkJsonData = (jsonData) => {
      for (let i = 0; i < jsonData?.data?.cards.length; i++) {
        let checkData =
          jsonData?.data?.cards[i]?.card?.card?.gridElements?.infoWithStyle
            ?.restaurants;

        if (checkData !== undefined) {
          return checkData;
        }
      }
    };

    fetchData();
  }, [restaurantUrl]); // Adding restaurantUrl as a dependency

  if (!allRestaurants) return <Loader />;

  const isOnline = useOnline();

  if (!isOnline) {
    return (
      <h2>
        There is a problem with your internet connection. Please try again
      </h2>
    );
  }
  if(error){
    return <ServiceUnreachable />
  }

  return allRestaurants?.length === 0 ? (
    <ShimmerCards />
  ) : (
    <>
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search restaurants.."
          value={searchText}
          onChange={(e) => {
            setSearchText(e.target.value);
            const data = filterData(searchText, allRestaurants);
            setFilteredRestaurants(data);
          }}
        />
      </div>
      {filteredRestaurants.length === 0 ? (
        <NotFound />
      ) : (
        <>
          {" "}
          {categoryMenu && <CategoryMenu categoryMenu={categoryMenu} />}
          <h1 className="main-content-text">
            {address}
          </h1>
          <div className="restaurant-lists">
            {filteredRestaurants.map((restaurant) => (
              <Link
                to={"/restaurant/" + restaurant.info.id}
                key={restaurant.info.id}
              >
                <RestaurantCard {...restaurant.info} />
              </Link>
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default Body;
