// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import productsData from '../products.json'; // Import the JSON file
// import '../stylecss/category.css';
// const CategoryPage = () => {
//   const { categoryName } = useParams();
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     // Filter products based on the category
//     const filteredProducts = productsData.filter(product => product.category === categoryName);
//     setProducts(filteredProducts);
//   }, [categoryName]);

//   return (
//     <div>
//       <h1>{categoryName}</h1>
//       <div className="product-cards">
//         {products.map(product => (
//           <ProductCard key={product.id} product={product} />
//         ))}
//       </div>
//     </div>
//   );
// };

// const ProductCard = ({ product }) => {
//   return (
//     <div className="card">
//       <img src={product.image} alt={product.name} />
//       <h2>{product.name}</h2>
//       <p>{product.description}</p>
//       <p>${product.price}</p>
//       <button>Buy Now</button>
//     </div>
//   );
// };

// export default CategoryPage;


import React from 'react';
import '../stylecss/category.css';

const products = [
  {
    id: 1,
    name: 'Apple iPhone 15 (128 GB) - Black',
    discountedPrice: '₹70,999',
    originalPrice: '₹79,900',
    imageUrl: 'images/mobile1.jpg',
  },
  {
    id: 2,
    name: 'Samsung Galaxy S23 (256 GB) - Phantom Black',
    discountedPrice: '₹60,999',
    originalPrice: '₹68,900',
    imageUrl: 'images/mobile2.jpg',
  },
  {
    id: 3,
    name: 'Google Pixel 7 (128 GB) - Obsidian',
    discountedPrice: '₹54,999',
    originalPrice: '₹61,000',
    imageUrl: 'images/mobile3.jpg',
  },
  {
    id: 4,
    name: 'OnePlus 11 (256 GB) - Eternal Green',
    discountedPrice: '₹56,999',
    originalPrice: '₹62,999',
    imageUrl: 'images/mobile4.jpg',
  },
];

function CategoryPage() {
  const handleClick = () => {
    const result = window.confirm('Do you want to proceed?');
    if (result) {
      // Handle proceed action
      alert('Processing Your Order...');
    } else {
      // Handle decline action
      alert('Declined.');
    }
  };
  return (
    <div className="App">
      <div className="product-grid">
        {products.map(product => (
          <div className="product-card" key={product.id}>
            <div className="product-image">
              <img src={process.env.PUBLIC_URL + '/' + product.imageUrl} alt={product.name} />
            </div>
            <div className="product-details">
              <h1>{product.name}</h1>
              <div className="product-price">
                <span className="discounted-price">{product.discountedPrice}</span>
                <span className="original-price">{product.originalPrice}</span>
              </div>
              <p>Inclusive of all taxes</p>
              <button className="buy-now-button" onClick={handleClick}>Buy Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CategoryPage;
