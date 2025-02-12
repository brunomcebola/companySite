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
					title: 'Image', 
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
					lookup: { 0: 'Wiring', 1: 'Light', 2: 'Sound', 3: 'Motion', 4: 'Control' },
				},
				{ 
					title: 'Location', 
					field: 'location',
					lookup: { 0: 'Green box', 1: 'Black box', 2: 'Red Box', 3: 'White box', 4: 'Mini box', 5: 'Blue ' },
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
	
	name = async () => {
		let res = await api.get(`/inventory/getTableName?tableId=${this.state.id}`); 
		return res.data ? res.data[0].name : 'inventory'
	}

	async componentDidMount () {
		let title = document.querySelector('.MTableToolbar-title-37 .MuiTypography-h6')
		title.innerHTML = await this.name()
	}

    render() {
        return (
            <div id = "inventoryPage">
                <NavBar underline = "4" enable = "1"/>
                <div id = "MaterilTableContainer">
					<MuiThemeProvider theme={this.theme}>
						<MaterialTable
							title="Inventory"
							tableRef={this.tableRef}
							columns={this.state.columns}
							style = {this.state.style} 
							data={query => 
								new Promise((resolve, reject) => {
									let url

									url = settings.api_link + 'inventory/listing'
									url += '?tableId=' + this.state.id;
									url += '&per_page='+ query.pageSize 
									url += '&page=' + (query.page + 1)
									url += '&order=' + (query.orderBy ? query.orderBy.field : '')
									url += '&dir=' + query.orderDirection
									url += '&search=' + query.search
		
									fetch(url)
										.then(response => response.json())
										.catch(() => {})
										.then(result => {
											if(result) {
												result.docs.map(res => {
													if(res.img){
														var base64Flag = 'data:image/jpeg;base64,';
														var imageStr = this.arrayBufferToBase64(res.img.data);
														res.avatar = base64Flag + imageStr
													}
													else{
														res.avatar = tools
													}
												})
												resolve({
													data: result.docs,
													page: result.page - 1,
													totalCount: result.total,
												})
											}
											else resolve({
												data: [],
												page: 0,
												totalCount: 0,
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
												if(this.state.selectedFile && res) {
													const data = new FormData()
													data.append('file', this.state.selectedFile)
													api.put(`inventory/uploadImage?lineId=${res.insertId}&tableId=${this.state.id}`, data, {})
														.then(res => {})
												}
											})
										resolve()
										this.tableRef.current && this.tableRef.current.onQueryChange()
									}),

								onRowUpdate: (newData, oldData) =>
									new Promise((resolve, reject) => {		

										let {img, img_name, avatar, ...update} = newData;
										update.qnt = parseInt(newData.qnt)
										update.category = parseInt(newData.category)

										let url
										url = settings.api_link + 'inventory/updateItem'
										url += '?tableId=' + this.state.id;		
										
										fetch(url, {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(update)})
											.then(result => result.json())
											.catch(() => {})
											.then(res => {
												if(this.state.selectedFile) {
													const data = new FormData()
													data.append('file', this.state.selectedFile)
													api.put(`inventory/uploadImage?lineId=${update.id}&tableId=${this.state.id}`, data, {})
														.then(res => {})
												}
											})

										resolve()
										this.tableRef.current && this.tableRef.current.onQueryChange()
									}),

								onRowDelete: oldData =>
									new Promise((resolve, reject) => {
										fetch(`${settings.api_link}inventory/deleteItem?tableId=${this.state.id}&lineId=${oldData.id}`, {method: 'DELETE'})
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
								exportButton: true
							}}
							localization={{
								body: {editRow: { deleteText: 'Are you sure you want to delete this item?' }},
								grouping: { placeholder: "Drag headers here to group the items..."}
							}}
						/>
					</MuiThemeProvider>
				</div>
                <Footer />
            </div>
        )
    }
}