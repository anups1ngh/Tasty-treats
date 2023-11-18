function ServiceUnreachable (){
    return (
        <div className="service-unreachable">
            <img src="https://res.cloudinary.com/swiggy/image/upload/portal/m/location_unserviceable" alt="service-unreachable" />
            <p style={{textAlign:"center",fontWeight:"bold",fontSize:"22"}}>We currently don't provide service in your area !</p>
        </div>
    )
}
export default ServiceUnreachable;