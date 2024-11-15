import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../stylecss/p1.css'; // Ensure you create this CSS file for styling

function Product1() {
  const { category } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetch('../products.json')
      .then(response => response.json())
      .then(data => {
        setProducts(data[category] || []);
      })
      .catch(error => console.error('Error fetching product data:', error));
  }, [category]);

  return (
    <div className="product-page">
      <h1>{category.charAt(0).toUpperCase() + category.slice(1)}</h1>
      <div className="product-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <img src={product.imageUrl} alt={product.name} className="product-image" />
            <div className="product-info">
              <h2 className="product-name">{product.name}</h2>
              <p className="product-price">{product.price} <span className="original-price">{product.originalPrice}</span></p>
              <p className="product-description">{product.description}</p>
              <button className="buy-now-button">Buy Now</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Product1;
