import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Blogs from './blogs.json';

// console.log(Blogs.blogs);

class List extends React.Component {
  constructor() {
    super();
    this.state = {
      initial: [],
      list: [],
      filters: [],
      filter: 'all',
      sortBy: 'date',
      desc: true,
      back: -1,
      lastSort: 'date',
      search: ''
    }
    this.clickFilter = this.clickFilter.bind(this)
    this.addFilters = this.addFilters.bind(this)
    this.eachBlog = this.eachBlog.bind(this)
    this.checkTags = this.checkTags.bind(this)
    this.clickSort = this.clickSort.bind(this)
    this.sortBlogs = this.sortBlogs.bind(this)
    this.searchFilter = this.searchFilter.bind(this)
    this.search = this.search.bind(this)
  }

  componentDidMount() {
    this.setState({list: Blogs.blogs});
    this.setState({filters: Blogs.filters});
  }

  eachBlog(listItem, key) {
    const date = new Date(listItem.published);
    const day = date.getDate();
    const months = ["January", "Febraury", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    const publish = month + " " + day + ", " + year;
    return (
      <div key={key} className='blog quarter'>
        <div>
          <div className='title'>{listItem.title}</div>
          <div className='author'>By {listItem.author}</div>
          <div className='excerpt'>{listItem.excerpt}</div>
        </div>
        <div className='date'>Published {publish}</div>
      </div>
    )
  }

  clickFilter(filterKey, key){
    this.setState({filter: filterKey})
  }

  clickSort(sortKey, key){
    let desc;
    let back;
    if (sortKey === this.state.lastSort){
      desc = false;
      //this.setState({desc: false})
    } else {
      desc = true;
      //this.setState({desc: true})
    }
    if (sortKey === this.state.lastSort && this.state.back === -1){
      // this.setState({forward: -1})
      back = 1;
      //this.setState({back: 1})
    } else {
      // this.setState({forward: 1})
      back = -1;
      //this.setState({back: -1})
    }
    // console.log("descending " + this.state.desc)

    this.setState({
      desc: desc,
      back: back,
      sortBy: sortKey,
      lastSort: sortKey,
    });
  }

  addFilters(filterItem, key) {
    const publish = filterItem;
    const filterKey = publish.toLowerCase();
    const buttonClass = (filterKey === this.state.filter)?'active':'';
    return (
      <li key={filterKey}>
        <button className={buttonClass} onClick={() => this.clickFilter(filterKey)}>{publish}</button>
      </li>
    )
  }

  checkTags(listItem, key) {
    if (this.state.filter === 'all'){
      return true;
    } else {
      const tagMatch = listItem.tags.find((tag) => {
        return tag === this.state.filter;
      })
      if (tagMatch === undefined) {
        return false;
      } else {
        return true;
      }
    }
  }

  sortBlogs(a, b){
    var aBlog =  "";
    var bBlog = "";
    if(this.state.sortBy === 'title') {
      aBlog =  a.title.toLowerCase();
      bBlog = b.title.toLowerCase();
      if (aBlog < bBlog)
       return this.state.back;
      if (aBlog > bBlog)
       return -this.state.back;
      return 0;
    } else if (this.state.sortBy === 'author') {
      aBlog =  a.author.toLowerCase();
      bBlog = b.author.toLowerCase();
      if (aBlog < bBlog)
      return this.state.back;
      if (aBlog > bBlog)
      return -this.state.back;
      return 0;
    } else if (this.state.sortBy === 'date') {
      aBlog =  a.published.toLowerCase();
      bBlog = b.published.toLowerCase();
      if (aBlog < bBlog)
      return -this.state.back;
      if (aBlog > bBlog)
       return this.state.back;
      return 0;
    } else {

    }
  }

  search(event) {
    const target = event.target;
    const value = target.value;
    this.setState({search: value})
  }

  searchFilter(listItem, key) {
    const title =  listItem.title.toLowerCase();
    const author =  listItem.author.toLowerCase();
    const excerpt =  listItem.excerpt.toLowerCase();
    const search = this.state.search.toLowerCase();
    const tagMatch = listItem.tags.find((tag) => {
      return tag.toLowerCase().indexOf(search) > -1
    })


    console.log("Tag Match " + tagMatch + ", Search: " + search)
    if(title.includes(search) || author.includes(search) || excerpt.includes(search) || tagMatch){
      return true
    } else {
      return false
    }
  }

  render() {
    return (
      <div className="contain">
        <h3>Filter results</h3>
        <ul>{this.state.filters.map(this.addFilters)}</ul>
        <h3>Sort by</h3>
        <ul>
          <li><button className={(this.state.sortBy === 'title')?'active':''} onClick={() => this.clickSort("title")}>Title</button></li>
          <li><button className={(this.state.sortBy === 'author')?'active':''} onClick={() => this.clickSort("author")}>Author</button></li>
          <li><button className={(this.state.sortBy === 'date')?'active':''} onClick={() => this.clickSort("date")}>Date</button></li>
        </ul>
        <form><input type="text" placeholder="Search" onChange={this.search}></input></form>
        <div className="blogs">{this.state.list.filter(this.checkTags).filter(this.searchFilter).sort(this.sortBlogs).map(this.eachBlog)}</div>
      </div>
    );
  }
}


ReactDOM.render(
  <List />,
  document.getElementById('root')
);
