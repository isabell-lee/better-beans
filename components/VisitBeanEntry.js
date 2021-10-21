const VisitBeanEntry = ({ shop }) => (
  // console.log(shop);
  <div className="card">
    <Link href={`shop/${shop.place_id}`}>
      <a className="">
        <h3 className="name">{shop.name}</h3>
        <BeanRating rating={shop.rating} />
        {shop.opening_hours
          ? shop.opening_hours.open_now ? <div className="opening_hours">Open</div>
            : <div className="opening_hours">Closed</div>
          : null}
        <div className="location">{shop.vicinity}</div>
      </a>
    </Link>
  </div>
);

export default VisitBeanEntry;