import * as React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import axios from 'axios';
import * as geolib from 'geolib';
import { Form, Col, Row, Button, Modal, Container } from "react-bootstrap";
import 'font-awesome/css/font-awesome.min.css';
import LoaderButton from "../components/LoaderButton";


interface IState {
    partners: any[];
	allPartners: any[];
	isSearchLoading:false;
	search_organization:any;
	fromLat:any
	fromLong:any
	kilometers:any
	
}

export default class Home extends React.Component<RouteComponentProps, IState> {
    constructor(props: RouteComponentProps) {
        super(props);
        this.state = { partners: [] ,isSearchLoading: false, search_organization:"", allPartners:[], fromLat:"", fromLong:"",kilometers:""}
		
    }

    public componentDidMount(): void {
        this.search();
    }

    // public deletePartner(id: number) {
        // axios.delete(`http://localhost:5000/partners/${id}`).then(data => {
            // const index = this.state.partners.findIndex(partner => partner.id === id);
            // this.state.partners.splice(index, 1);
            // this.props.history.push('/');
        // })
    // }
	
	handleResetClick = () => {
        this.setState({ isSearchLoading: false })
		this.setState({ search_organization: "",fromLat:"", fromLong:"",kilometers:"" })
		this.search();
    }
	
	public search() {
		var org = this.state.search_organization;
		var lat = this.state.fromLat;
		var lng = this.state.fromLong;
		var kilometers = parseInt(this.state.kilometers);
		
		
		axios.get(`http://localhost:4000/partners?org=`+org+'&lat=' + lat +'&lng=' + lng +'&kms=' + kilometers).then(data => {
				
			this.setState({ partners: data.data.partners })
		})
		//console.log(this.state.partners)	
		
    }
    public render() {
        const partners = this.state.partners;
        return (
            <div>
				<h2>Search for your partners! Set your base coordinates and your kilometers search radius!</h2>
                {partners.length === 0 && (
                    <div className="text-center">
                        <h2>No partner found at the moment</h2>
                    </div>
                )}
                
                <div className="container">
					<Row>
						 <Col md={2}>
							<Form.Group controlId="search_organization">
								<Form.Label>Organization</Form.Label>
								<Form.Control value={this.state.search_organization} onChange={(event)=> this.setState({search_organization:event.target.value})} />
							</Form.Group>
						</Col>
						<Col md={2}>
							<Form.Group controlId="fromLat">
								<Form.Label>Base Latitude</Form.Label>
								<Form.Control value={this.state.fromLat} onChange={(event)=> this.setState({fromLat:event.target.value})} />
							</Form.Group>
						</Col>
						<Col md={2}>
							<Form.Group controlId="fromLong">
								<Form.Label>Base longitude</Form.Label>
								<Form.Control value={this.state.fromLong} onChange={(event)=> this.setState({fromLong:event.target.value})} />
							</Form.Group>
						</Col>
						<Col md={2}>
							<Form.Group controlId="kilometers">
								<Form.Label>Kilometers</Form.Label>
								<Form.Control value={this.state.kilometers} onChange={(event)=> this.setState({kilometers:event.target.value})} />
							</Form.Group>
						</Col>
						<Col md={4} >
							<br/>
                        <LoaderButton style={{width:130}} onClick={() => this.search()} text="Search" loadingText="Searching..." isLoading={this.state.isSearchLoading}/>&nbsp;&nbsp;&nbsp;
                        <Button onClick={this.handleResetClick}>Reset</Button>
						</Col>
					
					</Row>
					
					<Row style={{cursor:"pointer"}} className="mainList tableHeader">
						<Form.Text as={Col} md={2}  >Organization</Form.Text>
						<Form.Text as={Col} md={2}  >Location</Form.Text>
						<Form.Text as={Col} md={3}  >Website</Form.Text>
						<Form.Text as={Col} md={3}  >Services</Form.Text>
						<Form.Text as={Col} md={2}  >Office</Form.Text>
						
					</Row>
                    
					{partners && partners.map((partner,i) =>
						<Row key={i} className="mainList">
							<Col md={2}>{partner.organization}</Col>
							<Col md={2}>{partner.customerLocations}</Col>
							<Col md={3}>{partner.website}</Col>
							<Col md={3}>{partner.services}</Col>
							<Col md={2}>
							{partner.offices[0] !== null ? partner.offices.map((o:any, index:number) => 
								<div key={index} className="address">
									{o.location}  
									{(o.km_far != null && o.km_far != "") ? 
										
										<div>
										{o.withinRadius== true ? <span className="green">{o.km_far}</span> : <span className="red">{o.km_far}</span>} km away
										
										</div> : ""
									}
									
								</div>
								
								) : ""}
							</Col>
						</Row>
					)}
                           
                </div>

            </div>
        )
    }
}
