import { IMG_CDN_URL } from "../constants";

const OffersCard = ({
    id,
    name,
    cloudinaryImageId,
    locality,
    areaName,
    header,
    subHeader
}) => {

    return (
        <div className="card" key={id}>
            <div className="res-img">
                <img src={IMG_CDN_URL + cloudinaryImageId} />
                {header && (
                    <span className="img-discount-info">
                        {" "}
                        {header +
                            " " +
                            subHeader?.replace("₹", "")}
                    </span>
                )}
            </div>

            <div className="res-name">
                <h5 className="resName">{name}</h5>
            </div>
            <div className="resName__details">
                <p>{locality}</p>
                <p>{areaName}</p>
            </div>
        </div>
    );
};

export default OffersCard;
