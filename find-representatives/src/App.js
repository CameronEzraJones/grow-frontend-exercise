import React, { Component } from 'react';
import { Grid, Navbar, Jumbotron } from 'react-bootstrap';

class RepresentativeDetails extends Component {
    render() {
        if(this.props.representative && this.props.representative.name) {
            return (
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h3 className="panel-title">{this.props.representative.name}</h3>
                    </div>
                    <div className="panel-body">
                        <table className="table table-bordered">
                            <tbody>
                                <tr>
                                    <th>State</th>
                                    <td>{this.props.representative.state}</td>
                                </tr>
                                <tr>
                                    <th>District</th>
                                    <td>{this.props.representative.district ? this.props.representative.district : 'Senator'}</td>
                                </tr>
                                <tr>
                                    <th>Office</th>
                                    <td>{this.props.representative.office}</td>
                                </tr>
                                <tr>
                                    <th>Phone</th>
                                    <td>{this.props.representative.phone}</td>
                                </tr>
                                <tr>
                                    <th>Website</th>
                                    <td>{this.props.representative.link}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )
        } else return null;
    }
}

class RepresentativeList extends Component {
    handleSelect(representative) {
        this.props.handleSelect(representative);
    }

    render() {
        return (
            <div className="list-group">
                {
                    this.props.representatives.map((representative) => {
                        return <a key={representative.name} className="list-group-item" onClick={() => this.handleSelect(representative)}>
                            <span className="badge">{representative.party}</span>{representative.name}
                        </a>
                    })
                }
            </div>
        )
    }
}

class FindRepresentativeForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            type: 'representatives',
            state: 'UT'
        };

        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleStateChange = this.handleStateChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleTypeChange(event) {
        this.setState({type: event.target.value})
    }

    handleStateChange(event) {
        this.setState({state: event.target.value})
    }

    handleSubmit(event) {
        console.log(this.state);
        this.props.getReps(this.state.type, this.state.state);
        event.preventDefault();
    }

    render() {
        const representativeTypes = ['representatives', 'senators'];
        const states = [
            'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
            'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
            'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
            'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
            'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY'
        ];
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="representativeType">Type</label>
                    <select className="form-control" id="representativeType" onChange={this.handleTypeChange} value={this.state.type} required>
                        {
                            representativeTypes.map((type) => {
                                return <option key={type} value={type}>{type}</option>;
                            })
                        }
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="state">State</label>
                    <select className="form-control" id="state" onChange={this.handleStateChange} value={this.state.state} required>
                        {
                            states.map((state) => {
                                return <option key={state} value={state}>{state}</option>;
                            })
                        }
                    </select>
                </div>
                <button type="submit" className="btn btn-default">Find representatives</button>
            </form>
        )
    }
}

class App extends Component {
    constructor() {
        super();
        this.state = {
            representatives: [],
            selected: {}
        };

        this.getReps = this.getReps.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleSelect(representative) {
        this.setState({selected: representative});
    }

    getReps(type, selectedState) {
        let fetchHeaders = new Headers();
        let url = 'http://localhost:3001/' + type + '/' + selectedState;
        let httpCall = {
            method: 'GET',
            headers: fetchHeaders
        };

        fetch(url, httpCall).then((response) => {
            return response.json();
        }).then((json) => {
            console.log(json);
            if(json.success) {
                console.log('Success!');
                this.setState({representatives: json.results});
            }
        });
        return false;
    }

    render() {
        return (
            <div>
                <Navbar inverse fixedTop>
                    <Grid>
                        <Navbar.Header>
                            <Navbar.Brand>
                                <a href="/">Find your Representatives</a>
                            </Navbar.Brand>
                            <Navbar.Toggle />
                        </Navbar.Header>
                    </Grid>
                </Navbar>
                <Jumbotron>
                    <Grid>
                        <h1>Find your Representatives</h1>
                        <FindRepresentativeForm
                            getReps={this.getReps}
                        />
                    </Grid>
                </Jumbotron>
                <div className="container">
                    <div className="row">
                        <div className="col-md-6">
                            <RepresentativeList representatives={this.state.representatives} handleSelect={this.handleSelect}/>
                        </div>
                        <div className="col-md-6">
                            <RepresentativeDetails representative={this.state.selected}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;