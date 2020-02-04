import React, { Component } from "react";
import MaterialTable, {MTableEditRow} from 'material-table';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import api from '../../services/api'
import settings from '../../config'

import avatar from '../../images/other.png'

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
				{ 
					title: 'Avatar', 
					field: 'avatar', 
					editable: 'never', 
					headerStyle: {pointerEvents: "none"}, 
					grouping: false, 
					render: rowData => <img src={rowData.avatar} style={{width: 50, height: 50, borderRadius: '50%'}}/>,
				},
				{ 
					title: 'Name', 
					field: 'name', 
					editable: 'never' 
				},
				{ 
					title: 'Surname', 
					field: 'surname', 
					editable: 'never' 
				},
				{ 
					title: 'E-mail', 
					field: 'email', 
					editable: 'never'
				},
				{ 
					title: 'Password', 
					field: 'password', 
					grouping: false, 
					headerStyle: {pointerEvents: "none"}, 
					render: rowData => <input type = "text" value = '•••••••' style = {{border: 0, width: 156, backgroundColor: 'rgba(253, 253, 253, 0)'}} disabled/>
				},
				{ 
					title: 'Permissions', 
					field: 'permissions',
					lookup: { 0: 'Viewer', 1: 'Editor', 2: 'Administrator' },
				},
            ],
            style: {
				  width: '80%',
				  marginTop: '2%'
			},
			id: null,
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
	
	arrayBufferToBase64 = (buffer) => {
        var binary = '';
        var bytes = [].slice.call(new Uint8Array(buffer));
        bytes.forEach((b) => binary += String.fromCharCode(b));
        return window.btoa(binary);
    };

    render() {
        return (
            <div id = "usersManagementPage">
                <NavBar underline = "8"/>
                <div id = "MaterilTableContainer">
					<MuiThemeProvider theme={this.theme}>
						<MaterialTable
							title="Users"
							tableRef={this.tableRef}
							columns={this.state.columns}
							style = {this.state.style} 
							data={query => 
								new Promise((resolve, reject) => {
									let url

									let aux = []

									url = settings.api_link + 'users/retrieveProfilePics'
									url += '?userId=' + localStorage.getItem('id');

									fetch(url)
										.then(response => response.json())
										.catch(() => {})
										.then(resps => {
											
											if(resps) {
												resps.map(resp => {
													var base64Flag = 'data:image/jpeg;base64,';
													var imageStr = this.arrayBufferToBase64(resp.img.data.data);
													aux.push({avatar: base64Flag + imageStr, userId: resp.userId})
												})
											}

											url = settings.api_link + 'users/paginate'
											url += '?per_page=' + query.pageSize 
											url += '&page=' + (query.page + 1) 
											url += '&search=' + query.search
											url += '&order=' + (query.orderBy ? query.orderBy.field : '')
											url += '&dir=' + (query.orderDirection === 'asc' ? 'asc' : query.orderDirection === 'desc' ? 'des' : null)
											url += '&id=' + localStorage.getItem('id');
												
											fetch(url)
												.then(response => response.json())
												.catch(() => {})
												.then(result => {
													result.docs.map(res => {
														for(let i = 0; i< aux.length; i++) {
															if(aux[i].userId === res._id) {res.avatar = aux[i].avatar;return}
														}
														res.avatar = avatar
													})

													resolve({
														data: result.docs,
														page: result.page - 1,
														totalCount: result.total,
													})
												})

										})
								})
							}      
							editable={{
								onRowUpdate: (newData, oldData) =>
									new Promise((resolve, reject) => {
										let url = settings.api_link + 'users/update'
											
										fetch(url, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(newData)})
											.then(() => {
												resolve()
												this.tableRef.current && this.tableRef.current.onQueryChange()
											})
									}),

								onRowDelete: oldData =>
									new Promise((resolve, reject) => {
										fetch(`${settings.api_link}users/exclude?id=${oldData._id}`, {method: 'DELETE'})
											.then(resolve())
									}),
							}}
							actions={[
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
								grouping: true,
							}}
							localization={{
								body: {editRow: { deleteText: 'Are you sure you want to exclude this user?' }},
								grouping: { placeholder: "Drag headers here to group the users..."}
							}}
						/>
					</MuiThemeProvider>
				</div>
                <Footer />
            </div>
        )
    }
}