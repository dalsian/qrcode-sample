import React from 'react';
import axios from 'axios';
import LogoImg from '../imgs/logo.png';
import BigGulpImg from '../imgs/biggulp.png';
import AddToWalletBtn from '../imgs/add-to-wallet-button.png';
import { dt,button,span,inputlabel,dl,dd } from 'reactstrap';
var json = require("../../../public/questionnaire.json");
const surveyDivStyle=[]
class Survey extends React.Component {


  constructor(props) {
    super(props);
    this.state = { value: '' };
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount(){
    // fetch("/public/questionnaire.json")
    //   .then(res=>{
    //     console.log("res",res.json());
    //     return res.json;
    //   })

  }
  handleChange(event) {
    this.setState({ times: event.target.value });
  }

  submit(event) {
    window.location.href = '/congratulation';
  }

  // next(event){
  //     if(event.target.name=='3'){
  //         window.location.href='/congratulation';
  //     }else{
  //
  //     }
  // }



  render() {
    return (
      <div >
        {/*<p>1.How many times you visited 7-11 stores ?</p>*/}
        {/*<label> <input type="radio" name='times' value="1"*/}
                       {/*onChange={this.handleChange}/>0</label><br/>*/}
        {/*<label> <input type="radio" name='times' value="2"*/}
                       {/*onChange={this.handleChange}/>2-5</label><br/>*/}
        {/*<label> <input type="radio" name='times' value="3"*/}
                       {/*onChange={this.handleChange}/>more</label>*/}

        {/*<p >2.What's your phone number?</p>*/}
        {/*<input type="text" name="number"/> <br/>*/}

        {/*<p>3.What's your email ?</p>*/}
        {/*<input type="text" name="email"/><br/>*/}

        {/*<Button className="btn btn-success" type="button" onClick={this.submit}>Submit</Button>*/}

        {
          json.data.map(function (data,i) {
            surveyDivStyle[i]= (i!=0)?{display:'none'}:{};
            const next = function(event){
              // if(Number(event.target.name) == json.data.length){
                window.location.href='/congratulation';
              // }else{
              //   surveyDivStyle[Number(event.target.name)-1] = {display:'none'};
              //   surveyDivStyle[Number(event.target.name)] = {};
              // }

            };
            return  (
            <div  key={i} style={surveyDivStyle[i]}>
              <dl className="list-group">
              <dt className="list-group-item">{data.question}
              <span className="must">*</span>
          </dt>
            <dd className="list-group-item">
              <input type="radio" name="group1" value="A" id="1_1"/>
              <label htmlFor="1_1">1</label>
            </dd>
            <dd className="list-group-item">
              <input type="radio" name="group1" value="B" id="1_2"/>
              <label htmlFor="1_2">2</label>
          </dd>
          <dd className="list-group-item">
              <input type="radio" name="group1" value="C" id="1_3"/>
              <label htmlFor="1_3">3 or more </label>
          </dd>

          <dd className="list-group-item">
              <button type="button" className="btn btn-success btn-lg btn-block" name={data.qid}
            onClick={next}>Next
            </button>

          </dd>
          </dl>
          </div>
            );
          })
        }



      </div>
    );
  }

}


export default Survey;
