import React, { Component } from "react";
import MaterialTable from 'material-table';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import api from '../../services/api'

import './styles.scss';
import _variables from '../../utilities/_variables.scss';

import NavBar from '../../components/navBar';
import Footer from '../../components/footer';
import CheckModal from '../../components/checkModal'

export default class UsersAccessRequestPage extends Component {
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
			id: null,
			action: null,
			phrase: null,
			button1: null
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

	showModal = () => {
		var checkModal = document.querySelector("[name=CheckModal]");
		checkModal.style.display = "flex";
	}

	refuse = async () => {
		await api.delete(`/accessRequest/refuse?id=${this.state.id}`);
		this.tableRef.current && this.tableRef.current.onQueryChange()

        var checkModal = document.querySelector("[name=CheckModal]");
        checkModal.style.display = "none";
	}
	
	accept = async () =>{
		await api.get(`/accessRequest/accept?id=${this.state.id}`);
		this.tableRef.current && this.tableRef.current.onQueryChange()

		var checkModal = document.querySelector("[name=CheckModal]");
        checkModal.style.display = "none";
	}

	cancel = () => {
        var checkModal = document.querySelector("[name=CheckModal]");
        checkModal.style.display = "none";
    }

    render() {
        return (
            <div id = "usersAccessRequestPage">
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
									url += '&order=' + (query.orderBy ? query.orderBy.field : '')
									url += '&dir=' + (query.orderDirection === 'asc' ? 'asc' : query.orderDirection === 'desc' ? 'des' : null)
									url += '&search=' + query.search
										
									fetch(url)
										.then(response => response.json())
										.catch(() => {})
										.then(result => {
											console.log(result)
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
									onClick: async (event, rowData) => {
										this.setState({action: this.accept, phrase: `Grant access to ${rowData.name} ${rowData.surname}?`, id: rowData._id, button1: 'Grant'})
										this.showModal()
									}
								},
								{
									icon: 'clear',
									tooltip: 'Decline User',
									onClick: async (event, rowData) => {
										this.setState({action: this.refuse, phrase: `Refuse access to ${rowData.name} ${rowData.surname}?`, id: rowData._id, button1: 'Refuse'})
										this.showModal()
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
					<CheckModal phrase = {this.state.phrase} button1 = {this.state.button1} check = {this.state.action} button2 = "Cancel" cancel = {this.cancel}/>
				</div>
                <Footer />
            </div>
        )
    }
}