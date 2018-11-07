import React from 'react';
import rewardsCard from '../imgs/7rewards-card.png';

const RegisterForm = () => {
  return (

<div>
  <label  className="col-sm-2 col-form-label">All fields must be completed, unless marked (optional)</label>

  <div className="form-group row">

    <div className="col-sm-10">
      <input type="text" className="form-control"  placeholder="First Name"></input>
    </div>
  </div>
  <div className="form-group row">
    <div className="col-sm-10">
      <input type="password" className="form-control" placeholder="Last Name(optional)"></input>
    </div>
  </div>

  <div className="form-group row">
    <div className="col-sm-10">
      <input type="number" className="form-control" placeholder="Mobile Phone"></input>
    </div>
  </div>

  <div className="form-group row">

    <div className="col-sm-10">
      <input type="email" className="form-control"  placeholder="Account ID(Email Address)"></input>
    </div>
  </div>

  <div className="form-group row">
    <div className="col-sm-10">
      <input type="password" className="form-control" id="inputPassword3" placeholder="Password"></input>
    </div>
  </div>

  <div className="se-module se-module-white se-module-register-7rewards">
    <div className="se-columns">
      <div className="wallet-button">
        <img src={rewardsCard} alt="" className="img-responsive"/>
      </div>
      <div className="se-column se-column-two-thirds">
        <h3>Have a 7REWARDS card?</h3>
        <p>Link it to your account so you can see the points you earn on every dollar you
          spend.
          Online or on your phone, it’s easy.</p>
        <div className="form-group row">
          <div className="col-sm-10">
            <input type="number" className="form-control" placeholder="Card Number (optional)"></input>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div className="form-group row">
    <div className="col-sm-10">
      <button type="button" className="btn btn-primary">Sign up</button>
    </div>
  </div>

</div>

  );
}


export default RegisterForm;
