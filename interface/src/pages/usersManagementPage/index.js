import React, { Component } from "react";
import MaterialTable from 'material-table';


import './styles.scss';

import NavBar from '../../components/navBar';
import Footer from '../../components/footer';

export default class UsersManagementPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            columns: [
                { title: 'Name', field: 'name' },
                { title: 'E-mail', field: 'email'},
            ],
            style: {
              	width: '80%',
			},
			data: [
				{name: "Bruno Cebola", email: "bruno.m.cebola@gmail.com"},
				{name: "Marisa Cebola", email: "marisa.m.cebola@gmail.com"}
			]
        }
    }

    render() {
        return (
            <div id = "usersManagementPage">
                <NavBar underline = "9"/>
                <div id = "MaterilTableContainer">
                  	<MaterialTable
						title="Users Access Request List"
						columns={this.state.columns}
						data={this.state.data}       
						style = {this.state.style} 
						actions={[
							{
								icon: 'check',
								tooltip: 'Accept User',
								onClick: (event, rowData) => alert("You saved " + rowData.name)
							},
							{
								icon: 'clear',
								tooltip: 'Decline User',
								onClick: (event, rowData) => window.confirm("You want to delete " + rowData.name)
							}
						]}
						options={{
							actionsColumnIndex: -1,
						}}
                  	/>
                </div>
                <Footer />
            </div>
        )
    }
}