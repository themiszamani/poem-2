import React, { Component } from 'react';
import {
  Alert,
  Container,
  Button, 
  Row, 
  Col, 
  Card, 
  CardHeader, 
  CardBody,
  Label,
  CardFooter,
  FormGroup } from 'reactstrap';
import {Formik, Field, Form} from 'formik';
import ArgoLogo from './argologo_color.svg';
import EULogo from './eu.png';
import EOSCLogo from './eosc.png';
import {doLogin, setAuthData} from './UIElements';
import './Login.css';

class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      samlIdpString: null,
      loginFailedVisible: false,
    };

    this.dismissLoginAlert = this.dismissLoginAlert.bind(this);
  }

  componentDidMount() {
    fetch('/api/v2/internal/saml_idp_string')
      .then(response => response.json())
      .then(json => this.setState({samlIdpString: json.result}))
      .catch(err => console.log('Something went wrong: ' + err));
  }

  dismissLoginAlert() {
    this.setState({loginFailedVisible: false});
  }

  render() {
    if (this.state.samlIdpString) {
      return (
        <Container>
          <Row className="login-first-row">
            <Col sm={{size: 4, offset: 4}}>
              <Card>
                <CardHeader 
                  id='argo-loginheader' 
                  className="d-sm-inline-flex align-items-center justify-content-around">
                  <img src={ArgoLogo} id="argologo" alt="ARGO logo"/>
                  <h4 className="text-light"><strong>ARGO</strong> POEM</h4>
                </CardHeader>
                <CardBody>
                  <Formik
                    initialValues = {{username: '', password: ''}}
                    onSubmit = {
                      (values) => doLogin(values.username, values.password)
                        .then(response => 
                          {
                            if (response.ok) {
                              response.json().then(
                                json => {
                                  setAuthData(json);
                                  this.props.onLogin();
                                  this.props.history.push('/ui/reports');
                                }
                              )
                            } 
                            else {
                              this.setState({loginFailedVisible: true});
                            }
                          })
                    }>
                    <Form>
                      <FormGroup>
                        <Label for="username">Username: </Label>
                        <Field name="username" className="form-control"/>
                      </FormGroup>
                      <FormGroup>
                        <Label for="password">Password: </Label>
                        <Field name="password" className="form-control" type="password"/>
                      </FormGroup>
                      <FormGroup>
                        <Alert color="danger" isOpen={this.state.loginFailedVisible} toggle={this.dismissLoginAlert} fade={false}>
                          <p className="text-center">
                            Login failed, invalid username and password provided
                          </p>
                        </Alert>
                      </FormGroup>
                      <div className="pt-3">
                      </div>
                      <FormGroup>
                        <Button color="success" type="submit" block>Login using username and password</Button>
                        <a className="btn btn-success btn-block" role="button" href="/saml2/login">{this.state.samlIdpString}</a>
                      </FormGroup>
                    </Form>
                  </Formik>
                </CardBody> 
                <CardFooter id="argo-loginfooter">
                  <div className="text-center pt-1">
                    <img src={EULogo} id="eulogo" alt="EU logo"/>
                    <img src={EOSCLogo} id="eosclogo" alt="EOSC logo" className="pl-1"/>
                  </div>
                  <p className="text-center">
                    <small>
                      <strong>ARGO POEM</strong> is a service jointly developed and maintained by 
                      <a href="http://www.cnrs.fr/" title="Centre national de la recherche scientifique"> CNRS</a>,
                      <a href="https://grnet.gr/" title="Greek Research and Technology Network"> GRNET</a> and 
                      <a href="http://www.srce.unizg.hr/" title="University computing centre"> SRCE </a>
                      co-funded by <a href="https://www.eosc-hub.eu" title="EOSC-Hub"> EOSC-Hub</a> and 
                      <a href="http://www.egi.eu/" title="EGI.eu"> EGI.eu</a>
                    </small>
                  </p>
                </CardFooter>
              </Card>
            </Col>
          </Row>
        </Container>
      );
    }
    else {
      return null;
    }
  }
}

export default Login;

