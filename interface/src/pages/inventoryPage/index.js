import React, { Component } from "react";
import MaterialTable, {MTableEditRow} from 'material-table';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import api from '../../services/api'
import settings from '../../config'

import tools from '../../images/tools.png'

import './styles.scss';
import _variables from '../../utilities/_variables.scss';

import NavBar from '../../components/navBar';
import Footer from '../../components/footer';

export default class InventoryPage extends Component {
	constructor(props) {
		super(props);

		this.tableRef = React.createRef();
		
        this.state = {
            columns: [
				{ 
					title: 'Avatar', 
					field: 'avatar', 
					headerStyle: {pointerEvents: "none"}, 
					grouping: false, 
					render: rowData => <img src={rowData.avatar} style={{width: 50, height: 50, borderRadius: '50%'}}/>,
					editComponent: props => (
						<div className = "item-pic">
                            <label for="file-input">
                                <i id = "cam" className="fa fa-camera" aria-hidden="true"></i>
                                <img id = "pic" alt = "img" src={props.value || ''}></img>
                            </label>
                            <input id="file-input" type="file" onChange = {event => this.preview(event)}/>
							<span className="tooltiptext">Select an image</span>
                        </div>
					)
				},
				{ 
					title: 'Name', 
					field: 'name' 
				},
				{ 
					title: 'Quantity', 
					field: 'qnt', 
					type: 'numeric' 
				},
				{ 
					title: 'Category', 
					field: 'category',
					lookup: { 0: 'Office material', 1: 'Technologies', 2: 'Field material' },
				},
            ],
            style: {
				  width: '80%',
				  marginTop: '2%',
			},
			img: '',
			selectedFile: null,
			id: decodeURIComponent(window.location.href.substring(window.location.href.lastIndexOf('/') + 1)),
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

	preview = (event) => {
        var reader = new FileReader();
        reader.onload = function() {
            var output = document.getElementById('pic');
            var placeholder = document.getElementById('cam');
            var container = document.querySelector(".item-pic");
            placeholder.style.display = "none";
            output.style.display = "block";
            container.style.paddingTop = "6%";
            container.style.paddingBottom = "6%";
            output.src = reader.result;
        }
        reader.readAsDataURL(event.target.files[0]);
        this.setState({
            selectedFile: event.target.files[0],
            loaded: 0,
        })  
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
            <div id = "inventoryPage">
                <NavBar underline = "4" enable = "1"/>
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

									url = settings.api_link + 'inventory/listing'
									url += '?tableId=' + this.state.id;
		
									fetch(url)
										.then(response => response.json())
										.catch(() => {})
										.then(result => {
											result.docs.map(res => {
												res.avatar = tools
											})

											resolve({
												data: result.docs,
												page: result.page - 1,
												totalCount: result.total,
											})
										})

								})
								
							}      
							editable={{
								onRowAdd: newData =>
									new Promise(async (resolve, reject) => {
										let url

										url = settings.api_link + 'inventory/add'
										url += '?tableId=' + this.state.id;		

										newData.qnt = parseInt(newData.qnt)
										newData.category = parseInt(newData.category)

										fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(newData)})
											.then(result => result.json())
											.catch(() => {})
											.then(res => {
												console.log(res)

												const data = new FormData()
												data.append('file', this.state.selectedFile)
												api.put(`inventory/uploadImage?lineId=${res.insertId}&tableId=${this.state.id}`, data, {})
													.then(res => {})
	
											})
										resolve()
										this.tableRef.current && this.tableRef.current.onQueryChange()
									}),

								onRowUpdate: (newData, oldData) =>
									new Promise((resolve, reject) => {
										let url = settings.api_link + 'users/update'

										const data = new FormData()
        								data.append('file', this.state.selectedFile)

										resolve()
											
										/*fetch(url, {method: 'PUT', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(newData)})
											.then(() => {
												resolve()
												this.tableRef.current && this.tableRef.current.onQueryChange()
											})*/
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
									arrowPosition: 'after'
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