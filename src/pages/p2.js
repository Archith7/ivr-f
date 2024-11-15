// import React from 'react';
// import '../stylecss/p2.css';
// // import phoneImage from './image.png'; // Make sure to save the uploaded image as image.png in the src folder
// function p2() {
//   return (
//     <div>
//       <div className="App">
//       <div className="product-grid">
//         <div className="product-image">
//           <img src="images/stati1.jpg" alt="Product" />
//         </div>
//         <div className="product-details">
//           <h1>Apple iPhone 15 (128 GB) - Black</h1>
//           <div className="product-price">
//             <span className="discounted-price">₹70,999</span>
//             <span className="original-price">₹79,900</span>
//           </div>
//           <p>Inclusive of all taxes</p>
//           <button className="buy-now-button">Buy Now</button>
//         </div>
//       </div>
//     </div>
//     </div>
//   )
// }

// export default p2


import React, { useState, useEffect } from 'react';
import '../stylecss/p2.css';

function P2({ category }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    // Fetch the products from the JSON file
    fetch('../products.json')
      .then(response => response.json())
      .then(data => {
        // Filter products based on the category
        const filteredProducts = data.filter(product => product.category === category);
        setProducts(filteredProducts);
      })
      .catch(error => console.error('Error fetching products:', error));
  }, [category]);

  return (
    <div className="App">
      <div className="product-grid-container">
        {products.map(product => (
          <div className="product-grid" key={product.id}>
            <div className="product-image">
              <img src={product.image} alt={product.name} />
            </div>
            <div className="product-details">
              <h1>{product.name}</h1>
              <div className="product-price">
                <span className="discounted-price">{product.price}</span>
                <span className="original-price">{product.originalPrice}</span>
              </div>
              <p>Inclusive of all taxes</p>
              <button className="buy-now-button">Buy Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default P2;
