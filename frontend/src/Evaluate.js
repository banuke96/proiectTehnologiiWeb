import React from 'react';
import { Button, Accordion, Card, Form, ButtonGroup } from 'react-bootstrap';
import EvaluateStyles from './EvaluateStyles.css';
import ImageLogo from './ImageLogo.js';

class Evaluate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      grade: ''
    };
  }

  validateGrade = (e) => {
    if (e.currentTarget.id === "btn1") {
      this.state.grade = 1;
    }
    if (e.currentTarget.id === "btn2") {
      this.state.grade = 2;
    }
    if (e.currentTarget.id === "btn3") {
      this.state.grade = 3;
    }
    if (e.currentTarget.id === "btn4") {
      this.state.grade = 4;
    }
    if (e.currentTarget.id === "btn5") {
      this.state.grade = 5;
    }
    if (e.currentTarget.id === "btn6") {
      this.state.grade = 6;
    }
    if (e.currentTarget.id === "btn7") {
      this.state.grade = 7;
    }
    if (e.currentTarget.id === "btn8") {
      this.state.grade = 8;
    }
    if (e.currentTarget.id === "btn9") {
      this.state.grade = 9;
    }
    if (e.currentTarget.id === "btn10") {
      this.state.grade = 10;
    }
  }

  validate = (event) => {
    if (this.state.grade === '') {
      alert("Please select the grade!");
      throw "error";
    }
  }

  render() {
    return (
      <div>
            
            <div id = "evaluateContainer">
            <ImageLogo/>
              <Accordion>
                <Card>
                  <Card.Header id = "ch">
                    <Accordion.Toggle as={Button} variant="link" eventKey="0">Server link</Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="0">
                    <Card.Body>aici trebuie sa apara link-ul</Card.Body>
                  </Accordion.Collapse>
                </Card>
                <Card>
                  <Card.Header id = "ch">
                    <Accordion.Toggle as={Button} variant="link" eventKey="1">Video link</Accordion.Toggle>
                  </Card.Header>
                  <Accordion.Collapse eventKey="1">
                    <Card.Body>aici trebuie sa apara link-ul</Card.Body>
                  </Accordion.Collapse>
                </Card>
              </Accordion>
              
              <Form>
                  <Form.Group id="gradeId">
                      <Form.Label>Grade</Form.Label>
                      
                      <ButtonGroup id="gradeIdButtonGroup">
                        <Button variant="secondary" onClick={this.validateGrade} id="btn1" value = {this.state.grade}>1</Button>
                        <Button variant="secondary" onClick={this.validateGrade} id="btn2" value = {this.state.grade}>2</Button>
                        <Button variant="secondary" onClick={this.validateGrade} id="btn3" value = {this.state.grade}>3</Button>
                        <Button variant="secondary" onClick={this.validateGrade} id="btn4" value = {this.state.grade}>4</Button>
                        <Button variant="secondary" onClick={this.validateGrade} id="btn5" value = {this.state.grade}>5</Button>
                        <Button variant="secondary" onClick={this.validateGrade} id="btn6" value = {this.state.grade}>6</Button>
                        <Button variant="secondary" onClick={this.validateGrade} id="btn7" value = {this.state.grade}>7</Button>
                        <Button variant="secondary" onClick={this.validateGrade} id="btn8" value = {this.state.grade}>8</Button>
                        <Button variant="secondary" onClick={this.validateGrade} id="btn9" value = {this.state.grade}>9</Button>
                        <Button variant="secondary" onClick={this.validateGrade} id="btn10" value = {this.state.grade}>10</Button>
                      </ButtonGroup>
                      
                  </Form.Group>
                   
                  <Button variant="secondary" type="submit" onClick={this.validate}> Grade </Button>

                  <Button id = "nextbtn"  type="submit"> Next </Button>
              </Form>
            </div>
            
           
          </div>
    );
  }
}

export default Evaluate;
