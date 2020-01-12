import React, { Component } from "react";
import MaterialTable from 'material-table';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import api from '../../services/api'

import './styles.scss';
import _variables from '../../utilities/_variables.scss';

import NavBar from '../../components/navBar';
import Footer from '../../components/footer';

export default class UsersManagementPage extends Component {
    constructor(props) {
		super(props);

		this.tableRef = React.createRef();
		
        this.state = {
            columns: [
				{ title: 'Name', field: 'name' },
				{ title: 'Surname', field: 'surname' },
                { title: 'E-mail', field: 'email'},
            ],
            style: {
				  width: '80%',
				  marginTop: '2%'
			},
			
		}

		this.theme = createMuiTheme({
			palette: {
			  	primary: {
					main: _variables.firstColor,
				},
				secondary: {
					main: _variables.firstColor,
				},
			}
		});
	}

    render() {
        return (
            <div id = "usersManagementPage">
                <NavBar underline = "9"/>
                <div id = "MaterilTableContainer">
					<MuiThemeProvider theme={this.theme}>
						<MaterialTable
							title="Users Access Request List"
							tableRef={this.tableRef}
							columns={this.state.columns}
							data={query => 
								/* TODO: a pesquisa não está a funcionar */
								new Promise((resolve, reject) => {
									let url = 'http://localhost:3001/accessRequest/'
									url += 'paginate?per_page=' + query.pageSize 
									url += '&page=' + (query.page + 1) 
									url += '&search=' + query.search
										
									fetch(url)
										.then(response => response.json())
										.then(result => {
											resolve({
												data: result.docs,
												page: result.page - 1,
												totalCount: result.total,
											})
										})
								})
							}      
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
									onClick: async (event, rowData) => {
										if(window.confirm(`Do you want to delete ${rowData.name} ${rowData.surname} - ${rowData.email}`)){
											await api.delete(`/accessRequest/refuse?id=${rowData._id}`);
											this.tableRef.current && this.tableRef.current.onQueryChange()
										}
									}
								},
								{
									icon: 'refresh',
									tooltip: 'Refresh Data',
									isFreeAction: true,
									onClick: () => {
										this.tableRef.current && this.tableRef.current.onQueryChange()
									}
								}
							]}
							options={{
								actionsColumnIndex: -1,
								headerStyle: {
									fontWeight: 'bold',
									fontSize: '16px',
								},
							}}
						/>
					</MuiThemeProvider>
                </div>
                <Footer />
            </div>
        )
    }
}