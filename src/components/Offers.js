import React, { useState, useEffect } from "react";
import { ShimmerCards } from "./Shimmer";
import useOnline from "../utils/useOnline";
import Loader from "./Loader";
import ServiceUnreachable from "./ServiceUnreachable";
import { IMG_CDN_URL } from "../constants";
import OffersCard from "./OffersCard";
import { Link } from "react-router-dom";

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

const Offers = () => {
    const [offers, setOffers] = useState([]);
    const [error, setError] = useState(false);
    const [allRestaurants, setAllRestaurants] = useState([]);
    const [restaurantUrl, setRestaurantUrl] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // const userLocation = await getUserLocation();
                // const url = `https://www.swiggy.com/dapi/restaurants/list/v5?lat=${userLocation.lat}&lng=${userLocation.lng}&is-seo-homepage-enabled=true&page_type=DESKTOP_WEB_LISTING`;
                const url = "https://www.swiggy.com/dapi/restaurants/list/v5?lat=22.572646&lng=88.36389500000001&page_type=DESKTOP_WEB_LISTING";
                const response = await fetch(url);
                const json = await response.json();

                if (json?.data?.cards) {
                    const resData = checkJsonData(json?.data?.cards);
                    setOffers(resData);
                } else {
                    setOffers([
                        { header: "No Offers !", subHeader: "No offers in your area !" },
                    ]);
                }

                const restaurants = restaurantData(json);
                setAllRestaurants(restaurants);
            } catch (error) {
                console.log(error);
                setError(true);
            }
        };

        const restaurantData = (jsonData) => {
            for (let i = 0; i < jsonData?.data?.cards.length; i++) {
                let checkData =
                    jsonData?.data?.cards[i]?.card?.card?.gridElements?.infoWithStyle
                        ?.restaurants;

                if (checkData !== undefined) {
                    return checkData;
                }
            }
        };

        const checkJsonData = (cards) => {
            const uniqueIds = {};
            const data = [];

            for (let i = 0; i < cards.length; i++) {
                if (
                    cards[i]?.card?.card?.gridElements?.infoWithStyle?.restaurants
                ) {
                    for (
                        let j = 0;
                        j <
                        cards[i]?.card?.card?.gridElements?.infoWithStyle?.restaurants
                            .length;
                        j++
                    ) {
                        const currentRestaurant =
                            cards[i]?.card?.card?.gridElements?.infoWithStyle?.restaurants[j];

                        const id = currentRestaurant?.info?.id ?? "";
                        if (!uniqueIds[id]) {
                            uniqueIds[id] = true;

                            data.push({
                                id,
                                name: currentRestaurant?.info?.name ?? "",
                                cloudinaryImageId:
                                    currentRestaurant?.info?.cloudinaryImageId ?? "",
                                locality: currentRestaurant?.info?.locality ?? "",
                                areaName: currentRestaurant?.info?.areaName ?? "",
                                header:
                                    currentRestaurant?.info?.aggregatedDiscountInfoV3?.header ??
                                    "",
                                subHeader:
                                    currentRestaurant?.info?.aggregatedDiscountInfoV3?.subHeader ??
                                    "",
                            });
                        }
                    }
                }
            }

            return data;
        };

        fetchData();
    }, []);

    const isOnline = useOnline();

    if (!isOnline) {
        return (
            <h2>
                There is a problem with your internet connection. Please try again
            </h2>
        );
    }

    if (error) {
        return <ServiceUnreachable />;
    }

    return offers?.length === 0 ? (
        <ShimmerCards />
    ) : (
        <>
            <div className="offer-container">
                <div className="offers-wrapper">

                    <div className="offers">
                        <div className="left">
                            <div className="top">Offers for you</div>
                            <div className="bottom">
                                Explore top deals and offers exclusively for you!
                            </div>
                        </div>
                        <img
                            src="https://res.cloudinary.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/KHu24Gqw_md3ham"
                            alt="offers"
                        />
                    </div>
                </div>
                {offers.map((offer) =>
                    offer.header !== "" && offer.subHeader !== "" ? (
                        <div key={offer.id}>
                            <Link to={"/restaurant/" + offer.id} key={offer.id}>
                                <OffersCard
                                    id={offer.id}
                                    name={offer.name}
                                    cloudinaryImageId={offer.cloudinaryImageId}
                                    locality={offer.locality}
                                    areaName={offer.areaName}
                                    header={offer.header}
                                    subHeader={offer.subHeader}
                                />
                            </Link>
                        </div>
                    ) : null
                )}
            </div>
        </>
    );
};

export default Offers;