import React from "react";
import Masonry from "react-masonry-css";
import "./App.css";
import UnsplashLogo from "./images/Unsplash_Symbol.png"
require('dotenv').config()

class Unsplash extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      images: [],
      modal: {
        active: false,
        state: "",
      },
      search: "",
      delete: 0,
      error: ''
    };

    this.openModal = this.openModal.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.handleChildClick = this.handleChildClick.bind(this);
    this.addPhoto = this.addPhoto.bind(this);
    this.deleteModal = this.deleteModal.bind(this);
    this.search = this.search.bind(this);
    this.deleteImg = this.deleteImg.bind(this);
    this.getPhotos = this.getPhotos.bind(this);
  }

  componentDidMount() {
    this.getPhotos()
  }

  getPhotos() {
    fetch("https://gallery-lucas.herokuapp.com/image-list")
    .then(res => res.json())
    .then(data => {
      this.setState(() => ({
        images: data
      }))
    })
  }

  async addPhoto(e) {
    e.preventDefault();
    let data = {
      label: e.target[0].value, 
      url: e.target[1].value
    }
    let jsonData = JSON.stringify(data)
    fetch("https://gallery-lucas.herokuapp.com/image-list-add", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: jsonData
    })
    .then(res => res.json())
    .then(data => {
      e.target[0].value = "";
      e.target[1].value = "";
      this.closeModal()
      this.getPhotos()
    })
    .catch(error => {
      console.log(error)
    })
  }

  deleteModal(e) {
    this.setState(() => ({
      modal: {
        active: true,
        state: "delete",
      },
      delete: e.target.attributes.imagenr.value,
    }));
  }

  deleteImg(e) {
    e.preventDefault();
    fetch("https://gallery-lucas.herokuapp.com/image-list-delete", {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({"index": e.target[1].value, "password": e.target[0].value})
    })
    .then(res => res.json())
    .then(data => {
      console.log(data)
      if(data.Response === "Success") {
        e.target[0].value = ''
        e.target[1].value = ''
        this.closeModal()
        this.getPhotos()
      } else {
        this.setState(() => ({
          error: data.Response
        }))
      }
    })
    .catch(error => {
      console.log(error)
    })
  }

  search(e) {
    this.setState(() => ({
      search: e.target.value,
    }));
  }

  openModal(e) {
    this.setState(() => ({
      modal: {
        active: true,
        state: e.target.attributes.modalbtn.value,
      },
    }));
  }

  closeModal(e) {
    this.setState(() => ({
      modal: { active: false, state: '' },
      error: ''
    }));
  }

  handleChildClick(e) {
    e.stopPropagation();
  }

  render() {
    let galleryImgs = [];
    let gallery = [];
    if(this.state.images.length > 0) {
    galleryImgs =
      this.state.search !== ""
        ? this.state.images.filter((img) => img.label.match(this.state.search))
        : this.state.images;
    gallery = galleryImgs.map((image) => {
      return (
        <div className="image">
          <img src={image.url} alt={image.label} width="100%" />
          <div className="image-overlay">
            <div
              className="smallBtn"
              imagenr={this.state.images.indexOf(image)}
              modalbtn="add"
              onClick={this.deleteModal}
            >
              Delete
            </div>
            <h4>{image.label}</h4>
          </div>
        </div>
      );
    });
  }

    const breakpointColumnsObj = {
      default: 3,
      700: 2,
      500: 1,
    };

    return (
      <div id="container">
        {this.state.modal.active === true && (
          <div id="modal-container" onClick={this.closeModal}>
            {this.state.modal.state === "add" && (
              <div id="modal" onClick={this.handleChildClick}>
                <h3>Add a new photo</h3>
                <form onSubmit={this.addPhoto}>
                  <label>Label</label>
                  <input
                    type="text"
                    id="add-new-label"
                    placeholder="Deathly Romantic"
                    required
                  ></input>
                  <label>Photo URL</label>
                  <input
                    type="text"
                    id="add-new-photo-url"
                    placeholder="https://images.unsplash.com/photo-1635586668235-6e1457115785"
                    required
                  ></input>
                  <div className="modal-buttons">
                    <button
                      className="secondary-btn"
                      onClick={this.closeModal}
                      type="button"
                    >
                      Cancel
                    </button>
                    <button>Submit</button>
                  </div>
                </form>
              </div>
            )}
            {this.state.modal.state === "delete" && (
              <div id="modal" onClick={this.handleChildClick}>
                <h3>
                  Are you sure you want to delete "
                  {this.state.images[this.state.delete].label}"?
                </h3>
                <form onSubmit={this.deleteImg}>
                  <label>Password</label>
                  <input
                    type="password"
                    id="delete-password"
                    placeholder="**********"
                    required
                  ></input>
                  {this.state.error !== '' && (
                    <p style={{color: '#EB5757', fontSize: '0.7rem'}}>{this.state.error}</p>
                  )}
                  <input type="hidden" value={this.state.delete} />
                  <div className="modal-buttons">
                    <button
                      className="secondary-btn"
                      onClick={this.closeModal}
                      type="button"
                    >
                      Cancel
                    </button>
                    <button className="danger-btn">Delete</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
        <header>
          <div id="header-left">
            <img src={UnsplashLogo} alt="Unsplash Logo" height="30px" />
            <p>
              <strong>My Unsplash</strong>
              <br />
              devchallenges.io
            </p>
          </div>
          <div id="header-right">
          <div className="icon-input">
              <input
                type="search"
                id="image-search"
                placeholder="Search by Label"
                onChange={this.search}
                value={this.state.search}
              ></input>
              <i className="fas fa-search"></i>
            </div>
            <button id="add_photo" modalbtn="add" onClick={this.openModal}>
              Add a photo
            </button>
          </div>
        </header>
        <div id="content">
          {gallery.length === 0 ? (
            <div id="no-images">
              <h3>There are no images saved in this Gallery</h3>
            </div>
          ) : (
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {gallery}
            </Masonry>
          )}
        </div>
        <footer>
          <p>Created by <a href="https://www.github.com/LucaswithC" target="_blank" rel="noreferrer">Lucas</a></p>
          <p>Photos from <a href="https://unsplash.com/" target="_blank" rel="noreferrer">Unsplash</a>. Copyright belongs to the Artists.</p>
        </footer>
      </div>
    );
  }
}

export default Unsplash;
