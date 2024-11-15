
import React from 'react';
import { Link } from 'react-router-dom';
import { FaRobot, FaBox, FaExchangeAlt, FaBeer } from 'react-icons/fa';

import '../stylecss/customer.css';

function CustomerService() {
  return (
    <div className="container mt-4">
      <div className="heading">
        {/* <h1>Customer Service</h1> */}
      </div>
      <div className="content">
        <div className="cards">
          <div className="mb-3">
            <div className="card h-100 rounded">
              <div className="card-body">
                <FaRobot className="card-icon text-primary mb-3" size={40} />
                <Link to="/webrtc" className="text-decoration-none">
                  <h5 className="card-title">Virtual Agent</h5>
                </Link>
                <p className="card-text">AI powered virtual agent to provide call services</p>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <div className="card h-100 rounded">
              <div className="card-body">
                <FaBox className="card-icon text-primary mb-3" size={40} />
                <Link to="/orders" className="text-decoration-none">
                  <h5 className="card-title">Your Orders</h5>
                </Link>
                <p className="card-text">Track packages<br />Edit or cancel orders</p>
              </div>
            </div>
          </div>
          <div className="mb-3">
            <div className="card h-100 rounded">
              <div className="card-body">
                <FaExchangeAlt className="card-icon text-primary mb-3" size={40} />
                <Link to="/orders" className="text-decoration-none">
                  <h5 className="card-title">Returns and Refunds</h5>
                </Link>
                <p className="card-text">Return or exchange items<br />Print return mailing labels</p>
              </div>
            </div>
          </div>
        </div>
        <div className="image">
          <img src="images/robot.jpg" alt="Chatbot" className="img-fluid" />
        </div>
      </div>
    </div>
  );
}

export default CustomerService;