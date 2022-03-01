import './App.css';
import React from 'react';
import { Button, Chip, Paper } from '@mui/material';
import Site from './types/site';
import Xpath from './types/xpath';

interface AppProps{

}
interface AppState{
  sites:Site[]
  selectedSite:Site | null;
}

export default class App extends React.Component<AppProps, AppState> {
  constructor(props:AppProps){
    super(props)
    this.state = {
      sites:[],
      selectedSite:null
    }
    this.getInfos()
  }
  /**
   * Gets info from the storage
   */
  getInfos(){
    chrome.storage?.sync.get(['data'], (result) => {
      if (!result) return;
      if (!result.data) return;
      this.setState({sites:result.data})
    });
  }
  /**
   * Sets info to the storage
   */
  setInfos(sites:Site[]){
    chrome.storage?.sync.set({data: sites});
  }
  /**
   * Handles the removal of a site
   * @param site Site to remove
   */
  handleDeleteSite(site: Site){
    let sites = this.state.sites;
    sites = sites.filter(item => item.url !== site.url)
    this.setState({sites})
    this.setInfos(sites)
  }
  /**
   * Handles the removal of a path
   * @param path Path to remove
   */
  handleDeletePath(path: Xpath){
    let site = this.state.selectedSite;
    if (!site) return;

    site.paths = site.paths.filter(item => item.path !== path.path)
    
    let sites = this.state.sites
    sites.forEach(element => {
      if (element.url === site!!.url){
        element.paths = site!!.paths
      }
    });
    this.setState({sites,selectedSite:site})
    this.setInfos(sites)
  }
  generateSites(){
    return this.state.sites.map((data) => {
      return (
          <Chip
            key={data.url}
            clickable
            label={data.url}
            onDelete={() => this.handleDeleteSite(data)}
            onClick={() => this.handleSiteClick(data)}
          />
      );
    })
  }
  generatePaths(){
    return this.state.selectedSite?.paths.map((data) => {
      return (
          <Chip
            key={data.path}
            label={data.path}
            onDelete={() => this.handleDeletePath(data)}
          />
      );
    })
  }
  /**
   * Set the selected site
   * @param site Site clicked
   */
  handleSiteClick(site : Site){
    this.setState({selectedSite:site})
  }
  /**
   * Adds a site
   */
  addSite(){
    let url
    url = prompt("Enter a URL");
    if (url === null) return;

    let sites = this.state.sites
    sites.push({url:url,separator:"",paths:[]});
    this.setState({sites})
    this.setInfos(sites)
  }
  /**
   * Adds a XPath
   */
  addXPath(){
    let xpath = prompt("Enter a XPath");

    if (xpath === null) return;

    let site = this.state.selectedSite
    
    let sites = this.state.sites
    sites.forEach(element => {
      if (element.url === site!!.url){
        element.paths.push({path:xpath!!})
      }
    });

    this.setState({selectedSite:site,sites:sites})
    this.setInfos(sites)
  }
  /**
   * React to changes from the separator input
   * @param e Event
   */
  handleChangeSeparator(e:any){
    let separator = e.target.value;

    let site = this.state.selectedSite
    
    if (!site) return;

    site.separator = separator;

    let sites = this.state.sites
    sites.forEach(element => {
      if (element.url === site!!.url){
        element.separator = separator
      }
    });

    this.setState({selectedSite:site,sites:sites})
    this.setInfos(sites)
  }

  render(){
    return (
      <div className='App'>
        <h1>Page Text Copy</h1>
        <div className='sites'>
        <Button variant='outlined' onClick={() => this.addSite()}>Add a site</Button>
        <Paper
        className='site-row'
        sx={{
          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          listStyle: 'none',
          p: 0.5,
          m: 0,
        }}
        >
        {this.generateSites()}
        </Paper>
        </div>
        {this.state.selectedSite !== null && <div className='xpaths'>
          <div>
            <label>Separator : </label>
            <textarea className='input' value={this.state.selectedSite.separator} rows={1} onChange={(e)=>this.handleChangeSeparator(e)}/>
          </div>
          <br/>
          <Button variant='outlined' onClick={() => this.addXPath()}>Add a XPath</Button>
          <Paper
          className='site-row'
          sx={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            listStyle: 'none',
            p: 0.5,
            m: 0,
          }}
          >
          {this.generatePaths()}
          </Paper>
        </div>}
      </div>
    );
  }
}