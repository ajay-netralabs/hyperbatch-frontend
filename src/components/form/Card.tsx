import React from 'react'
interface CardProps {
    name : string;
    description : string;
}
const Card: React.FC<CardProps> = ({name , description}) => {
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
  <div className="card-body">
    <h2 className="card-title">{name}</h2>
    <p>{description}</p>
    <div className="card-actions justify-end">
      <button className="btn btn-primary">Edit</button>
    </div>
  </div>
</div>
  )
}

export default Card